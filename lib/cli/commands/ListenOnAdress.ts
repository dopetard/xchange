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
  client.on('ws:open', () => {
    client.rpcMethodPromise('notifyreceived',[argv.address]).then((data) => {
      console.log(data);
    })
      .catch((err) => {
        console.log(err);
      });
  });
  client.on('recvtx', (data) => {
    console.log(data);
  });
};
