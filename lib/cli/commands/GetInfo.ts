import { Arguments } from 'yargs';
import { callback, loadXchangeClient } from '../Command';
import { GetInfoRequest } from '../../proto/xchangerpc_pb';

export const command = 'getinfo';

export const describe = 'get information about the Xchange instance';

export const handler = (argv: Arguments) => {
  loadXchangeClient(argv).getInfo(new GetInfoRequest(), callback);
};
