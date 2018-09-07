import { Arguments } from 'yargs';
import RpcClient from '../rpc/RpcClient';

export const loadRPCClient = (argv: Arguments): RpcClient => {
  const rpcClient = new RpcClient(argv.rpc);
  return rpcClient;
};
