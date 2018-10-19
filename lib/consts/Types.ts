import { Network } from 'bitcoinjs-lib';
import Wallet from '../wallet/Wallet';
import ChainClient from '../chain/ChainClient';
import LndClient from '../lightning/LndClient';

export type Error = {
  message: string;
  code: string;
};

export type ScriptElement = Buffer | number;

export type Currency = {
  symbol: string;
  wallet: Wallet;
  network: Network;
  chainClient: ChainClient;
  lndClient: LndClient;
};

export type Pair = {
  base: Currency;
  quote: Currency;
};
