import { Arguments } from 'yargs';
import { callback, loadXchangeClient } from '../Command';
import { OutputTypeComponent } from '../BuilderComponents';
import { CreateSwapRequest } from '../../proto/xchangerpc_pb';

export const command = 'createswap <pair_id> <order_side> <invoice> [output_type] [refund_public_key]';

export const describe = 'create a new swap from the chain to Lightning';

export const builder = {
  pair_id: {
    describe: 'the traiding pair id of the order',
    type: 'string',
  },
  order_side: {
    describe: 'whether the order is a buy or sell one',
    type: 'string',
    choices: ['buy', 'sell'],
  },
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

  loadXchangeClient(argv).createSwap(request, callback);
};
