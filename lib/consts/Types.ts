import { Out } from 'bitcoinjs-lib';
import { OutputType } from '../proto/xchangerpc_pb';

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
