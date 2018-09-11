import { EventEmitter } from 'events';
import RpcClient, { RpcConfig } from './RpcClient';

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

// TODO: listen to transactions sent to specifc addresses
class BtcdClient extends EventEmitter {

  private rpcClient: RpcClient;

  constructor(config: RpcConfig) {
    super();

    this.rpcClient = new RpcClient(config);
    this.rpcClient.on('error', error => this.emit('error', error));
  }

  public connect = () => {
    return this.rpcClient.connect();
  }

  public getInfo = (): Promise<Info> => {
    return this.rpcClient.call<Info>('getinfo');
  }

  public sendRawTransaction = (rawTransaction: string, allowHighFees = true): Promise<string> => {
    return this.rpcClient.call<string>('sendrawtransaction', rawTransaction, allowHighFees);
  }
}

export default BtcdClient;
