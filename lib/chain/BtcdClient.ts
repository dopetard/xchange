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

interface BtcdClient {
  on(event: 'error', listener: (error: string) => void): this;
  emit(event: 'error', error: string): boolean;
}

class BtcdClient extends EventEmitter implements ChainClient, BtcdClient {
  public static readonly serviceName = 'BTCD';

  private rpcClient: RpcClient;

  constructor(config: RpcConfig) {
    super();

    this.rpcClient = new RpcClient(config);
    this.rpcClient.on('error', error => this.emit('error', error));
  }

  private bindWs = (rpcClient: RpcClient) => {
    rpcClient.ws.on('OnRelevantTxAccepted', (data: any) => {
      console.log(data);
    });
    rpcClient.ws.on('RelevantTxAccepted', (data: any) => {
      console.log(data);
    });
    rpcClient.ws.on('onrelevanttxaccepted', (data: any) => {
      console.log(data);
    });
    rpcClient.ws.on('relevanttxaccepted', (data: any) => {
      console.log(data);
    });
  }

  public connect = async () => {
    await this.rpcClient.connect();

    this.bindWs(this.rpcClient);
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

  public loadTxFiler = (reload: boolean, addresses: string[], outpoints: string[]) => {
    // tslint:disable-next-line no-null-keyword
    return this.rpcClient.call<null>('loadtxfilter', reload, addresses, outpoints);
  }
}

export default BtcdClient;
export { BtcdConfig, Info };
