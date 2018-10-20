import { Out } from 'bitcoinjs-lib';
import Wallet from '../wallet/Wallet';
import { OutputType } from './OutputType';
import ChainClient from '../chain/ChainClient';
import LndClient from '../lightning/LndClient';

export type Error = {
  message: string;
  code: string;
};

export type ScriptElement = Buffer | number;

export type TransactionOutput = {
  txHash: Buffer;
  vout: number;
  type: OutputType;
} & Out;

export type Currency = {
  symbol: string;
  wallet: Wallet;
  chainClient: ChainClient;
  lndClient: LndClient;
};

export type Pair = {
  base: Currency;
  quote: Currency;
};
