/* tslint:disable no-floating-promises no-null-keyword */
import grpc from 'grpc';
import Service from '../service/Service';
import Logger from '../Logger';
import { LndInfo } from '../lightning/LndClient';
import * as wallirpc from '../proto/wallirpc_pb';
import { BtcdInfo } from '../chain/BtcdClient';

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
        chainsList ? lnd.setChainsList(chainsList) : undefined;
        blockheight ? lnd.setBlockheight(blockheight) : undefined;
        uris ? lnd.setUrisList(uris) : undefined;
        lnd.setError(error ? error : 'null');
        return lnd;
      });

      const getBtcdInfo = ((btcdInfo: BtcdInfo): wallirpc.BtcdInfo => {
        const btcd = new wallirpc.BtcdInfo;

        const { version, protocolversion, blocks, timeoffset, connections, proxy, difficulty, testnet, relayfee } = btcdInfo;
        btcd.setVersion(version);
        btcd.setProtocolversion(protocolversion);
        btcd.setBlocks(blocks);
        btcd.setTimeoffset(timeoffset);
        btcd.setConnections(connections);
        btcd.setProxy(proxy);
        btcd.setTestnet(testnet);
        btcd.setRelayfee(relayfee);
        return btcd;
      });

      response.setLndinfo(getLndInfo(getInfoResponse.lndInfo));
      response.setBtcdinfo(getBtcdInfo(getInfoResponse.btcdInfo));

      callback(null, response);

    } catch (error) {
      callback(error, null);
    }
  }
}

export default GrpcService;
