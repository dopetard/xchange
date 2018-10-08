import ChainOps from './ChainOps';
import { RpcConfig } from '../RpcClient';

class LtcdClient extends ChainOps {
  constructor(config: RpcConfig, serviceName: string) {
    super(config, serviceName);
  }
}

export default LtcdClient;
