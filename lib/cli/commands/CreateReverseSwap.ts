import { Arguments } from 'yargs';
import { callback, loadXchangeClient } from '../Command';
import { OrderSideComponent } from '../BuilderComponents';
import { CreateReverseSwapRequest } from '../../proto/xchangerpc_pb';

export const command = 'createreverseswap <pair_id> <order_side> <destination_public_key> <amount>';

export const describe = 'creates a new Swap from Lightning to the chain';

export const builder = {
  pair_id: {
    describe: 'the traiding pair id of the order',
    type: 'string',
  },
  order_side: OrderSideComponent,
  destination_public_key: {
    describe: 'public key with which a claiming transaction has to be signed',
    type: 'string',
  },
  amount: {
    describe: 'amount of the invoice that will be returned',
    type: 'number',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CreateReverseSwapRequest();

  request.setPairId(argv.pair_id);
  request.setOrderSide(argv.order_side);
  request.setDestinationPublicKey(argv.destination_public_key);
  request.setAmount(argv.amount);

  loadXchangeClient(argv).createReverseSwap(request, callback);
};
