import Logger from '../Logger';
import BtcdClient from '../chain/BtcdClient';

class Service{
  private logger: Logger;
  private btcdClient: BtcdClient;

  constructor(logger: Logger, btcdClient: BtcdClient) {
    this.logger = logger;
    this.btcdClient = btcdClient;
  }

  public getInfo = async (): Promise<object> => {
    const info = await this.btcdClient.getInfo();
    return info;
  }
}

export default Service;
