import BtcdClient from '../chain/BtcdClient';

class Service{
  constructor(private btcdClient: BtcdClient) {}

  public getInfo = async (): Promise<object> => {
    const info = await this.btcdClient.getInfo();
    return info;
  }
}

export default Service;
