import { Arguments } from 'yargs';
import { callback, loadXchangeClient } from '../Command';
import BuilderComponents from '../BuilderComponents';
import { CreateReverseSwapRequest } from '../../proto/xchangerpc_pb';
import { getOrderSide } from '../Utils';

export const command = 'createreverseswap <pair_id> <order_side> <claim_public_key> <amount>';

export const describe = 'creates a new swap from Lightning to the chain';

export const builder = {
  pair_id: BuilderComponents.pairId,
  order_side: BuilderComponents.orderSide,
  claim_public_key: {
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
  request.setOrderSide(getOrderSide(argv.order_side));
  request.setClaimPublicKey(argv.claim_public_key);
  request.setAmount(argv.amount);

  loadXchangeClient(argv).createReverseSwap(request, callback);
};
