import https from 'https';

type HistoryReponse = {
  Response: string;
  Type: number;
  Aggregated: boolean;
  Data: HistoryEntry[];
  TimeTo: number;
  TimeFrom: number;
  FirstValueInArray: boolean;
  ConversionType: ConversionType;
};

type HistoryEntry = {
  time: number;
  close: number;
  high: number;
  low: number;
  open: number;
  volumefrom: number;
  volumeto: number;
};

type ConversionType = {
  type: string;
  conversionSymbol: string;
};

enum HistoryType {
  Daily = 'histoday',
  Hourly = 'histohour',
  Minutely = 'histominute',
}

// TODO: error handling
class CryptoCompareClient {

  private api = 'https://min-api.cryptocompare.com/data/';

  public getPrices = async (baseCurrency: string, quoteCurrencies: string[]): Promise<{ [ curreny: string ]: number }> => {
    let quotes: string = '';
    quoteCurrencies.forEach(quoteCurrency => quotes += `${quoteCurrency},`);

    const response = await this.sendRequest<{ [currency: string]: number }>('price', [
      {
        key: 'fsym',
        value: baseCurrency,
      },
      {
        key: 'tsyms',
        value: quotes,
      },
    ]);

    Object.keys(response).forEach((key) => {
      response[key] = 1 / response[key];
    });

    return response;
  }

  public getHistory = async (type: HistoryType, baseCurrency: string, quoteCurrency: string, limit: number): Promise<HistoryReponse> => {
    return this.sendRequest<HistoryReponse>(type, [
      {
        key: 'fsym',
        value: baseCurrency,
      },
      {
        key: 'tsym',
        value: quoteCurrency,
      },
      {
        key: 'limit',
        // They start couting at 0
        value: limit - 1,
      },
    ]);
  }

  private sendRequest = async <T>(endpoint: string, args: { key: string, value: any}[]): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      let parameters = '';
      args.forEach(arg => parameters += `${arg.key}=${arg.value}&`);

      https.get(`${this.api}${endpoint}?${parameters}`, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(body));
        });

        res.on('error', (error) => {
          reject(error);
        });

      }).on('error', (error) => {
        reject(error);
      });
    });
  }
}

export default CryptoCompareClient;
export { HistoryEntry, HistoryType };
