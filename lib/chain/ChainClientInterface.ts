import BaseClient from '../BaseClient';

type Info = {
  version: number;
  protocolversion: number;
  blocks: number;
  timeoffset: number;
  connections: number;
  proxy: string;
  difficulty: number;
  testnet: boolean;
  relayfee: number;
};

type BestBlock = {
  hash: string,
  height: number,
};

type Block = {
  hash: string;
  confirmations: number;
  strippedsize: number;
  size: number;
  weight: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  tx: string[];
  time: number;
  nonce: number;
  bits: string;
  difficulty: number;
  previousblockhash: string;
  nextblockhash: string;
};

/**
 * A generic interface that can be used for multiple chain nodes and implementations
 */
interface ChainClientInterface extends BaseClient {
  sendRawTransaction(rawTransaction: string): Promise<any>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getInfo(): Promise<Info>;
  sendRawTransaction(rawTransaction: string, allowHighFees: boolean): Promise<string>;
  loadTxFiler (reload: boolean, addresses: string[], outpoints: string[]): Promise<null>;
  getBestBlock(): Promise<BestBlock>;
  getBlock(blockHash: string): Promise<Block>;
  getRawTransaction(transactionHash: string): Promise<any>;
  generate(blocks: number): Promise<string[]>;
}

export default ChainClientInterface;
export { Info, BestBlock, Block };
