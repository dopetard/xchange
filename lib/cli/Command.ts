import { Arguments } from 'yargs';
import grpc from 'grpc';
import { WalliClient } from '../proto/wallirpc_grpc_pb';

export const loadWalliClient = (argv: Arguments): WalliClient => {
  const credentials = grpc.credentials.createInsecure();
  return new WalliClient(`${argv.rpc.host}:${argv.rpc.port}`, credentials);
};

interface GrpcResponse {
  toObject: Function;
}

export const callback = (error: Error | null, response: GrpcResponse) => {
  if (error) {
    console.error(`${error.name}: ${error.message}`);
  } else {
    const responseObj = response.toObject();
    if (Object.keys(responseObj).length === 0) {
      console.log('success');
    } else {
      console.log(JSON.stringify(responseObj, undefined, 2));
    }
  }
};
