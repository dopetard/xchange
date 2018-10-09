import BaseClient from '../BaseClient';
import { Info, Block } from '../consts/ChainType';

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
  getBlock(blockHash: string): Promise<Block>;
  getRawTransaction(transactionHash: string): Promise<any>;
  generate(blocks: number): Promise<string[]>;
}

export default ChainClientInterface;
