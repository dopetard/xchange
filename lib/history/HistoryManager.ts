import CryptoCompareClient, { HistoryEntry, HistoryType } from './CryptoCompareClient';

enum HistoryInterval {
  Day,
  Week,
  Month,
  ThreeMonths,
  Year,
}

const HistoryIntervalValues: { [ interval: string ]: { type: HistoryType, limit: number } } = {
  [HistoryInterval.Day]: { type: HistoryType.Minutely, limit: 1440 },
  // A week has 168 hours but I will use 170 for the sake of simplicity
  // The difference is neglicable because we are averaging the values anyway
  [HistoryInterval.Week]: { type: HistoryType.Hourly, limit: 170 },
  [HistoryInterval.Month]: { type: HistoryType.Minutely, limit: 30 },
  [HistoryInterval.ThreeMonths]: { type: HistoryType.Minutely, limit: 90 },
  // Same as above. We are not using the correct for the sake of simplicity
  [HistoryInterval.Year]: { type: HistoryType.Minutely, limit: 360 },
};

class HistoryManager {

  private cryptoCompare = new CryptoCompareClient();

  // public initHistory = async (base: string, quote: string) => {};

  public getHistory = async (interval: HistoryInterval, base: string, quote: string): Promise<number[]> => {
    const { type, limit } = HistoryIntervalValues[interval];
    const data = await this.cryptoCompare.getHistory(type, base, quote, limit);
    return this.parseData(data.Data);
  }

  // Works if the number of entries is divisable by either 20 or 10
  private parseData = (data: HistoryEntry[]): number[] => {
    const result: number[] = [];
    const resultAmount = 20;

    const sliceEntries = Math.floor(data.length / resultAmount);
    const divider = data.length / resultAmount % 1 === 0 ? 1 : 2;

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

  private calculateSpliceAmount = (index: number, divider: number, sliceEntries: number): number => {
    if (divider !== 1) {
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
