import { Arguments } from 'yargs';
import RPCClient from '../RPCClient';

export const loadRPCClient = (argv: Arguments): RPCClient => {
  const rpcClient = new RPCClient(argv.rpc);
  return rpcClient;
};
