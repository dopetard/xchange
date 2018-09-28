import { Arguments } from 'yargs';
import { loadWalliClient } from '../Command';
import { SubscribeToTxRequest } from '../../proto/wallirpc_pb';

export const command = 'subscribetotx <reload> <addresses> <outpoints>';

export const describe = 'subscribe to transactions sent to a specific address';

export const builder = {
  reload: {
    type: 'boolean',
  },
  addresses: {
    type: 'string',
  },
  outpoints: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new SubscribeToTxRequest();
  request.setReload(argv.reload);
  request.setAddressesList([argv.addresses]);
  request.setOutpointsList([argv.outpoints]);
  const call = loadWalliClient(argv).subscribeToTx(request);
  // console.log(call);
  call.on('data', (data) => {
    console.log(data);
  });
};
