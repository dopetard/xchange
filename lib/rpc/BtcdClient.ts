import RpcClient, { RpcConfig } from './RpcClient';

// TODO: add broadcasting of raw transaction
// TODO: listen to transactions sent to specifc addresses
class BtcdClient {

  private rpcClient: RpcClient;

  constructor(config: RpcConfig) {
    this.rpcClient = new RpcClient(config);
  }

  public connect = async () => {
    await this.rpcClient.connect();
  }

  public getInfo = () => {
    return this.rpcClient.call('getinfo');
  }

}

export default BtcdClient;
