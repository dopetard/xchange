import ChainOps from './ChainOps';
import { RpcConfig } from '../RpcClient';

class BtcdClient extends ChainOps {
  constructor(config: RpcConfig, serviceName: string) {
    super(config, serviceName);
  }
}

export default BtcdClient;
