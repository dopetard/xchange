import Logger from './Logger';
import Config from './Config';
import GrpcServer from './grpc/GrpcServer';
import BtcdClient from './rpc/BtcdClient';
import { RpcConfig } from './rpc/RpcClient';

type ConfigType = {
  logfile: string;
  loglevel: string;
  rpc: RpcConfig;
};

class Walli {

  private logger: Logger;
  private btcdClient: BtcdClient;
  private config: Config;
  private grpcServer: GrpcServer;

  constructor(config: ConfigType) {
    this.config = new Config().load(config);
    this.logger = new Logger(this.config.logfile, this.config.loglevel);
    this.btcdClient = new BtcdClient(this.config.rpc);
    this.grpcServer = new GrpcServer(this.logger);
  }

  public start = async () => {
    try {
      await this.btcdClient.connect();
      this.logger.info('connected to BTCD');

      const info = await this.btcdClient.getInfo();
      this.logger.debug(`BTCD status: ${info.blocks} blocks on ${info.testnet ? 'testnet' : 'mainnet'}`);
      await this.grpcServer.listen(9000, '127.0.0.1');
    } catch (error) {
      this.logger.error(`could not connect to BTCD: ${JSON.stringify(error)}`);
    }
  }
}

export default Walli;
