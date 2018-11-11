/* tslint:disable no-null-keyword */
import grpc from 'grpc';
import Service from '../service/Service';
import * as xchangerpc from '../proto/xchangerpc_pb';
import { Info as LndInfo } from '../lightning/LndClient';
import { Info as ChainInfo } from '../chain/ChainClientInterface';
import { XudInfo } from '../xud/XudClient';

const createChainClientInfo = (info: ChainInfo): xchangerpc.ChainInfo => {
  const chainInfo = new xchangerpc.ChainInfo();
  const { version, protocolversion, blocks, connections, testnet } = info;

  chainInfo.setVersion(version);
  chainInfo.setProtocolversion(protocolversion);
  chainInfo.setBlocks(blocks);
  chainInfo.setConnections(connections);
  chainInfo.setTestnet(testnet);

  return chainInfo;
};

const createLndInfo = (lndInfo: LndInfo): xchangerpc.LndInfo => {
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
};

const createXudInfo = (xudInfo: XudInfo): xchangerpc.XudInfo => {
  const xud = new xchangerpc.XudInfo();
  const { version, nodepubkey, lndbtc, lndltc, raiden } = xudInfo;

  xud.setVersion(version);
  xud.setNodepubkey(nodepubkey);
  xud.setLndbtc(lndbtc);
  xud.setLndltc(lndltc);
  xud.setRaiden(raiden);

  return xud;
};

class GrpcService {
  constructor(private service: Service) {}

  public getInfo: grpc.handleUnaryCall<xchangerpc.GetInfoRequest, xchangerpc.GetInfoResponse> = async (_, callback) => {
    try {
      const getInfoResponse = await this.service.getInfo();

      const response = new xchangerpc.GetInfoResponse();
      response.setVersion(getInfoResponse.version);

      const currencies: xchangerpc.CurrencyInfo[] = [];

      getInfoResponse.currencies.forEach((currency) => {
        const currencyInfo = new xchangerpc.CurrencyInfo();

        currencyInfo.setSymbol(currency.symbol);
        currencyInfo.setChain(createChainClientInfo(currency.chainInfo));
        currencyInfo.setLnd(createLndInfo(currency.lndInfo));

        currencies.push(currencyInfo);
      });

      response.setChainsList(currencies);
      response.setXudinfo(createXudInfo(getInfoResponse.xudInfo));

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  public getBalance: grpc.handleUnaryCall<xchangerpc.GetBalanceRequest, xchangerpc.GetBalanceResponse> = async (call, callback) => {
    try {
      const balances = await this.service.getBalance(call.request.toObject());

      const response = new xchangerpc.GetBalanceResponse();

      const responseMap: Map<string, xchangerpc.WalletBalance> = response.getBalancesMap();

      balances.forEach((balance, currency) => {
        const walletBalance = new xchangerpc.WalletBalance();

        walletBalance.setTotalBalance(balance.totalBalance);
        walletBalance.setConfirmedBalance(balance.confirmedBalance);
        walletBalance.setUnconfirmedBalance(balance.unconfirmedBalance);

        responseMap.set(currency, walletBalance);
      });

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  public newAddress: grpc.handleUnaryCall<xchangerpc.NewAddressRequest, xchangerpc.NewAddressResponse> = async (call, callback) => {
    try {
      const address = await this.service.newAddress(call.request.toObject());

      const response = new xchangerpc.NewAddressResponse();
      response.setAddress(address);

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  public createSwap: grpc.handleUnaryCall<xchangerpc.CreateSwapRequest, xchangerpc.CreateSwapResponse> = async (call, callback) => {
    try {
      const { address, expectedAmount, bip21 } = await this.service.createSwap(call.request.toObject());

      const response = new xchangerpc.CreateSwapResponse();
      response.setAddress(address);
      response.setExpectedAmount(expectedAmount);
      response.setBip21(bip21);

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  public createReverseSwap: grpc.handleUnaryCall<xchangerpc.CreateReverseSwapRequest, xchangerpc.CreateReverseSwapResponse> =
  async (call, callback) => {

    try {
      const { invoice, redeemScript, transaction, transactionHash } = await this.service.createReverseSwap(call.request.toObject());

      const response = new xchangerpc.CreateReverseSwapResponse();
      response.setInvoice(invoice);
      response.setRedeemScript(redeemScript);
      response.setTransaction(transaction);
      response.setTransactionHash(transactionHash);

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }
}

export default GrpcService;
