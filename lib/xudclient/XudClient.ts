import grpc from 'grpc';
import * as xudapi from '../proto/xudrpc_grpc_pb';
import * as xudrpc from '../proto/xudrpc_pb';
import { EventEmitter } from 'events';

type XudClientConfig = {
  host: string,
  port: number,
};

type GrpcResponse = {
  toObject: Function;
};

class XudClient extends EventEmitter {

  private xudClient: xudapi.XudClient;

  constructor(config: XudClientConfig) {
    super();
    const credentials = grpc.credentials.createInsecure();
    this.xudClient = new xudapi.XudClient(`${config.host}:${config.port}`, credentials);
  }

  public addInvoice = (value: number, memo: string = ''): Promise<xudrpc.AddInvoiceResponse.AsObject> => {
    const request = new xudrpc.AddInvoiceRequest();
    request.setValue(value);
    request.setMemo(memo);
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

  public subscribeInvoices = () => {
    this.xudClient.subscribeInvoices(new xudrpc.SubscribeInvoicesRequest())
      .on('data', (message: GrpcResponse) => {
        const data = message.toObject();
        console.log(data);
        this.emit('invoice.settled', data);
      });
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
