import { expect } from 'chai';
import path from 'path';
import Logger from '../../../lib/Logger';
import LndClient from '../../../lib/lightning/LndClient';
import { constructTransaction, broadcastAndMine, btcdClient } from '../chain/ChainClient.spec';

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
    const newAddress = await lndBtcClient1.newAddress();

    const transaction = constructTransaction(newAddress.address, channelCapacity * 10);
    await broadcastAndMine(transaction.toHex());

    // Sleep for 1 seconds to let the LNDs sync
    await sleep(1);
  }).timeout(50000);

  it('LndClients should open channel to eachother', async () => {
    expect(lndBtc2PubKey).to.not.be.undefined;

    await lndBtcClient1.openChannel(lndBtc2PubKey, 10000000, channelCapacity / 2);
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

export const lndBtcClient1 = new LndClient(Logger.disabledLogger, {
  host: 'localhost',
  port: 10009,
  certpath: path.join('docker', 'data', 'lnd', 'tls.cert'),
});

export const lndBtcClient2 = new LndClient(Logger.disabledLogger, {
  host: 'localhost',
  port: 10010,
  certpath: path.join('docker', 'data', 'lnd', 'tls.cert'),
});
