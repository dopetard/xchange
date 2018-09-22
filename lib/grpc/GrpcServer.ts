import grpc, { Server } from 'grpc';
import Logger from '../Logger';
import { errors } from './errors';
import GrpcService from './GrpcService';
import Service from '../service/Service';
import { WalliService } from '../proto/wallirpc_grpc_pb';
import assert from 'assert';

type GrpcConfig = {
  host: string,
  port: number,
};

class GrpcServer {
  private server: Server;
  private logger: Logger;
  private grpcConfig: GrpcConfig;

  constructor(logger: Logger, service: Service, grpcConfig: GrpcConfig) {
    this.server = new grpc.Server();
    this.logger = logger;
    this.grpcConfig = grpcConfig;

    const grpcService = new GrpcService(logger, service);
    this.server.addService(WalliService, {
      getInfo: grpcService.getInfo,
    });
  }

  public listen = async () => {
    const { port, host } = this.grpcConfig;
    assert(Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65536');
    const bindCode = this.server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());

    if (bindCode !== port) {
      const error = errors.COULD_NOT_BIND(host , port.toString());
      throw(error);
    } else {
      this.server.start();
      this.logger.info(`gRPC server listening on: ${host}:${port}`);
      return true;
    }
  }

  public close = async () => {
    return new Promise((resolve) => {
      this.server.tryShutdown(() => {
        this.logger.info('GRPC server completed shutdown');
        resolve();
      });
    });
  }
}

export default GrpcServer;
export { GrpcConfig };
