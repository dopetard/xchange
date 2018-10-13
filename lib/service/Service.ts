import Logger from '../Logger';
import WalletManager from '../wallet/WalletManager';
import ChainClient from '../chain/ChainClient';
import { Info as ChainInfo } from '../chain/ChainClientInterface';
import LndClient, { Info as LndInfo } from '../lightning/LndClient';
import SwapManager from '../swap/SwapManager';
import Networks from '../consts/Networks';
import XudClient, { XudInfo } from '../xud/XudClient';
import { getHexBuffer } from '../Utils';

const packageJson = require('../../package.json');

type ServiceComponents = {
  logger: Logger,
  walletManager: WalletManager,
  swapManager: SwapManager,
  btcdClient: ChainClient,
  ltcdClient: ChainClient,
  lndClient: LndClient,
  xudClient: XudClient,
};

type WalliInfo = {
  version: string,
  btcdInfo: ChainInfo,
  ltcdInfo: ChainInfo,
  lndInfo: LndInfo,
  xudInfo: XudInfo,
};

// TODO: refunds for Submarine Swaps
class Service {

  constructor(private serviceComponents: ServiceComponents) {}

  /**
   * Get general information about walli-server and the nodes it is connected to
   */
  public getInfo = async (): Promise<WalliInfo> => {
    const { btcdClient, lndClient, xudClient, ltcdClient } = this.serviceComponents;
    const version = packageJson.version;

    const btcdInfo = await btcdClient.getInfo();
    const ltcdInfo = await ltcdClient.getInfo();
    const lndInfo = await lndClient.getLndInfo();
    const xudInfo = await xudClient.getXudInfo();

    return {
      version,
      btcdInfo,
      ltcdInfo,
      lndInfo,
      xudInfo,
    };
  }

  /**
   * Create a Submarine Swap
   */
  public createSubmarine = async (args: { invoice: string }) => {
    return this.serviceComponents.swapManager.createSwap(
      args.invoice,
      getHexBuffer('02fcba7ecf41bc7e1be4ee122d9d22e3333671eb0a3a87b5cdf099d59874e1940f'),
    );
  }
}

export default Service;
