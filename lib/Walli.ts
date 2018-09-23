import fs from 'fs';
import { generateMnemonic } from 'bip39';
import Logger from './Logger';
import Config, { ConfigType } from './Config';
import BtcdClient from './chain/BtcdClient';
import LndClient from './lightning/LndClient';
import GrpcServer from './grpc/GrpcServer';
import Service from './service/Service';
import { Arguments } from 'yargs';
import WalletManager from './wallet/WalletManager';

class Walli {
  private config: ConfigType;
  private logger: Logger;

  private walletManager: WalletManager;

  private btcdClient: BtcdClient;
  private lndClient: LndClient;

  private service: Service;
  private grpcServer: GrpcServer;

  constructor(config: Arguments) {
    this.config = new Config().load(config);
    this.logger = new Logger(this.config.logPath, this.config.logLevel);

    if (!fs.existsSync(this.config.walletPath)) {
      const mnemonic = generateMnemonic();
      this.logger.warn(`generated new mnemonic: ${mnemonic}`);

      this.walletManager = WalletManager.fromMnemonic(mnemonic, ['BTC'], this.config.walletPath);
    } else {
      this.walletManager = new WalletManager(['BTC'], this.config.walletPath);
    }

    this.btcdClient = new BtcdClient(this.logger, this.config.btcd);
    this.lndClient = new LndClient(this.logger, this.config.lnd);

    this.service = new Service(this.btcdClient);
    this.grpcServer = new GrpcServer(this.logger, this.service, this.config.grpc);
  }

  public start = async () => {
    await Promise.all([
      this.connectBtcd(),
      this.connectLnd(),
    ]);

    await this.startGrpcServer();
  }

  private connectBtcd = async () => {
    try {
      await this.btcdClient.connect();

      const info = await this.btcdClient.getInfo();
      this.logger.debug(`BTCD status: ${info.blocks} blocks on ${info.testnet ? 'testnet' : 'mainnet'}`);
    } catch (error) {
      this.logCouldNotConnect(BtcdClient.serviceName, error);
    }
  }

  private startGrpcServer = async () => {
    try {
      await this.grpcServer.listen();
    } catch (error) {
      this.logger.error(error);
    }
  }

  private connectLnd = async () => {
    try {
      await this.lndClient.connect();

      this.lndClient.on('invoice.settled', (rHash) => {
        this.logger.info(`invoice settled: ${rHash}`);
      });

      this.logger.debug(`LND status: ${JSON.stringify(await this.lndClient.getInfo(), undefined, 2)}`);
    } catch (error) {
      this.logCouldNotConnect(LndClient.serviceName, error);
    }
  }

  private logCouldNotConnect = (service: string, error: any) => {
    this.logger.error(`could not connect to ${service}: ${JSON.stringify(error)}`);
  }
}

export default Walli;
