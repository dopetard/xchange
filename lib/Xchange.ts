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
import Networks from './consts/Networks';
import { Currency } from './wallet/Wallet';

// TODO: trading pairs with already existing currencies like XUD
class Walli {
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

    const bitcoin = this.currencies.get('BTC')!;
    const litecoin = this.currencies.get('LTC')!;

    const coins = [
      {
        chain: ChainType[bitcoin.symbol],
        client: bitcoin.chainClient,
        network: bitcoin.network,
      },
      {
        chain: ChainType[litecoin.symbol],
        client: litecoin.chainClient,
        network: litecoin.network,
      },
    ];

    if (fs.existsSync(this.config.walletpath)) {
      this.walletManager = new WalletManager(coins, this.config.walletpath);
    } else {
      const mnemonic = generateMnemonic();
      this.logger.warn(`generated new mnemonic: ${mnemonic}`);

      this.walletManager = WalletManager.fromMnemonic(mnemonic, coins, this.config.walletpath);
    }

    this.parseCurrencies();

    this.swapManager = new SwapManager(
      this.logger,
      [{
        quote: litecoin,
        base: bitcoin,
      }],
    );

    this.service = new Service({
      logger: this.logger,
      swapManager: this.swapManager,
      xudClient: this.xudClient,
      currencies: Array.from(this.currencies.values()),
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
      this.logger.verbose(`${client.chainType} chain status: ${info.blocks} blocks`);
    } catch (error) {
      this.logCouldNotConnect(`${client.chainType} chain client`, error);
    }
  }

  private connectLnd = async (client: LndClient) => {
    try {
      await client.connect();

      const info = await client.getInfo();
      this.logger.verbose(`${client.chainType} LND status: ${JSON.stringify(info, undefined, 2)}`);
    } catch (error) {
      this.logCouldNotConnect(`${client.chainType} LND`, error);
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
      const type = currency.symbol === 'BTC' ? ChainType.BTC : ChainType.LTC;

      const chainClient = new ChainClient(currency.chainclient, type);
      const lndClient = new LndClient(this.logger, currency.lndclient!, type);

      this.currencies.set(currency.symbol, {
        chainClient,
        lndClient,
        symbol: currency.symbol,
        network: Networks[currency.network],
        wallet: this.walletManager.wallets.get(currency.symbol)!,
      });
    });
  }

  private logCouldNotConnect = (service: string, error: any) => {
    this.logger.error(`Could not connect to ${service}: ${JSON.stringify(error)}`);
  }
}

export default Walli;
