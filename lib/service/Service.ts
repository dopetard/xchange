import Logger from '../Logger';
import BtcdClient, { Info as BtcdInfo } from '../chain/BtcdClient';
import LndClient, { Info as LndInfo } from '../lightning/LndClient';

const packageJson = require('../../package.json');

type walliInfo = {
  version: string,
  btcdInfo: BtcdInfo,
  lndInfo: LndInfo,
};

class Service{

  constructor(private logger: Logger, private btcdClient: BtcdClient, private lndClient: LndClient) {}

  public getInfo = async (): Promise<walliInfo> => {
    const version = packageJson.version;
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
