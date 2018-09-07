import Logger from './Logger';
import BtcdClient from './rpc/BtcdClient';
import { RpcConfig } from './rpc/RpcClient';

type Config = {
  logfile: string;
  rpc: RpcConfig;
};

class Walli {

  private logger: Logger;
  private btcdClient: BtcdClient;

  constructor(config: Config) {
    this.logger = new Logger(config.logfile);
    this.btcdClient = new BtcdClient(config.rpc);
  }

  public start = async () => {
    try {
      await this.btcdClient.connect();
      this.logger.verbose('connected to BTCD');
    } catch (error) {
      this.logger.error(`could not connect to BTCD: ${JSON.stringify(error)}`);
    }
  }
}

export default Walli;
