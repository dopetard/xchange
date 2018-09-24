import Logger from '../Logger';
import BtcdClient, { BtcdInfo } from '../chain/BtcdClient';
import LndClient, { LndInfo } from '../lightning/LndClient';

type walliInfo = {
  version: string,
  btcdInfo: BtcdInfo,
  lndInfo: LndInfo,
};

class Service{

  constructor(private logger: Logger, private btcdClient: BtcdClient, private lndClient: LndClient) {}

  public getInfo = async (): Promise<walliInfo> => {
    const version = require('../../package.json').version;
    const btcdInfo = await this.btcdClient.getInfo();
    const lndInfo = await this.lndClient.getLndInfo();

    return {
      version,
      btcdInfo,
      lndInfo,
    };
  }
}

export default Service;
