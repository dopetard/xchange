import fs from 'fs';
import path from 'path';
import grpc from 'grpc';
import errors from '../consts/Errors';
import { Arguments } from 'yargs';
import { getSystemHomeDir } from '../Utils';
import { WalliClient } from '../proto/wallirpc_grpc_pb';

interface GrpcResponse {
  toObject: Function;
}

export const loadWalliClient = (argv: Arguments): WalliClient => {
  const certPath = argv.tlscertpath ? argv.tlscertpath : path.join(getSystemHomeDir(), 'Walli', 'tls.cert');
  const cert = fs.readFileSync(certPath);

  return new WalliClient(`${argv.rpc.host}:${argv.rpc.port}`, grpc.credentials.createSsl(cert));
};

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
