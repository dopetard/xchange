import CryptoCompareClient, { HistoryEntry, HistoryType } from './CryptoCompareClient';

enum HistoryInterval {
  Hour,
  Day,
  Week,
  Month,
  ThreeMonths,
  Year,
  TwoYears,
}

const HistoryIntervalValues: { [ interval: string ]: { type: HistoryType, limit: number } } = {
  [HistoryInterval.Hour]: { type: HistoryType.Minutely, limit: 60 },
  [HistoryInterval.Day]: { type: HistoryType.Minutely, limit: 1440 },
  // A week has 168 hours but I will use 170 for the sake of simplicity
  // The difference is neglicable because we are averaging the values anyway
  [HistoryInterval.Week]: { type: HistoryType.Hourly, limit: 170 },
  [HistoryInterval.Month]: { type: HistoryType.Daily, limit: 30 },
  [HistoryInterval.ThreeMonths]: { type: HistoryType.Daily, limit: 90 },
  [HistoryInterval.Year]: { type: HistoryType.Daily, limit: 365 },
  [HistoryInterval.TwoYears]: { type: HistoryType.Daily, limit: 730 },
};

class HistoryManager {

  private cryptoCompare = new CryptoCompareClient();

  // public initHistory = async (base: string, quote: string) => {};

  public getHistory = async (interval: HistoryInterval, base: string, quote: string): Promise<number[]> => {
    const { type, limit } = HistoryIntervalValues[interval];
    const data = await this.cryptoCompare.getHistory(type, base, quote, limit);
    return this.parseData(data.Data);
  }

  private parseData = (data: HistoryEntry[]): number[] => {
    const result: number[] = [];
    const resultAmount = 20;

    const sliceEntries = Math.floor(data.length / resultAmount);
    const divider = this.calculateDivider(data, resultAmount);

    for (let i = 0; i < resultAmount; i = i + 1) {
      let temp = 0;

      const spliceAmount = this.calculateSpliceAmount(i, divider, sliceEntries);
      const splice = data.splice(0, spliceAmount);

      splice.forEach((value) => {
        temp += this.calculateAverage(value);
      });

      // TODO: use mean instead of average
      result.push(this.roundTwoDecimals(temp / spliceAmount));
    }

    return result;
  }

  private calculateDivider = (data: HistoryEntry[], resultAmount: number): number => {
    const sliceEntries = data.length / resultAmount;
    const decimal = sliceEntries % 1;

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

  private calculateSpliceAmount = (index: number, divider: number, sliceEntries: number): number => {
    if (divider !== 0) {
      return (index + 1) % divider === 0 ? (sliceEntries + 1) : sliceEntries;
    } else {
      return sliceEntries;
    }
  }

  private calculateAverage = (data: HistoryEntry): number => {
    return (data.open + data.close) / 2;
  }

  private roundTwoDecimals = (number: number) => {
    return Math.round(number * 100) / 100;
  }
}

export default HistoryManager;
export { HistoryInterval };
