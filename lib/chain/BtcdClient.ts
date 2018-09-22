import Logger from '../Logger';
import RpcClient, { RpcConfig } from '../RpcClient';
import { BaseClientClass, ClientStatus } from '../BaseClient';
import ChainClient from './ChainClient';
import { errors } from '../consts/errors';

type BtcdConfig = RpcConfig;

type Info = {
  version: number;
  protocolversion: number;
  blocks: number;
  timeoffset: number;
  connections: number;
  proxy: string;
  difficulty: number;
  testnet: boolean;
  relayfee: number;
};

interface BtcdClient {
  on(event: 'error', listener: (error: string) => void): this;
  emit(event: 'error', error: string): boolean;
}

class BtcdClient extends BaseClientClass implements ChainClient, BtcdClient {
  public static readonly serviceName = 'BTCD';

  private readonly disabledError = errors.IS_DISABLED(BtcdClient.serviceName);
  private readonly disconnectedError = errors.IS_DISCONNECTED(BtcdClient.serviceName);

  private rpcClient: RpcClient;

  constructor(logger: Logger, config: RpcConfig) {
    super(logger, BtcdClient.serviceName);

    this.rpcClient = new RpcClient(config);
    this.rpcClient.on('error', error => this.emit('error', error));
  }

  public connect = async () => {
    try {
      await this.rpcClient.connect();
      this.setStatus(ClientStatus.Connected);
    } catch (error) {
      this.setStatus(ClientStatus.Disconnected);
      throw error;
    }
  }

  public getInfo = (): Promise<Info> => {
    this.verifyConnected();

    return this.rpcClient.call<Info>('getinfo');
  }

  public sendRawTransaction = (rawTransaction: string, allowHighFees = true): Promise<string> => {
    this.verifyConnected();

    return this.rpcClient.call<string>('sendrawtransaction', rawTransaction, allowHighFees);
  }

  private verifyConnected = () => {
    switch (this.clientStatus) {
      case ClientStatus.Disabled: throw(this.disabledError);
      case ClientStatus.Disconnected: throw(this.disconnectedError);
    }
  }
}

export default BtcdClient;
export { BtcdConfig, Info as BtcdInfo };
