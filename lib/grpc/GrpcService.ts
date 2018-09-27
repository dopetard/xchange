/* tslint:disable no-floating-promises no-null-keyword */
import grpc from 'grpc';
import Service from '../service/Service';
import Logger from '../Logger';
import { Info as LndInfo } from '../lightning/LndClient';
import * as wallirpc from '../proto/wallirpc_pb';
import { Info as BtcdInfo } from '../chain/BtcdClient';

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
      response.setVersion(getInfoResponse.version);

      const getLndInfo = ((lndInfo: LndInfo): wallirpc.LndInfo => {
        const lnd = new wallirpc.LndInfo();
        const { version, chainsList, blockheight, uris, error } = lndInfo;

        if (lndInfo.channels) {
          const channels = new wallirpc.LndChannels();
          channels.setActive(lndInfo.channels.active);
          channels.setPending(lndInfo.channels.pending);
          lndInfo.channels.inactive ? channels.setInactive(lndInfo.channels.inactive) : undefined;
          lnd.setLndchannels(channels);
        }

        version ? lnd.setVersion(version) : undefined;
        blockheight ? lnd.setBlockheight(blockheight) : undefined;
        lnd.setError(error ? error : 'null');
        return lnd;
      });

      const getBtcdInfo = ((btcdInfo: BtcdInfo): wallirpc.BtcdInfo => {
        const btcd = new wallirpc.BtcdInfo;

        const { version, protocolversion, blocks, timeoffset, connections, proxy, difficulty, testnet, relayfee } = btcdInfo;
        btcd.setVersion(version);
        btcd.setProtocolversion(protocolversion);
        btcd.setBlocks(blocks);
        btcd.setConnections(connections);
        btcd.setTestnet(testnet);
        return btcd;
      });

      response.setLndinfo(getLndInfo(getInfoResponse.lndInfo));
      response.setBtcdinfo(getBtcdInfo(getInfoResponse.btcdInfo));

      callback(null, response);

    } catch (error) {
      callback(error, null);
    }
  }

  public subscribeToTx: grpc.handleServerStreamingCall<wallirpc.SubscribeToTxRequest, wallirpc.SubscribeToTxResponse> = (call) => {
    this.service.subscribeToTx(call.request.toObject() , msg => call.write(msg));
  }
}

export default GrpcService;
