import { Arguments } from 'yargs';
import { callback, loadWalliClient } from '../Command';
import { Message } from '../../proto/wallirpc_pb';

export const command = 'connect';

export const describe = 'connect to an xu node';

export const handler = (argv: Arguments) => {
  const msg = new Message();
  msg.setHello('Hello');
  loadWalliClient(argv).sayHi(msg, callback);
};
