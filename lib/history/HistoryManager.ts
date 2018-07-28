import Sequelize from 'sequelize';
import CryptoCompareClient, { HistoryEntry, HistoryType } from './CryptoCompareClient';
import HistoryManagerRepository from './HistoryManagerRepository';
import { getPairId } from '../Utils';
import * as db from '../types/DB';

type History = {
  price: number,
  change: number,
  hour?: number[],
  day?: number[],
  week?: number[],
  month?: number[],
  threeMonth?: number[],
  year?: number[],
  twoYears?: number[],
};

enum HistoryInterval {
  Hour,
  Day,
  Week,
  Month,
  ThreeMonths,
  Year,
  TwoYears,
}

const HistoryIntervalValues: { [ interval: string ]: { name: string, type: HistoryType, limit: number } } = {
  [HistoryInterval.Hour]: { name: 'hour', type: HistoryType.Minutely, limit: 60 },
  [HistoryInterval.Day]: { name: 'day', type: HistoryType.Minutely, limit: 1440 },
  // A week has 168 hours but I will use 170 for the sake of simplicity
  // The difference is neglicable because we are averaging the values anyway
  [HistoryInterval.Week]: { name: 'week', type: HistoryType.Hourly, limit: 170 },
  [HistoryInterval.Month]: { name: 'month', type: HistoryType.Daily, limit: 30 },
  [HistoryInterval.ThreeMonths]: { name: 'threeMonths', type: HistoryType.Daily, limit: 90 },
  [HistoryInterval.Year]: { name: 'year', type: HistoryType.Daily, limit: 365 },
  [HistoryInterval.TwoYears]: { name: 'twoYears', type: HistoryType.Daily, limit: 730 },
};

// TODO: update regularly
// TODO: is storing historical data in the database necessary?
class HistoryManager {

  public history: Map<String, History> = new Map<String, History>();

  private cryptoCompare = new CryptoCompareClient();
  private historyRepo: HistoryManagerRepository;

  constructor(models: Sequelize.Models) {
    this.historyRepo = new HistoryManagerRepository(models);
  }

  public init = async () => {
    const histories = await this.historyRepo.getHistories();

    const historyIntervals: string[] = [];
    for (const interval in HistoryInterval) {
      if (isNaN(Number(interval))) {
        historyIntervals.push(HistoryIntervalValues[HistoryInterval[interval]].name);
      }
    }

    histories.forEach((history) => {
      this.history[history.id] = {
        price: history.price,
        change: history.change,
      };

      historyIntervals.forEach((interval) => {
        this.history[history.id][interval] = JSON.parse(history[interval]);
      });
    });
  }

  public initHistory = async (base: string, quote: string) => {
    await this.historyRepo.addHistory({ base, quote });

    this.history[getPairId(base, quote)] = {};

    await Promise.all([
      this.updatePrice([base], quote),
      this.updateMinutelyHistory(base, quote),
      this.updateHourlyHistory(base, quote),
      this.updateDailyHistory(base, quote),
    ]);
  }

  public updatePrice = async (base: string[], quote: string) => {
    const prices = await this.cryptoCompare.getPrices(quote, base);
    Object.keys(prices).forEach((key) => {
      const price = this.roundTwoDecimals(prices[key]);
      this.history[getPairId(key, quote)].price = price;
      this.historyRepo.updateHistory({
        price,
        quote,
        base: key,
      });
    });
  }

  public updateMinutelyHistory = async (base: string, quote: string) => {
    await this.updateMultipleIntervals(base, quote, [
      HistoryInterval.Hour,
      HistoryInterval.Day,
    ]);
  }

  public updateHourlyHistory = async (base: string, quote: string) => {
    await this.updateMultipleIntervals(base, quote, [HistoryInterval.Week]);
  }

  public updateDailyHistory = async (base: string, quote: string) => {
    await this.updateMultipleIntervals(base, quote, [
      HistoryInterval.Month,
      HistoryInterval.ThreeMonths,
      HistoryInterval.Year, HistoryInterval.TwoYears,
    ]);
  }

  // Works only if all intervals have the same HistoryType
  // The last value in intervals has to be the one with the highest limit
  private updateMultipleIntervals = async (base: string, quote: string, intervals: HistoryInterval[]) => {
    const pairId = getPairId(base, quote);
    const historyFactory: db.HistoryFactory = { base, quote };

    const { type, limit } = HistoryIntervalValues[intervals[intervals.length - 1]];
    const { Data } = await this.cryptoCompare.getHistory(type, base, quote, limit);

    // Set 'change' value if relevant data is updated
    if (intervals.includes(HistoryInterval.Day)) {
      const yesterday = this.calculateHistoryEntry(Data[0]);
      const today = this.calculateHistoryEntry(Data[HistoryIntervalValues[HistoryInterval.Day].limit - 1]);

      const change = this.roundTwoDecimals(((today - yesterday) / today) * 100);
      this.history[pairId].change = change;
      historyFactory.change = change;
    }

    intervals.forEach((interval) => {
      const dataClone = Object.assign([], Data);
      const intervalValues = HistoryIntervalValues[interval];

      const value = this.parseData(dataClone.splice(limit - intervalValues.limit));

      this.history[pairId][intervalValues.name] = value;
      historyFactory[intervalValues.name] = JSON.stringify(value);
    });

    await this.historyRepo.updateHistory(historyFactory);
  }

  private parseData = (data: HistoryEntry[]): number[] => {
    const result: number[] = [];
    const resultAmount = 20;

    const spliceEntries = Math.floor(data.length / resultAmount);
    const divider = this.calculateDivider(data, resultAmount);

    for (let i = 0; i < resultAmount; i = i + 1) {
      const temp: number[] = [];

      const spliceAmount = this.calculateSpliceAmount(i, divider, spliceEntries);
      const splice = data.splice(0, spliceAmount);

      splice.forEach((value) => {
        temp.push(this.calculateHistoryEntry(value));
      });

      const value = this.calculateMedian(temp);
      result.push(this.roundTwoDecimals(value));
    }

    return result;
  }

  private calculateDivider = (data: HistoryEntry[], resultAmount: number): number => {
    const spliceEntries = data.length / resultAmount;
    const decimal = spliceEntries % 1;

    if (decimal !== 0) {
      const result = 1 / decimal;

      if (result % 1 === 0) {
        return result;
      } else {
        throw `Could not parse data with length ${data.length}`;
      }
    } else {
      return 0;
    }
  }

  private calculateSpliceAmount = (index: number, divider: number, spliceEntries: number): number => {
    if (divider !== 0) {
      return (index + 1) % divider === 0 ? (spliceEntries + 1) : spliceEntries;
    } else {
      return spliceEntries;
    }
  }

  private calculateHistoryEntry = (data: HistoryEntry): number => {
    return (data.open + data.close) / 2;
  }

  private calculateMedian = (values: number[]): number => {
    values.sort();

    const { length } = values;
    if (length > 1) {
      const mid = Math.floor(values.length / 2);

      if (length % 2 === 0) {
        return (values[mid - 1] + values[mid]) / 2;
      } else {
        return values[mid - 1];
      }
    } else {
      return values[0];
    }
  }

  private roundTwoDecimals = (number: number): number => {
    return Math.round(number * 100) / 100;
  }
}

export default HistoryManager;
export { History };
