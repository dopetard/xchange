import { Arguments } from 'yargs';
import { callback, loadXchangeClient } from '../Command';
import { OutputTypeComponent, OrderSideComponent } from '../BuilderComponents';
import { CreateSwapRequest } from '../../proto/xchangerpc_pb';

export const command = 'createswap <pair_id> <order_side> <invoice> [output_type] [refund_public_key]';

export const describe = 'create a new swap from the chain to Lightning';

export const builder = {
  pair_id: {
    describe: 'the traiding pair id of the order',
    type: 'string',
  },
  order_side: OrderSideComponent,
  invoice: {
    describe: 'the invoice to pay',
    type: 'string',
  },
  output_type: OutputTypeComponent,
  refund_public_key: {
    describe: 'public key with which a refund transaction has to be signed',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CreateSwapRequest();

  request.setPairId(argv.pair_id);
  request.setOrderSide(argv.order_side);
  request.setInvoice(argv.invoice);
  request.setOutputType(argv.output_type);
  request.setRefundPublicKey(argv.refund_public_key);

  loadXchangeClient(argv).createSwap(request, callback);
};
