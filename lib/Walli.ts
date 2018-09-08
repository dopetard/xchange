import Logger from './Logger';
import BtcdClient from './rpc/BtcdClient';
import { RpcConfig } from './rpc/RpcClient';

type Config = {
  logfile: string;
  loglevel: string;
  rpc: RpcConfig;
};

class Walli {

  private logger: Logger;
  private btcdClient: BtcdClient;

  constructor(config: Config) {
    this.logger = new Logger(config.logfile, config.loglevel);
    this.btcdClient = new BtcdClient(config.rpc);
  }

  public start = async () => {
    try {
      await this.btcdClient.connect();
      this.logger.info('connected to BTCD');

      const info = await this.btcdClient.getInfo();
      this.logger.debug(`BTCD status: ${info.blocks} blocks on ${info.testnet ? 'testnet' : 'mainnet'}`);
    } catch (error) {
      this.logger.error(`could not connect to BTCD: ${JSON.stringify(error)}`);
    }
  }
}

export default Walli;
