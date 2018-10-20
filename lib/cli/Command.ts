import fs from 'fs';
import path from 'path';
import grpc from 'grpc';
import { Arguments } from 'yargs';
import { getServiceDataDir } from '../Utils';
import { XchangeClient } from '../proto/xchange_grpc_pb';

interface GrpcResponse {
  toObject: Function;
}

export const loadXchangeClient = (argv: Arguments): XchangeClient => {
  const certPath = argv.tlscertpath ? argv.tlscertpath : path.join(getServiceDataDir('xchange'), 'tls.cert');
  const cert = fs.readFileSync(certPath);

  return new XchangeClient(`${argv.rpc.host}:${argv.rpc.port}`, grpc.credentials.createSsl(cert));
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
