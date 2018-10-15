import { expect } from 'chai';
import path from 'path';
import Logger from '../../../lib/Logger';
import LndClient from '../../../lib/lightning/LndClient';
import { btcdClient, btcManager } from '../chain/ChainClient.spec';

describe('LndClient', () => {
  before(async () => {
    await btcdClient.connect();
  });

  const channelCapacity = 10000000;

  let lndBtc2PubKey: string;

  it('LndClients should connect', async () => {
    // TODO: make this dynamic
    // Sleep for 5 seconds to let the LNDs sync
    await sleep(5);

    await lndBtcClient1.connect();
    await lndBtcClient2.connect();

    // Connect the LNDs to eachother
    const lndBtc2Info = await lndBtcClient2.getInfo();
    await lndBtcClient1.connectPeer(lndBtc2Info.identityPubkey, 'lnd:9735');

    lndBtc2PubKey = lndBtc2Info.identityPubkey;
  }).timeout(10000);

  it('LndClients should fund get funds', async () => {
    const btcAddress = await lndBtcClient1.newAddress();
    const btcTxn = btcManager.constructTransaction(btcAddress.address, channelCapacity * 10);

    await btcManager.broadcastAndMine(btcTxn.toHex()),

    // Sleep for 1 seconds to let LND sync
    await sleep(2);
  }).timeout(10000);

  it('LndClients should open a channel to eachother', async () => {
    expect(lndBtc2PubKey).to.not.be.undefined;

    await lndBtcClient1.openChannel(lndBtc2PubKey, channelCapacity, channelCapacity / 2),
    await btcdClient.generate(1);
  });

  after(async () => {
    await lndBtcClient1.close();
    await lndBtcClient2.close();

    await btcdClient.disconnect();
  });
});

const sleep = (seconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const certpath = path.join('docker', 'data', 'lnd', 'tls.cert');

export const lndBtcClient1 = new LndClient(Logger.disabledLogger, {
  certpath,
  host: 'localhost',
  port: 10009,
});

export const lndBtcClient2 = new LndClient(Logger.disabledLogger, {
  certpath,
  host: 'localhost',
  port: 10010,
});
