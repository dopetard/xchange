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

  client.connect()
  .then(() => console.log('Connected'))
  .catch(err => console.log(err));

  client.on('ws:open', () => {
    client.rpcMethod('notifyreceived', [argv.address]).then((data) => {
      console.log(data);
    })
      .catch((err) => {
        client.close()
        .then(() => console.log(err))
        .then(() => console.log('Connection Closed'))
        .catch();
      });
  });
  client.on('recvtx', (data) => {
    console.log(data);
  });
};
