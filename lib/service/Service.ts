import Logger from '../Logger';
import { Info as ChainInfo } from '../chain/ChainClientInterface';
import { Info as LndInfo } from '../lightning/LndClient';
import XudClient, { XudInfo } from '../xud/XudClient';
import SwapManager from '../swap/SwapManager';
import { Currency } from '../wallet/Wallet';
import WalletManager from '../wallet/WalletManager';
import { OutputType } from '../consts/OutputType';
import Errors from './Errors';

const packageJson = require('../../package.json');

type ServiceComponents = {
  logger: Logger;
  xudClient: XudClient;
  currencies: Map<string, Currency>;
  walletManager: WalletManager;
  swapManager: SwapManager;
};

type CurrencyInfo = {
  symbol: string;
  chainInfo: ChainInfo;
  lndInfo: LndInfo;
};

type XchangeInfo = {
  version: string;
  xudInfo: XudInfo;
  currencies: CurrencyInfo[];
};

class Service {

  constructor(private serviceComponents: ServiceComponents) {}

  /**
   * Get general information about the Xchange instance and the nodes it is connected to
   */
  public getInfo = async (): Promise<XchangeInfo> => {
    const { xudClient, currencies } = this.serviceComponents;
    const version = packageJson.version;

    const currencyInfos: CurrencyInfo[] = [];

    const getCurrencyInfo = async (currency: Currency) => {
      const chainInfo = await currency.chainClient.getInfo();
      const lndInfo = await currency.lndClient.getLndInfo();

      currencyInfos.push({
        chainInfo,
        lndInfo,
        symbol: currency.symbol,
      });
    };

    const currenciesPromises: Promise<void>[] = [];

    currencies.forEach((currency) => {
      currenciesPromises.push(getCurrencyInfo(currency));
    });

    await Promise.all(currenciesPromises);

    const xudInfo = await xudClient.getXudInfo();

    return {
      version,
      xudInfo,
      currencies: currencyInfos,
    };
  }

  /**
   * Get a new address for the specified coin
   */
  public newAddress = async (args: { currency: string, type: number }): Promise<string> => {
    const { walletManager } = this.serviceComponents;

    const wallet = walletManager.wallets.get(args.currency);

    if (!wallet) {
      throw Errors.CURRENCY_NOT_FOUND(args.currency);
    }

    const getOutputType = (type: number) => {
      switch (type) {
        case 0: return OutputType.Bech32;
        case 1: return OutputType.Compatibility;
        default: return OutputType.Legacy;
      }
    };

    return wallet.getNewAddress(getOutputType(args.type));
  }
}

export default Service;
