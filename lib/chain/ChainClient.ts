import { EventEmitter } from 'events';
import { ChainType } from '../consts/ChainType';
import { Block, Info } from '../consts/Types';
import RpcClient, { RpcConfig } from '../RpcClient';
import ChainClientInterface from './ChainClientInterface';

interface ChainClientEvents {
  on(event: 'error', listener: (error: string) => void): this;
  on(event: 'transaction', listener: (transactionHex: string) => void): this;
  emit(event: 'error', error: string): boolean;
  emit(event: 'transaction', transactionHex: string): boolean;
}

class ChainClient extends EventEmitter implements ChainClientInterface, ChainClientEvents {
  public readonly serviceName: ChainType;

  private rpcClient: RpcClient;

  constructor(config: RpcConfig, serviceName: ChainType) {
    super();

    this.serviceName = serviceName;
    this.rpcClient = new RpcClient(config);
    this.rpcClient.on('error', error => this.emit('error', error));
  }

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

export default ChainClient;
export { Info, Block };
