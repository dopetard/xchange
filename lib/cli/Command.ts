import { Arguments } from 'yargs';
import RPCClient from '../RPCClient';

export const loadRPCClient = (argv: Arguments): RPCClient => {
  const rpcClient = new RPCClient(argv.rpc.username, argv.rpc.password, argv.rpc.host, argv.rpc.port);
  return rpcClient;
};
