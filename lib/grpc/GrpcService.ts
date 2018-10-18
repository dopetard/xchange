/* tslint:disable no-floating-promises no-null-keyword */
import grpc from 'grpc';
import Service from '../service/Service';
import * as wallirpc from '../proto/wallirpc_pb';
import { Info as LndInfo } from '../lightning/LndClient';
import { Info as ChainInfo } from '../chain/ChainClientInterface';
import { Addresses } from '../swap/SwapManager';
import { XudInfo } from '../xud/XudClient';

class GrpcService {

  constructor(private service: Service) {}

  public getInfo: grpc.handleUnaryCall<wallirpc.GetInfoRequest, wallirpc.GetInfoResponse> = async (_, callback) => {
    try {
      const response = new wallirpc.GetInfoResponse();

      const getInfoResponse = await this.service.getInfo();
      response.setVersion(getInfoResponse.version);

      const getLndInfo = ((lndInfo: LndInfo): wallirpc.LndInfo => {
        const lnd = new wallirpc.LndInfo();
        const { version, blockheight, error } = lndInfo;

        if (lndInfo.channels) {
          const channels = new wallirpc.LndChannels();
          channels.setActive(lndInfo.channels.active);
          channels.setPending(lndInfo.channels.pending);
          lndInfo.channels.inactive ? channels.setInactive(lndInfo.channels.inactive) : undefined;
          lnd.setLndchannels(channels);
        }

        version ? lnd.setVersion(version) : undefined;
        blockheight ? lnd.setBlockheight(blockheight) : undefined;
        lnd.setError(error ? error : '');
        return lnd;
      });

      const getChainInfo = ((info: ChainInfo): wallirpc.ChainInfo => {
        const chainInfo = new wallirpc.ChainInfo;

        const { version, protocolversion, blocks, connections, testnet } = info;
        chainInfo.setVersion(version);
        chainInfo.setProtocolversion(protocolversion);
        chainInfo.setBlocks(blocks);
        chainInfo.setConnections(connections);
        chainInfo.setTestnet(testnet);
        return chainInfo;
      });

      const getXudInfo = ((xudInfo: XudInfo) => {
        const xud = new wallirpc.XudInfo;

        const { version, nodepubkey, lndbtc, lndltc, raiden } = xudInfo;
        xud.setVersion(version);
        xud.setNodepubkey(nodepubkey);
        xud.setLndbtc(lndbtc);
        xud.setLndltc(lndltc);
        xud.setRaiden(raiden);
        return xud;
      });

      response.setLndinfo(getLndInfo(getInfoResponse.lndbtcInfo));
      response.setXudinfo(getXudInfo(getInfoResponse.xudInfo));
      response.setBtcdinfo(getChainInfo(getInfoResponse.btcdInfo));
      response.setLtcdinfo(getChainInfo(getInfoResponse.ltcdInfo));

      callback(null, response);

    } catch (error) {
      callback(error, null);
    }
  }

  public createSubmarine: grpc.handleUnaryCall<wallirpc.CreateSubmarineRequest, wallirpc.CreateSubmarineResponse> = async (call, callback) => {
    try {
      const response = new wallirpc.CreateSubmarineResponse();

      const createSubmarineResponse = await this.service.createSubmarine(call.request.toObject());

      const getAddresses = (addresses: Addresses) => {
        const addressesRpc = new wallirpc.Addresses();

        addressesRpc.setBech32(addresses.bech32);
        addressesRpc.setCompatibility(addresses.compatibility);
        addressesRpc.setLegacy(addresses.legacy);

        return addressesRpc;
      };

      response.setAddresses(getAddresses(createSubmarineResponse));

      callback(null, response);

    } catch (error) {
      callback(error, null);
    }
  }
}

export default GrpcService;
