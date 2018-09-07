import WebSocket from 'ws';
import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';

// TODO: add TLS config options for BTCD
type RpcConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
};

/** A hack to make promise handleable from the other functions */
type PromiseFunctions = {
  resolve: Function;
  reject: Function;
};

interface RpcClient {
  on(event: 'error', listener: (error: string) => void): this;
  emit(event: 'error', error: string): boolean;
}

class RpcClient extends EventEmitter {

  private ws!: WebSocket;

  /** A map between request ids and their pending Promises */
  private pendingRequests = new Map<string, PromiseFunctions>();

  constructor(private config: RpcConfig) {
    super();
  }

  public connect = async () => {
    return new Promise((resolve) => {
      const credentials = new Buffer(`${this.config.user}:${this.config.password}`);
      this.ws = new WebSocket(`ws://${this.config.host}:${this.config.port}/ws`, {
        headers: {
          Authorization: `Basic ${credentials.toString('base64')}`,
        },
      });

      this.bindWebSocket();

      this.ws.onopen = () => resolve();
    });
  }

  public close = async () => {
    this.ws.close();
  }

  public call = async (method: string, ...params: any[]): Promise<any> => {
    const id = uuidv1();
    const promise = new Promise<any>((resolve, reject) => {
      const message = {
        id,
        params,
        method,
      };

      this.ws.send(JSON.stringify(message), (error) => {
        if (error) {
          this.pendingRequests.delete(message.id);
          reject(error.message);
        } else {
          this.pendingRequests.set(id, {
            resolve,
            reject,
          });
        }
      });
    });

    return promise;
  }

  private bindWebSocket = () => {
    this.ws.onerror = error => this.emitError(error);
    this.ws.on('error', (error) => {
      this.emitError(error);
    });

    this.ws.on('message', (rawData) => {
      const data = JSON.parse(rawData.toString());
      const promise = this.pendingRequests.get(data.id);

      // Handle the Promise and remove it from pendingRequests
      if (promise) {
        this.pendingRequests.delete(data.id);

        if (data.result && !data.error) {
          promise.resolve(data.result);
        } else {
          promise.reject(data.error);
        }
      }

    });
  }

  private emitError = (error: { message: string }) => {
    this.emit('error', error.message);
  }

}

export default RpcClient;
export { RpcConfig };
