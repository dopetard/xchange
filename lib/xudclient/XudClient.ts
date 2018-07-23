import grpc from 'grpc';
import * as xudapi from '../proto/xudrpc_grpc_pb';
import * as xudrpc from '../proto/xudrpc_pb';
import { EventEmitter } from 'events';
import Logger from '../Logger';

type XudClientConfig = {
  host: string,
  port: number,
};

type GrpcResponse = {
  toObject: Function;
};

class XudClient extends EventEmitter {

  private xudClient: xudapi.XudClient;

  constructor(config: XudClientConfig, private logger: Logger) {
    super();
    const credentials = grpc.credentials.createInsecure();
    this.xudClient = new xudapi.XudClient(`${config.host}:${config.port}`, credentials);
  }

  public addInvoice = (value: number): Promise<xudrpc.AddInvoiceResponse.AsObject> => {
    const request = new xudrpc.AddInvoiceRequest();
    request.setValue(value);
    return this.unaryCall<xudrpc.AddInvoiceRequest, xudrpc.AddInvoiceResponse.AsObject>('addInvoice', request);
  }

  public decodeInvoice = (invoice: string): Promise<xudrpc.DecodeInvoiceResponse.AsObject> => {
    const request = new xudrpc.InvoiceRequest();
    request.setInvoice(invoice);
    return this.unaryCall<xudrpc.InvoiceRequest, xudrpc.DecodeInvoiceResponse.AsObject>('decodeInvoice', request);
  }

  public payInvoice = (invoice: string): Promise<xudrpc.PayInvoiceResponse.AsObject> => {
    const request = new xudrpc.InvoiceRequest();
    request.setInvoice(invoice);
    return this.unaryCall<xudrpc.InvoiceRequest, xudrpc.PayInvoiceResponse.AsObject>('payInvoice', request);
  }

  public getRaidenAddress = (): Promise<xudrpc.RaidenAddressResponse.AsObject> => {
    const request = new xudrpc.RaidenAddressRequest();
    return this.unaryCall<xudrpc.RaidenAddressRequest, xudrpc.RaidenAddressResponse.AsObject>('raidenAddress', request);
  }

  public sendToken = (tokenAddress: string, targetAddress: string, amount: number, identifier: number): Promise<xudrpc.SendTokenReponse.AsObject> => {
    const request = new xudrpc.SendTokenRequest();
    request.setTokenAddress(tokenAddress);
    request.setTargetAddress(targetAddress);

    const payload = new xudrpc.TransferPayload();
    payload.setAmount(amount);
    payload.setIdentifier(identifier);
    request.setPayload(payload);

    return this.unaryCall<xudrpc.SendTokenRequest, xudrpc.SendTokenReponse.AsObject>('sendToken', request);
  }

  public subscribeInvoices = () => {
    this.xudClient.subscribeInvoices(new xudrpc.SubscribeInvoicesRequest())
      .on('data', (message: GrpcResponse) => {
        this.emit('invoice.settled', message.toObject());
      })
      .on('error', (message) => {
        this.lostXudConnection(message);
      });
  }

  public subscribeChannelEvents = () => {
    this.xudClient.subscribeChannelEvents(new xudrpc.SubscribeChannelEventsRequest())
      .on('data', (message: GrpcResponse) => {
        this.emit('channel.event', message.toObject());
      })
      .on('error', (message) => {
        this.lostXudConnection(message);
      });
  }

  private lostXudConnection = (message: string) => {
    this.logger.error(`Could not connect to XUD: ${message}`);
    process.exit(1);
  }

  private unaryCall = <T, U>(methodName: string, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      this.xudClient[methodName](params, (err: grpc.ServiceError, response: GrpcResponse) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }
}

export default XudClient;
export { XudClientConfig };
