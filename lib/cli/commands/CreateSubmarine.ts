import { Arguments } from 'yargs';
import { callback, loadWalliClient } from '../Command';
import { CreateSubmarineRequest } from '../../proto/wallirpc_pb';

export const command = 'createsubmarine <invoice>';

export const describe = 'Create a new Submarine Swap';

export const builder = {
  invoice: {
    describe: 'the invoice that should be paid',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CreateSubmarineRequest();
  request.setInvoice(argv.invoice);

  loadWalliClient(argv).createSubmarine(request, callback);
};
