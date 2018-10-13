import fs from 'fs';
import { Arguments } from 'yargs';
import { generateMnemonic } from 'bip39';
import Logger from './Logger';
import Config, { ConfigType } from './Config';
import { ChainType } from './consts/ChainType';
import LndClient from './lightning/LndClient';
import GrpcServer from './grpc/GrpcServer';
import Service from './service/Service';
import WalletManager from './wallet/WalletManager';
import SwapManager from './swap/SwapManager';
import ChainClient from './chain/ChainClient';
import XudClient from './xud/XudClient';

class Walli {
  private config: ConfigType;
  private logger: Logger;

  private walletManager: WalletManager;
  private swapManager: SwapManager;

  private btcdClient: ChainClient;
  private ltcdClient: ChainClient;
  private lndClient: LndClient;
  private xudClient: XudClient;

  private service: Service;
  private grpcServer: GrpcServer;

  constructor(config: Arguments) {
    this.config = new Config().load(config);
    this.logger = new Logger(this.config.logpath, this.config.loglevel);

    this.btcdClient = new ChainClient(this.config.btcd, ChainType.BTC);
    this.ltcdClient = new ChainClient(this.config.ltcd, ChainType.LTC);
    this.lndClient = new LndClient(this.logger, this.config.lnd);
    this.xudClient = new XudClient(this.logger, this.config.xud);

    if (fs.existsSync(this.config.walletpath)) {
      this.walletManager = new WalletManager([ChainType.BTC], this.config.walletpath);
    } else {
      const mnemonic = generateMnemonic();
      this.logger.warn(`generated new mnemonic: ${mnemonic}`);

      this.walletManager = WalletManager.fromMnemonic(mnemonic, ['BTC'], this.config.walletpath);
    }

    this.swapManager = new SwapManager(this.logger, this.walletManager, this.btcdClient, this.lndClient);

    this.service = new Service({
      logger: this.logger,
      walletManager: this.walletManager,
      swapManager: this.swapManager,
      btcdClient: this.btcdClient,
      lndClient: this.lndClient,
      xudClient: this.xudClient,
    });

    this.grpcServer = new GrpcServer(this.logger, this.service, this.config.grpc);
  }

  public start = async () => {
    await Promise.all([
      this.connectChainClient(this.btcdClient),
      this.connectChainClient(this.ltcdClient),
      this.connectLnd(),
      this.connectXud(),
    ]);

    await this.startGrpcServer();
  }

  private connectChainClient = async (client: ChainClient) => {
    try {
      await client.connect();

      const info = await client.getInfo();
      this.logger.verbose(`${client.serviceName} status: ${info.blocks} blocks`);
    } catch (error) {
      this.logCouldNotConnect(client.serviceName, error);
    }
  }

  private startGrpcServer = async () => {
    try {
      await this.grpcServer.listen();
    } catch (error) {
      this.logger.error(`Could not start gRPC server error: ${error}`);
    }
  }

  private connectXud = async () => {
    try {
      await this.xudClient.connect();

      const info = await this.xudClient.getXudInfo();
      this.logger.verbose(`XUD status: ${JSON.stringify(info)}`);
    } catch (error) {
      this.logCouldNotConnect(XudClient.serviceName, error);
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
    this.logger.error(`Could not connect to ${service}: ${JSON.stringify(error)}`);
  }
}

export default Walli;
