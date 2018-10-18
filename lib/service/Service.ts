import Logger from '../Logger';
import WalletManager from '../wallet/WalletManager';
import ChainClient from '../chain/ChainClient';
import { Info as ChainInfo } from '../chain/ChainClientInterface';
import LndClient, { Info as LndInfo } from '../lightning/LndClient';
import XudClient, { XudInfo } from '../xud/XudClient';
import SwapManager from '../swap/SwapManager';
import { getHexBuffer } from '../Utils';

const packageJson = require('../../package.json');

type ServiceComponents = {
  logger: Logger;
  walletManager: WalletManager;
  swapManager: SwapManager;
  btcdClient: ChainClient;
  ltcdClient: ChainClient;
  lndbtcClient: LndClient;
  lndltcClient: LndClient;
  xudClient: XudClient;
};

type WalliInfo = {
  version: string;
  btcdInfo: ChainInfo;
  ltcdInfo: ChainInfo;
  lndbtcInfo: LndInfo;
  lndltcInfo: LndInfo;
  xudInfo: XudInfo;
};

// TODO: refunds for Submarine Swaps
// TODO: update gRPC interface and Service
class Service {

  constructor(private serviceComponents: ServiceComponents) {}

  // TODO: update with new way of handling chain and LND clients
  /**
   * Get general information about walli-server and the nodes it is connected to
   */
  public getInfo = async (): Promise<WalliInfo> => {
    const { btcdClient, ltcdClient, lndbtcClient, lndltcClient, xudClient } = this.serviceComponents;
    const version = packageJson.version;

    const btcdInfo = btcdClient.getInfo();
    const ltcdInfo = ltcdClient.getInfo();
    const lndbtcInfo = lndbtcClient.getLndInfo();
    const lndltcInfo = lndltcClient.getLndInfo();
    const xudInfo = xudClient.getXudInfo();

    await Promise.all([
      btcdInfo,
      ltcdInfo,
      lndbtcInfo,
      lndltcInfo,
      xudInfo,
    ]);

    // TODO: refactor this and make more readable
    return {
      version,
      btcdInfo: await btcdInfo,
      ltcdInfo: await ltcdInfo,
      lndbtcInfo: await lndbtcInfo,
      lndltcInfo: await lndltcInfo,
      xudInfo: await xudInfo,
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
