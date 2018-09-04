import { Arguments } from 'yargs';
import { loadRPCClient } from '../Command';

export const command = 'sendrawtx <raw_tx>';

export const describe = 'Brodcast a tx to ltc or btc network.';

export const builder = {
  raw_tx: {
    type: 'string',
    hidden: true,
  },
};

export const handler = (argv: Arguments) => {
  const client = loadRPCClient(argv);
  client.on('ws:open', () => {
    client.rpcMethod('sendrawtransaction', argv.raw_tx)
    .then((data) => {
      console.log(data);
      client.close();
    })
    .catch((err) => {
      console.log(err);
      client.close();
    });
  });
};
