import { IBaseClient } from '../BaseClient';

/**
 * A generic interface that can be used for multiple Lightning clients and implementations
 */
interface LightningClient extends IBaseClient {
  on(event: 'invoice.settled', listener: (rHash: string) => void): this;
  addInvoice(value: number): Promise<any>;
  payInvoice(invoice: string): Promise<any>;
}

export default LightningClient;
