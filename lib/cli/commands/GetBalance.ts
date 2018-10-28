import { Arguments } from 'yargs';
import { callback, loadXchangeClient } from '../Command';
import { GetBalanceRequest } from '../../proto/xchangerpc_pb';

export const command = 'getbalance [currency]';

export const describe = 'get the balance of all wallets or a specific one';

export const builder = {
  currency: {
    describe: 'ticker symbol of the currency',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GetBalanceRequest();

  request.setCurrency(argv.currency);

  loadXchangeClient(argv).getBalance(request, callback);
};
