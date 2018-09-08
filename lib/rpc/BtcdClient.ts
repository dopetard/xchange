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

// TODO: listen to transactions sent to specifc addresses
class BtcdClient {

  private rpcClient: RpcClient;

  constructor(config: RpcConfig) {
    this.rpcClient = new RpcClient(config);
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
