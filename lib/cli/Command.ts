import { Arguments } from 'yargs';
import { deepMergeArgv } from './Utils';
import RPCClient from '../RPCClient';
import Walli from '../Walli';

export const loadRPCClient = (argv: Arguments): RPCClient => {
  const rpcClient = new RPCClient(argv.rpc.username, argv.rpc.password, argv.rpc.host, argv.rpc.port);
  return rpcClient;
};


export const startWalli = (argv: Arguments): Walli => {
  const config = deepMergeArgv(argv);
  const walli = new Walli(config);
  return walli;
}