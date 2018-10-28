import fs from 'fs';
import grpc from 'grpc';
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

type XudInfo = {
  version: string;
  nodepubkey: string;
  numpeers: number;
  lndbtc: boolean;
  lndltc: boolean;
  raiden: boolean;
};

interface GrpcResponse {
  toObject: Function;
}

interface XudMethodIndex extends GrpcClient {
  [methodName: string]: Function;
}

class XudClient extends EventEmitter {
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

  public disconnect = async () => {
    const request = new xudrpc.ShutdownRequest();
    this.xud.shutdown(request, (err, res) => {
      if (err) {
        this.logger.error(`XUD could not shutdown due to: ${err}`);
        throw err;
      } else {
        this.logger.warn(`XUD client has been shut down: ${res}`);
        return true;
      }
    });
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
    return this.unaryCall<xudrpc.GetInfoRequest, xudrpc.GetInfoResponse.AsObject>('getInfo', request);
  }

  public placeOrder(price: number, quantity: number, pair: string, buy: boolean, orderId?: string): Promise<xudrpc.PlaceOrderResponse.AsObject> {
    const request = new xudrpc.PlaceOrderRequest();
    request.setPrice(price);
    request.setQuantity(quantity);
    request.setPairId(pair);
    if (orderId) {
      request.setOrderId(orderId);
    }
    request.setSide(buy ? xudrpc.OrderSide.BUY : xudrpc.OrderSide.SELL);
    return this.unaryCall<xudrpc.PlaceOrderRequest, xudrpc.PlaceOrderResponse.AsObject>('placeOrder', request);
  }

  public getXudInfo = async (): Promise<XudInfo> => {
    const info = await this.getInfo();
    return {
      version: info.version,
      nodepubkey: info.nodePubKey,
      numpeers: info.numPeers,
      lndbtc: info.lndbtc ? true : false,
      lndltc: info.lndltc ? true : false,
      raiden: info.raiden ? true : false,
    };
  }

}
export { XudConfig, XudInfo };
export default XudClient;
