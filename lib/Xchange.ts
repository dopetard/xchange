import fs from 'fs';
import { Arguments } from 'yargs';
import { generateMnemonic } from 'bip39';
import Logger from './Logger';
import Config, { ConfigType } from './Config';
import LndClient from './lightning/LndClient';
import GrpcServer from './grpc/GrpcServer';
import Service from './service/Service';
import WalletManager from './wallet/WalletManager';
import SwapManager from './swap/SwapManager';
import ChainClient from './chain/ChainClient';
import XudClient from './xud/XudClient';
import Networks from './consts/Networks';
import { Currency } from './wallet/Wallet';

// TODO: trading pairs with already existing currencies like XUD
class Xchange {
  private config: ConfigType;
  private logger: Logger;

  private xudClient: XudClient;

  private currencies = new Map<string, Currency>();

  private walletManager: WalletManager;
  private swapManager: SwapManager;

  private service: Service;
  private grpcServer: GrpcServer;

  constructor(config: Arguments) {
    this.config = new Config().load(config);
    this.logger = new Logger(this.config.logpath, this.config.loglevel);

    this.xudClient = new XudClient(this.logger, this.config.xud);

    this.parseCurrencies();

    const walletCurrencies = Array.from(this.currencies.values());

    if (fs.existsSync(this.config.walletpath)) {
      this.walletManager = new WalletManager(walletCurrencies, this.config.walletpath);
    } else {
      const mnemonic = generateMnemonic();
      this.logger.warn(`generated new mnemonic: ${mnemonic}`);

      this.walletManager = WalletManager.fromMnemonic(mnemonic, walletCurrencies, this.config.walletpath);
    }

    const bitcoin = this.currencies.get('BTC')!;
    const litecoin = this.currencies.get('LTC')!;

    this.swapManager = new SwapManager(
      this.logger,
      this.walletManager,
      [{
        quote: litecoin,
        base: bitcoin,
      }],
    );

    this.service = new Service({
      logger: this.logger,
      currencies: this.currencies,
      xudClient: this.xudClient,
      swapManager: this.swapManager,
      walletManager: this.walletManager,
    });

    this.grpcServer = new GrpcServer(this.logger, this.service, this.config.grpc);
  }

  public start = async () => {
    const promises = [
      this.connectXud(),
    ];

    this.currencies.forEach((currency) => {
      promises.push(this.connectChainClient(currency.chainClient));
      promises.push(this.connectLnd(currency.lndClient));
    });

    await Promise.all(promises);

    try {
      await this.grpcServer.listen();
    } catch (error) {
      this.logger.error(`Could not start gRPC server: ${error}`);
    }
  }

  private connectChainClient = async (client: ChainClient) => {
    try {
      await client.connect();

      const info = await client.getInfo();
      this.logger.verbose(`${client.symbol} chain status: ${info.blocks} blocks`);
    } catch (error) {
      this.logCouldNotConnect(`${client.symbol} chain client`, error);
    }
  }

  private connectLnd = async (client: LndClient) => {
    try {
      await client.connect();

      const info = await client.getInfo();
      this.logger.verbose(`${client.symbol} LND status: ${JSON.stringify(info, undefined, 2)}`);
    } catch (error) {
      this.logCouldNotConnect(`${client.symbol} LND`, error);
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

  // TODO: support for more currencies
  private parseCurrencies = () => {
    this.config.currencies.forEach((currency) => {
      try {
        const chainClient = new ChainClient(this.logger, currency.chain, currency.symbol);
        const lndClient = new LndClient(this.logger, currency.lnd!, currency.symbol);

        this.currencies.set(currency.symbol, {
          chainClient,
          lndClient,
          symbol: currency.symbol,
          network: Networks[currency.network],
        });
      } catch (error) {
        this.logger.warn(`Could not initialize currency ${currency.symbol}: ${error.message}`);
      }
    });
  }

  private logCouldNotConnect = (service: string, error: any) => {
    this.logger.error(`Could not connect to ${service}: ${JSON.stringify(error)}`);
  }
}

export default Xchange;
