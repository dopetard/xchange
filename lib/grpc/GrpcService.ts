/* tslint:disable no-floating-promises no-null-keyword */
import grpc from 'grpc';
import Service from '../service/Service';
import Logger from '../Logger';
import * as wallirpc from '../proto/wallirpc_pb';

class GrpcService {
  private logger: Logger;
  private service: Service;

  constructor(logger: Logger, service: Service) {
    this.logger = logger;
    this.service = service;
  }

  public getInfo: grpc.handleUnaryCall<wallirpc.GetInfoRequest, wallirpc.GetInfoResponse> = async (_, callback) => {
    try {
      const getInfoResponse = await this.service.getInfo();
      const response = new wallirpc.GetInfoResponse();
      response.setVersion(getInfoResponse['version']);
      response.setProtocolversion(getInfoResponse['protocolversion']);
      response.setBlocks(getInfoResponse['blocks']);
      response.setTimeoffset(getInfoResponse['timeoffset']);
      response.setConnections(getInfoResponse['connections']);
      response.setProxy(getInfoResponse['proxy']);
      response.setDifficulty(getInfoResponse['difficulty']);
      response.setTestnet(getInfoResponse['testnet']);
      response.setRelayfee(getInfoResponse['relayfee']);

      callback(null, response);

    } catch (error) {
      callback(error, null);
    }
  }
}

export default GrpcService;
