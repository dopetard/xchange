import { EventEmitter } from 'events';
import { ClientStatus } from './consts/ClientStatus';

export interface IBaseClient {
  connect(): Promise<void>;
}

class BaseClient extends EventEmitter {
  protected status = ClientStatus.Disconnected;
  protected RECONNECT_TIMER = 5000;
  protected reconnectionTimer?: NodeJS.Timer;
  constructor() {
    super();
  }

  public setClientStatus = (status: ClientStatus): void => {
    this.status = status;
  }

  public isConnected(): boolean {
    return this.status === ClientStatus.Connected;
  }
  public isDisconnected(): boolean {
    return this.status === ClientStatus.Disconnected;
  }
  public isOutOfSync(): boolean {
    return this.status === ClientStatus.OutOfSync;
  }
}

export default BaseClient;
