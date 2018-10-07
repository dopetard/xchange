import { EventEmitter } from 'events';
import RpcClient, { RpcConfig } from '../RpcClient';
import ChainClient from './ChainClient';

type BtcdConfig = RpcConfig;

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

interface BtcdClient {
  on(event: 'error', listener: (error: string) => void): this;
  on(event: 'transaction', listener: (transactionHex: string) => void): this;
  emit(event: 'error', error: string): boolean;
  emit(event: 'transaction', transactionHex: string): boolean;
}

class BtcdClient extends EventEmitter implements ChainClient, BtcdClient {
  public static readonly serviceName = 'BTCD';

  private rpcClient: RpcClient;

  constructor(config: RpcConfig) {
    super();

    this.rpcClient = new RpcClient(config);
    this.rpcClient.on('error', error => this.emit('error', error));
  }

  // TODO: make more efficient: don't parse JSON twice
  private bindWs = () => {
    this.rpcClient.on('message.orphan', (data) => {
      if (data.method === 'relevanttxaccepted') {
        const transactions = data.params;

        transactions.forEach((transaction) => {
          this.emit('transaction', transaction);
        });
      }
    });
  }

  public connect = async () => {
    await this.rpcClient.connect();

    this.bindWs();
  }

  public disconnect = async () => {
    await this.rpcClient.close();
  }

  public getInfo = (): Promise<Info> => {
    return this.rpcClient.call<Info>('getinfo');
  }

  public sendRawTransaction = (rawTransaction: string, allowHighFees = true): Promise<string> => {
    return this.rpcClient.call<string>('sendrawtransaction', rawTransaction, allowHighFees);
  }

  public loadTxFiler = (reload: boolean, addresses: string[], outpoints: string[]): Promise<null> => {
    // tslint:disable-next-line no-null-keyword
    return this.rpcClient.call<null>('loadtxfilter', reload, addresses, outpoints);
  }

  public getBlock = (blockHash: string): Promise<Block> => {
    return this.rpcClient.call<Block>('getblock', blockHash);
  }

  public getRawTransaction = (transactionHash: string) => {
    return this.rpcClient.call<any>('getrawtransaction', transactionHash);
  }

  public generate = (blocks: number): Promise<string[]> => {
    return this.rpcClient.call<string[]>('generate', blocks);
  }
}

export default BtcdClient;
export { BtcdConfig, Info };
