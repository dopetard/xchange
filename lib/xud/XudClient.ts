import fs from 'fs';
import XudInterface from './XudInterface';
import grpc, { ClientReadableStream } from 'grpc';
import { EventEmitter } from 'events';
import Logger from '../Logger';
import Errors from '../consts/Errors';
import * as xudrpc from '../proto/xudrpc_pb';
import { XudClient as GrpcClient } from '../proto/xudrpc_grpc_pb';

type XudConfig = {
  host: string;
  port: number;
  certpath: string;
};

interface GrpcResponse {
  toObject: Function;
}

interface XudMethodIndex extends GrpcClient {
  [methodName: string]: Function;
}

class XudClient extends EventEmitter implements XudInterface {
  public static readonly serviceName = 'XUD';
  private readonly disconnectedError = Errors.IS_DISCONNECTED(XudClient.serviceName);

  private xud!: GrpcClient;
  private meta!: grpc.Metadata;

  constructor(private logger: Logger, private config: XudConfig) {
    super();
  }

  public connect = async () => {
    const { host, port, certpath } = this.config;
    if (fs.existsSync(certpath)) {
      const uri = `${host}:${port}`;
      const xudCert = fs.readFileSync(certpath);
      const credentials = grpc.credentials.createSsl(xudCert);

      this.meta = new grpc.Metadata();
      this.xud = new GrpcClient(uri, credentials);
    } else {
      this.logger.error('could not find required files for XUD');
      throw(this.disconnectedError);
    }
  }

  private unaryCall = <T, U>(methodName: string, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      (this.xud as XudMethodIndex)[methodName](params, this.meta, (err: grpc.ServiceError, response: GrpcResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }

  public getInfo = (): Promise<xudrpc.GetInfoResponse.AsObject> => {
    const request = new xudrpc.GetInfoRequest();
    return this.unaryCall<xudrpc.GetInfoRequest, xudrpc.GetInfoResponse.AsObject>('getInfo', request)
  }

  public getXudInfo = async (): Promise<any> => {
    try {
      const info = await this.getInfo();
      return info;
    } catch (error) {
      this.logger.error(`XUD error: ${error}`);
      return error;
    }
  }

}
export { XudConfig };
export default XudClient;
