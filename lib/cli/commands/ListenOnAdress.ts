import { Arguments } from 'yargs';
import { loadRPCClient } from '../Command';

export const command = 'listenonadress <address>';

export const describe = 'Detect when a transaction sent to a specific address is confirmed.';

export const builder = {
  address: {
    type: 'string',
    hidden: true,
  },
};

export const handler = (argv: Arguments) => {
  const client = loadRPCClient(argv);
};
