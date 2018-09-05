import WebSocket from 'ws';
import { EventEmitter } from 'events';

interface RPC {
  host: string;
  port: number;
  username: string;
  password: string;
}

class RPCClient extends EventEmitter{
  private url: string;
  private ws!: WebSocket;
  private counter: number;

  constructor(private rpc: RPC) {
    super();
    this.counter = 0;
    this.url = `ws://${this.rpc.host}:${this.rpc.port}/ws`;
    // (() => this.connect())();
  }

  public connect(): void {
    try {
      this.ws = new WebSocket(this.url, {
        headers: {
          Authorization: 'Basic ' + new Buffer(this.rpc.username + ':' + this.rpc.password).toString('base64'),
        },
      });
      this.ws.ping();
    } catch (error) {
      console.log();
    }

    this.ws.on('open', (info) => {
      this.emit('ws:open', info);
    });

    this.ws.on('close', () => {
      (code, msg) => this.emit('ws:close', code, msg);
    });

    this.ws.on('error', (err) => {
      this.emit('ws:error', err);
    });

    this.ws.on('message', (data) => {
      this.handle_message(data.toString());
    });
  }
  private call(command: string, params: string[], callback: Function): void {
    const id = this.counter + 1;
    const msg = JSON.stringify({ params, id, jsonrpc: '1.0', method: command });
    this.ws.send(msg, (err) => {
      if (err) {
        return callback(err);
      } else {
        return this.once(`res:${id}`, data => callback(data));
      }
    });
  }
  private handle_message(data: string): void {
    const { error, id, method, params } = JSON.parse(data);
    if (id) {
      if (error) {
        this.emit(`res:${id}`, error);
      } else {
        this.emit(`res:${id}`, JSON.parse(data));
      }
    } else if (error) {
      this.emit(`error`, error);
    } else if (method) {
      this.emit(method, ...params);
    } else {
      this.emit('error', new Error(`Invalid message: ${data}`));
    }
  }
  private rpcCallback(command: string, params: any[] = [], callback: Function): void {
    this.call(command, params, callback);
  }
  public rpcMethod(method: string, ...params: any[]) {
    return new Promise((resolve, reject) => {
      this.rpcCallback(method, params, (data) => {
        data.result ? resolve(data) : reject(data);
      });
    });
  }
  public close = async () => {
    this.ws.close();
  }
}

export default RPCClient;
