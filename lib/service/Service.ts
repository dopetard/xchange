import Logger from '../Logger';
import BtcdClient, { BtcdInfo } from '../chain/BtcdClient';
import LndClient, { LndInfo } from '../lightning/LndClient';

type walliInfo = {
  version: string,
  btcdInfo: BtcdInfo,
  lndInfo: LndInfo,
};

class Service{
  private logger: Logger;
  private btcdClient: BtcdClient;
  private lndClient: LndClient;

  constructor(logger: Logger, btcdClient: BtcdClient, lndClient: LndClient) {
    this.logger = logger;
    this.btcdClient = btcdClient;
    this.lndClient = lndClient;
  }

  public getInfo = async (): Promise<any> => {
    const version = '1.0.0'; // TODO: get acctual version
    const btcdInfo = await this.btcdClient.getInfo();
    const lndInfo = await this.lndClient.getInfo();
    return {
      version,
      btcdInfo,
      lndInfo,
    };
  }
}

export default Service;
