import Logger from '../Logger';
import BtcdClient, { Info as BtcdInfo } from '../chain/BtcdClient';
import LndClient, { Info as LndInfo } from '../lightning/LndClient';
import { callback } from '../cli/Command';

const packageJson = require('../../package.json');

type WalliInfo = {
  version: string,
  btcdInfo: BtcdInfo,
  lndInfo: LndInfo,
};

class Service{

  constructor(private logger: Logger, private btcdClient: BtcdClient, private lndClient: LndClient) {}

  public getInfo = async (): Promise<WalliInfo> => {
    const version = packageJson.version;
    const btcdInfo = await this.btcdClient.getInfo();
    const lndInfo = await this.lndClient.getLndInfo();

    return {
      version,
      btcdInfo,
      lndInfo,
    };
  }

  public subscribeToTx = async (args: {reload: boolean, addressesList: string[], outpointsList: string[]}, callback: Function) => {
    const { reload, addressesList, outpointsList } = args;
    try {
      await this.btcdClient.loadTxFilter(reload, addressesList, outpointsList);
      this.btcdClient.on('relevanttxaccepted', msg => callback(msg));
    } catch (error) {
      console.log(error);
    }
    /*
    await this.btcdClient.loadTxFilter(reload, addressesList, outpointsList).then(() => {
      this.btcdClient.on('txaccepted', msg => callback(msg));
    }).catch(err => console.log(`err: ${err.message}`)); */
  }
}

export default Service;
