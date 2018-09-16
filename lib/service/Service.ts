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
    const {version,
          protocolversion,
          blocks,
          timeoffset,
          connections,
          proxy,
          difficulty,
          testnet,
          relayfee } = info;
    return {
      version,
      protocolversion,
      blocks,
      timeoffset,
      connections,
      proxy,
      testnet,
      relayfee,
      difficulty: difficulty.toString(),
    };
  }
}

export default Service;
