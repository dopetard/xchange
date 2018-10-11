import fs from 'fs';
import grpc, { ClientReadableStream } from 'grpc';
import { EventEmitter } from 'events';
import Logger from '../Logger';
import Errors from '../consts/Errors';
import LightningClient from './LightningClient';
import * as lndrpc from '../proto/lndrpc_pb';
import { LightningClient as GrpcClient } from '../proto/lndrpc_grpc_pb';

// TODO: error handling

/** The configurable options for the lnd client. */
type LndConfig = {
  host: string;
  port: number;
  certpath: string;
  macaroonpath: string;
};

/** General information about the state of this lnd client. */
type Info = {
  version?: string;
  chainsList?: string[];
  channels?: ChannelCount;
  blockheight?: number;
  uris?: string[];
  error?: string;
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
class LndClient extends EventEmitter implements LightningClient {
  public static readonly serviceName = 'LND';

  private readonly disconnectedError = Errors.IS_DISCONNECTED(LndClient.serviceName);

  private lightning!: GrpcClient | LightningMethodIndex;
  private meta!: grpc.Metadata;
  private invoiceSubscription?: ClientReadableStream<lndrpc.InvoiceSubscription>;

  /**
   * Create an lnd client.
   * @param config the lnd configuration
   */
  constructor(private logger: Logger, config: LndConfig) {
    super();

    const { host, port, certpath, macaroonpath } = config;

    if (fs.existsSync(macaroonpath) && fs.existsSync(certpath)) {
      const uri = `${host}:${port}`;

      const lndCert = fs.readFileSync(certpath);
      const credentials = grpc.credentials.createSsl(lndCert);

      const adminMacaroon = fs.readFileSync(macaroonpath);
      this.meta = new grpc.Metadata();
      this.meta.add('macaroon', adminMacaroon.toString('hex'));

      this.lightning = new GrpcClient(uri, credentials);
    } else {
      this.logger.error('could not find required files for LND');
      throw(this.disconnectedError);
    }
  }

  public connect = async () => {
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

  public getLndInfo = async (): Promise<Info> => {
    let channels: ChannelCount | undefined;
    let chainsList: string[] | undefined;
    let blockheight: number | undefined;
    let uris: string[] | undefined;
    let version: string | undefined;
    try {
      const lnd = await this.getInfo();
      channels = {
        active: lnd.numActiveChannels,
        pending: lnd.numPendingChannels,
      };
      chainsList = lnd.chainsList,
      blockheight = lnd.blockHeight,
      uris = lnd.urisList,
      version = lnd.version;
      return {
        version,
        chainsList,
        channels,
        blockheight,
        uris,
      };
    } catch (err) {
      this.logger.error(`LND error: ${err}`);
      return {
        version,
        chainsList,
        channels,
        blockheight,
        uris,
        error: err,
      };
    }
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
   * Decode an encoded payment request.
   * @param paymentRequest encoded payment request
   */
  public decodePayReq = (paymentRequest: string): Promise<lndrpc.PayReq.AsObject> => {
    const request = new lndrpc.PayReqString();
    request.setPayReq(paymentRequest);
    return this.unaryCall<lndrpc.PayReqString, lndrpc.PayReq.AsObject>('decodePayReq', request);
  }

  /**
   * Subscribe to events for when invoices are settled.
   */
  private subscribeInvoices = (): void => {
    this.invoiceSubscription = this.lightning.subscribeInvoices(new lndrpc.InvoiceSubscription(), this.meta)
      .on('data', (invoice: lndrpc.Invoice) => {
        this.logger.info(`invoice update: ${invoice.getRHash_asB64()}`);

        if (invoice.getSettled()) {
          this.emit('invoice.settled', String(invoice.getRHash_asB64()));
        }
      })
      .on('error', (error) => {
        this.logger.error(`Invoice subscription ended: ${error}`);
      });
  }
}

export default LndClient;
export { LndConfig, Info };
