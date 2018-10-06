import fs from 'fs';
import { Arguments } from 'yargs';
import { generateMnemonic } from 'bip39';
import Logger from './Logger';
import Config, { ConfigType } from './Config';
import BtcdClient from './chain/BtcdClient';
import LndClient from './lightning/LndClient';
import GrpcServer from './grpc/GrpcServer';
import Service from './service/Service';
import WalletManager from './wallet/WalletManager';
import SwapManager from './swap/SwapManager';

class Walli {
  private config: ConfigType;
  private logger: Logger;

  private walletManager: WalletManager;
  private swapManager: SwapManager;

  private btcdClient: BtcdClient;
  private lndClient: LndClient;

  private service: Service;
  private grpcServer: GrpcServer;

  constructor(config: Arguments) {
    this.config = new Config().load(config);
    this.logger = new Logger(this.config.logPath, this.config.logLevel);

    this.btcdClient = new BtcdClient(this.config.btcd);
    this.lndClient = new LndClient(this.logger, this.config.lnd);

    if (fs.existsSync(this.config.walletPath)) {
      this.walletManager = new WalletManager(['BTC'], this.config.walletPath);
    } else {
      const mnemonic = generateMnemonic();
      this.logger.warn(`generated new mnemonic: ${mnemonic}`);

      this.walletManager = WalletManager.fromMnemonic(mnemonic, ['BTC'], this.config.walletPath);
    }

    this.swapManager = new SwapManager(this.logger, this.walletManager, this.btcdClient, this.lndClient);

    this.service = new Service({
      logger: this.logger,
      walletManager: this.walletManager,
      swapManager: this.swapManager,
      btcdClient: this.btcdClient,
      lndClient: this.lndClient,
    });

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
      this.logger.verbose(`BTCD status: ${info.blocks} blocks`);
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

      const info = await this.lndClient.getInfo();
      this.logger.verbose(`LND status: ${JSON.stringify(info, undefined, 2)}`);
    } catch (error) {
      this.logCouldNotConnect(LndClient.serviceName, error);
    }
  }

  private logCouldNotConnect = (service: string, error: any) => {
    this.logger.error(`could not connect to ${service}: ${JSON.stringify(error)}`);
  }
}

export default Walli;
