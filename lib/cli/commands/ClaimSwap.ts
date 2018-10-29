import { Arguments } from 'yargs';
import { callback, loadXchangeClient } from '../Command';
import { ClaimSwapRequest } from '../../proto/xchangerpc_pb';

export const command = 'claimswap <currency> <invoice> <preimage> <claim_private_key> <destination_address>';

export const describe = 'claims the onchain part of a reverse swap';

export const builder = {
  currency: {
    describe: 'currency of the chain you are claiming on',
    type: 'string',
  },
  invoice: {
    describe: 'invoice that was paid',
    type: 'string',
  },
  preimage: {
    describe: 'preimage of the invoice',
    type: 'string',
  },
  claim_private_key: {
    describe: 'public key with which a claiming transaction has to be signed',
    type: 'string',
  },
  destination_address: {
    descibe: 'address to which claimed funds should be sent',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ClaimSwapRequest();

  request.setCurrency(argv.currency);
  request.setInvoice(argv.invoice);
  request.setPreimage(argv.preimage);
  request.setClaimPrivateKey(argv.claim_private_key);
  request.setDestinationAddress(argv.destination_address);

  loadXchangeClient(argv).claimSwap(request, callback);
};
