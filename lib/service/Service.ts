import Logger from '../Logger';
import WalletManager from '../wallet/WalletManager';
import BtcdClient, { Info as BtcdInfo } from '../chain/BtcdClient';
import LndClient, { Info as LndInfo } from '../lightning/LndClient';
import SwapManager from '../swap/SwapManager';
import Networks from '../consts/Networks';

const packageJson = require('../../package.json');

type ServiceComponents = {
  logger: Logger,
  walletManager: WalletManager,
  swapManager: SwapManager,
  btcdClient: BtcdClient,
  lndClient: LndClient,
};

type WalliInfo = {
  version: string,
  btcdInfo: BtcdInfo,
  lndInfo: LndInfo,
};

// TODO: refunds for Submarine Swaps
class Service {

  constructor(private serviceComponents: ServiceComponents) {}

  /**
   * Get general information about walli-server and the nodes it is connected to
   */
  public getInfo = async (): Promise<WalliInfo> => {
    const { btcdClient, lndClient } = this.serviceComponents;
    const version = packageJson.version;

    const btcdInfo = await btcdClient.getInfo();
    const lndInfo = await lndClient.getLndInfo();

    return {
      version,
      btcdInfo,
      lndInfo,
    };
  }

  /**
   * Create a Submarine Swap
   */
  public createSubmarine = async (args: { invoice: string }) => {
    return this.serviceComponents.swapManager.createSwap(
      Networks.bitcoin_testnet,
      args.invoice,
      '02fcba7ecf41bc7e1be4ee122d9d22e3333671eb0a3a87b5cdf099d59874e1940f',
    );
  }
}

export default Service;
