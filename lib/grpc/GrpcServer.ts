import grpc, { Server } from 'grpc';
import Logger from '../Logger';
import errors from './errors';
import { WalliService } from '../proto/wallirpc_grpc_pb';
import assert from 'assert';

class GrpcServer {
  private server: Server;
  private logger: Logger;

  constructor(logger: Logger) {
    this.server = new grpc.Server();
    this.logger = logger;

    this.server.addService(WalliService, {
      sayHi: (call, callback) => {
        callback(undefined, { message: `Hello user! ${call}` });
      },
    });
  }

  public listen = (port: number, host: string): boolean => {
    assert(Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65536');
    const bindCode = this.server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());

    if (bindCode !== port) {
      const error = errors.COULD_NOT_BIND(port.toString());
      this.logger.error(error.message);
      return false;
    }

    this.server.start();
    this.logger.info(`gRPC server listening on ${host}:${port}`);
    return true;
  }

  public close = (): Promise<void> => {
    return new Promise((resolve) => {
      this.server.tryShutdown(() => {
        this.logger.info('GRPC server completed shutdown');
        resolve();
      });
    });
  }
}

export default GrpcServer;
