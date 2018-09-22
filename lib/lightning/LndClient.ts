import fs from 'fs';
import grpc, { ClientReadableStream } from 'grpc';
import Logger from '../Logger';
import { BaseClientClass, ClientStatus } from '../BaseClient';
import { errors } from '../consts/errors';
import LightningClient from './LightningClient';
import * as lndrpc from '../proto/lndrpc_pb';
import { LightningClient as GrpcClient } from '../proto/lndrpc_grpc_pb';

// TODO: error handling

/** The configurable options for the lnd client. */
type LndConfig = {
  host: string;
  port: number;
  certPath: string;
  macaroonPath: string;
};

/** General information about the state of this lnd client. */
type Info = {
  error?: string;
  channels?: ChannelCount;
  chains?: string[];
  blockheight?: number;
  uris?: string[];
  version?: string;
};

type ChannelCount = {
  active: number,
  inactive?: number,
  pending: number,
};

interface GrpcResponse {
  toObject: Function;
}

interface LightningMethodIndex extends GrpcClient {
  [methodName: string]: Function;
}

interface LndClient {
  on(event: 'invoice.settled', listener: (rHash: string) => void): this;
  emit(event: 'invoice.settled', rHash: string);
}

/** A class representing a client to interact with lnd. */
class LndClient extends BaseClientClass implements LightningClient {
  public static readonly serviceName = 'LND';

  private readonly disabledError = errors.IS_DISABLED(LndClient.serviceName);
  private readonly disconnectedError = errors.IS_DISCONNECTED(LndClient.serviceName);

  private lightning!: GrpcClient | LightningMethodIndex;
  private meta!: grpc.Metadata;
  private invoiceSubscription?: ClientReadableStream<lndrpc.InvoiceSubscription>;

  /**
   * Create an lnd client.
   * @param config the lnd configuration
   */
  constructor(logger: Logger, config: LndConfig) {
    super(logger, LndClient.serviceName);

    const { host, port, certPath, macaroonPath } = config;

    if (fs.existsSync(macaroonPath) && fs.existsSync(certPath)) {
      const uri = `${host}:${port}`;

      const lndCert = fs.readFileSync(certPath);
      const credentials = grpc.credentials.createSsl(lndCert);

      const adminMacaroon = fs.readFileSync(macaroonPath);
      this.meta = new grpc.Metadata();
      this.meta.add('macaroon', adminMacaroon.toString('hex'));

      this.lightning = new GrpcClient(uri, credentials);
    } else {
      this.logger.error('could not find required files for LND');

      this.setStatus(ClientStatus.Disabled);
      throw(this.disabledError);
    }
  }

  public connect = async () => {
    this.setStatus(ClientStatus.Connected);
    this.subscribeInvoices();
  }

  /** End all subscriptions and reconnection attempts. */
  public close = () => {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.cancel();
    }
  }

  private unaryCall = <T, U>(methodName: string, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      this.verifyConnected();

      (this.lightning as LightningMethodIndex)[methodName](params, this.meta, (err: grpc.ServiceError, response: GrpcResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }

  /**
   * Return general information concerning the lightning node including it’s identity pubkey, alias, the chains it
   * is connected to, and information concerning the number of open+pending channels.
   */
  public getInfo = (): Promise<lndrpc.GetInfoResponse.AsObject> => {
    return this.unaryCall<lndrpc.GetInfoRequest, lndrpc.GetInfoResponse.AsObject>('getInfo', new lndrpc.GetInfoRequest());
  }

  /**
   * Attempt to add a new invoice to the lnd invoice database.
   * @param value the value of this invoice in satoshis
   */
  public addInvoice = (value: number): Promise<lndrpc.AddInvoiceResponse.AsObject> => {
    const request = new lndrpc.Invoice();
    request.setValue(value);
    return this.unaryCall<lndrpc.Invoice, lndrpc.AddInvoiceResponse.AsObject>('addInvoice', request);
  }

  /**
   * Pay an invoice through the Lightning Network.
   * @param payment_request an invoice for a payment within the Lightning Network
   */
  public payInvoice = (paymentRequest: string): Promise<lndrpc.SendResponse.AsObject> => {
    const request = new lndrpc.SendRequest();
    request.setPaymentRequest(paymentRequest);
    return this.unaryCall<lndrpc.SendRequest, lndrpc.SendResponse.AsObject>('sendPaymentSync', request);
  }

  /**
   * Subscribe to events for when invoices are settled.
   */
  private subscribeInvoices = (): void => {
    this.verifyConnected();

    this.invoiceSubscription = this.lightning.subscribeInvoices(new lndrpc.InvoiceSubscription(), this.meta)
      .on('data', (invoice: lndrpc.Invoice) => {
        this.logger.info(`invoice update: ${invoice}`);
        this.emit('invoice.settled', String(invoice.getRHash()));
      });
  }

  private verifyConnected = () => {
    switch (this.clientStatus) {
      case ClientStatus.Disabled: throw(this.disabledError);
      case ClientStatus.Disconnected: throw(this.disconnectedError);
    }
  }
}

export default LndClient;
export { LndConfig };
