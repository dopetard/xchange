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
