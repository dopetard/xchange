import WebSocket from 'ws';
import fs from 'fs';
import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';

type RpcConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  certPath: string;
};

/** A hack to make promises handleable from other functions */
type PromiseFunctions = {
  resolve: Function;
  reject: Function;
};

interface RpcClient {
  on(event: 'error', listener: (error: string) => void): this;
  emit(event: 'error', error: string): boolean;
}

class RpcClient extends EventEmitter {
  public ws!: WebSocket;

  /** A map between request ids and their pending Promises */
  private pendingRequests = new Map<string, PromiseFunctions>();

  constructor(private config: RpcConfig) {
    super();
  }

  public connect = async () => {
    return new Promise((resolve, reject) => {
      const rpcCert = fs.readFileSync(this.config.certPath,  { encoding: 'utf-8' });
      const credentials = Buffer.from(`${this.config.user}:${this.config.password}`);
      this.ws = new WebSocket(`wss://${this.config.host}:${this.config.port}/ws`, {
        headers: {
          Authorization: `Basic ${credentials.toString('base64')}`,
        },
        cert: [rpcCert],
        ca: [rpcCert],
      });

      this.ws.onopen = () => {
        this.bindWebSocket();
        resolve();
      };

      this.ws.onerror = error => reject(error.message);
      this.ws.on('error', error => reject(error.message));
    });
  }

  public close = async () => {
    this.ws.close();
  }

  public call = async <T>(method: string, ...params: any[]): Promise<T> => {
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
    this.ws.on('error', error => this.emitError(error));

    this.ws.on('message', (rawData) => {
      const data = JSON.parse(rawData.toString());
      const promise = this.pendingRequests.get(data.id);

      // Handle the Promise and remove it from pendingRequests
      if (promise) {
        this.pendingRequests.delete(data.id);

        if (!data.error) {
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
