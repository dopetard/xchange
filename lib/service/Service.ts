import Logger from '../Logger';
import { Info as ChainInfo } from '../chain/ChainClientInterface';
import { Info as LndInfo } from '../lightning/LndClient';
import XudClient, { XudInfo } from '../xud/XudClient';
import SwapManager from '../swap/SwapManager';
import { Currency } from '../wallet/Wallet';
import WalletManager from '../wallet/WalletManager';
import { OutputType } from '../consts/Enums';
import Errors from './Errors';
import { OrderSide } from '../proto/xchangerpc_pb';
import { getHexBuffer } from '../Utils';

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

// TODO: "invalid argument" errors
class Service {

  constructor(private serviceComponents: ServiceComponents) {}

  /**
   * Gets general information about this Xchange instance and the nodes it is connected to
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
   * Gets the balance for either all wallets or just a single one if specified
   */
  public getBalance = (args: { currency: string }): Map<string, number> => {
    const { walletManager } = this.serviceComponents;

    const result = new Map<string, number>();

    if (args.currency !== '') {
      const wallet = walletManager.wallets.get(args.currency);

      if (!wallet) {
        throw Errors.CURRENCY_NOT_FOUND(args.currency);
      }

      result.set(args.currency, wallet.getBalance());
    } else {
      walletManager.wallets.forEach((wallet, currency) => {
        result.set(currency, wallet.getBalance());
      });
    }

    return result;
  }

  /**
   * Gets a new address of a specified wallet. The "type" parameter is optional and defaults to "OutputType.LEGACY"
   */
  public newAddress = async (args: { currency: string, type: number }): Promise<string> => {
    const { walletManager } = this.serviceComponents;

    const wallet = walletManager.wallets.get(args.currency);

    if (!wallet) {
      throw Errors.CURRENCY_NOT_FOUND(args.currency);
    }

    return wallet.getNewAddress(this.getOutputType(args.type));
  }

  /**
   * Creates a new Swap from the chain to Lightning
   */
  public createSwap = async (args: { pairId: string, side: number, invoice: string, refundPublicKey: string, outputType: number }):
    Promise<string> => {

    const { swapManager } = this.serviceComponents;

    const orderSide = this.getOrderSide(args.side);
    const outputType = this.getOutputType(args.outputType);

    const refundPublicKey = getHexBuffer(args.refundPublicKey);

    return await swapManager.createSwap(args.pairId, orderSide, args.invoice, refundPublicKey, outputType);
  }

  private getOrderSide = (side: number) => {
    switch (side) {
      case 0: return OrderSide.BUY;
      case 1: return OrderSide.SELL;

      default: throw Errors.ORDER_SIDE_NOT_FOUND(side);
    }
  }

  private getOutputType = (type: number) => {
    switch (type) {
      case 0: return OutputType.Bech32;
      case 1: return OutputType.Compatibility;
      default: return OutputType.Legacy;
    }
  }
}

export default Service;
