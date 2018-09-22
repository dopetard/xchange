import Logger from '../Logger';
import BtcdClient from '../chain/BtcdClient';
import LndClient from '../lightning/LndClient';

class Service{
  private logger: Logger;
  private btcdClient: BtcdClient;
  private lndClient: LndClient;

  constructor(logger: Logger, btcdClient: BtcdClient, lndClient: LndClient) {
    this.logger = logger;
    this.btcdClient = btcdClient;
    this.lndClient = lndClient;
  }

  public getInfo = async (): Promise<object> => {
    const btcdInfo = await this.btcdClient.getInfo();
    const lndInfo = await this.lndClient.getInfo();
    return btcdInfo;
  }
}

export default Service;
