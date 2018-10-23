/* tslint:disable no-floating-promises no-null-keyword */
import grpc from 'grpc';
import Service from '../service/Service';
import * as xchangerpc from '../proto/xchange_pb';
import { Info as LndInfo } from '../lightning/LndClient';
import { Info as ChainInfo } from '../chain/ChainClientInterface';
import { XudInfo } from '../xud/XudClient';

class GrpcService {

  constructor(private service: Service) {}

  public getInfo: grpc.handleUnaryCall<xchangerpc.GetInfoRequest, xchangerpc.GetInfoResponse> = async (_, callback) => {
    try {
      const response = new xchangerpc.GetInfoResponse();

      const getInfoResponse = await this.service.getInfo();
      response.setVersion(getInfoResponse.version);

      const getLndInfo = ((lndInfo: LndInfo): xchangerpc.LndInfo => {
        const lnd = new xchangerpc.LndInfo();
        const { version, blockheight, error } = lndInfo;

        if (lndInfo.channels) {
          const channels = new xchangerpc.LndChannels();

          channels.setActive(lndInfo.channels.active);
          channels.setPending(lndInfo.channels.pending);
          channels.setInactive(lndInfo.channels.inactive ? lndInfo.channels.inactive : 0);

          lnd.setLndchannels(channels);
        }

        lnd.setVersion(version ? version : '');
        lnd.setBlockheight(blockheight ? blockheight : 0);

        lnd.setError(error ? error : '');

        return lnd;
      });

      const getChainInfo = ((info: ChainInfo): xchangerpc.ChainInfo => {
        const chainInfo = new xchangerpc.ChainInfo();
        const { version, protocolversion, blocks, connections, testnet } = info;

        chainInfo.setVersion(version);
        chainInfo.setProtocolversion(protocolversion);
        chainInfo.setBlocks(blocks);
        chainInfo.setConnections(connections);
        chainInfo.setTestnet(testnet);

        return chainInfo;
      });

      const getXudInfo = ((xudInfo: XudInfo) => {
        const xud = new xchangerpc.XudInfo();
        const { version, nodepubkey, lndbtc, lndltc, raiden } = xudInfo;

        xud.setVersion(version);
        xud.setNodepubkey(nodepubkey);
        xud.setLndbtc(lndbtc);
        xud.setLndltc(lndltc);
        xud.setRaiden(raiden);

        return xud;
      });

      const currencies: xchangerpc.CurrencyInfo[] = [];

      getInfoResponse.currencies.forEach((currency) => {
        const currencyInfo = new xchangerpc.CurrencyInfo();

        currencyInfo.setChain(getChainInfo(currency.chainInfo));
        currencyInfo.setLnd(getLndInfo(currency.lndInfo));

        currencies.push(currencyInfo);
      });

      response.setChainsList(currencies);
      response.setXudinfo(getXudInfo(getInfoResponse.xudInfo));

      callback(null, response);

    } catch (error) {
      callback(error, null);
    }
  }

}

export default GrpcService;
