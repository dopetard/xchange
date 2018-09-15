import { EventEmitter } from 'events';
import Logger from './Logger';

enum ClientStatus {
  DISABLED,
  DISCONNECTED,
  CONNECTED,
}

interface BaseClient {
  connect(): Promise<void>;
}

/**
 * A base class to represent a client for a external serivce such as LND or BTCD
 */
abstract class BaseClientClass extends EventEmitter {
  protected status = ClientStatus.DISABLED;

  constructor(protected logger: Logger, private serviceName: string) {
    super();
  }

  get clientStatus(): ClientStatus {
    return this.status;
  }

  protected setStatus(status: ClientStatus) {
    this.status = status;
    this.logger.info(`${this.serviceName} status ${ClientStatus[status]}`);
  }
}

export default BaseClient;
export { ClientStatus, BaseClientClass };
