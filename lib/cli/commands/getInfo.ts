import { Arguments } from 'yargs';
import { callback, loadWalliClient } from '../command';
import { GetInfoRequest } from '../../proto/wallirpc_pb';

export const command = 'getinfo';

export const describe = 'get info about btcd';

export const handler = (argv: Arguments) => {
  loadWalliClient(argv).getInfo(new GetInfoRequest(), callback);
};
