import { Arguments } from 'yargs';
import { loadWalliClient, callback } from '../Command';
import { Message } from '../../proto/wallirpc_pb';

export const command = 'connect';

export const describe = 'connect to walli node';

export const handler = (argv: Arguments) => {
  try {
    const msg = new Message();
    loadWalliClient(argv).sayHi(msg, callback);
  } catch (error) {
    console.log(`noooo: ${ error }`);
  }
};
