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
  
  client.connect()
  .then(() => console.log('made it'))
  .catch(err => console.log(err));

  client.on('ws:open', () => {
    client.rpcMethod('sendrawtransaction', argv.raw_tx)
    .then((data) => {
      client.close()
      .then(() => console.log(data))
      .then(() => console.log('Connection Closed'));
    })
    .catch((err) => {
      client.close()
      .then(() => console.log(err))
      .then(() => console.log('Connection Closed'));
    });
  });
};
