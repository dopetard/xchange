export type Error = {
  message: string;
  code: string;
};

export type ScriptElement = Buffer | number;

export enum ChainTypes {
  LTC = 'LTC',
  BTC = 'BTC',
}
