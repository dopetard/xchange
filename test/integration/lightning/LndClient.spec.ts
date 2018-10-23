import { expect } from 'chai';
import path from 'path';
import Logger from '../../../lib/Logger';
import LndClient from '../../../lib/lightning/LndClient';
import { btcdClient, btcManager } from '../chain/ChainClient.spec';
import { ChainType } from '../../../lib/consts/ChainType';

describe('LndClient', () => {
  before(async () => {
    await btcdClient.connect();
  });

  const channelCapacity = 10000000;

  let lndBtc2PubKey: string;

  it('LndClients should connect', async () => {
    await connectPromise();

    // Connect the LNDs to eachother
    const lndBtc2Info = await lndBtcClient2.getInfo();
    await lndBtcClient1.connectPeer(lndBtc2Info.identityPubkey, 'lnd:9735');

    lndBtc2PubKey = lndBtc2Info.identityPubkey;
  }).timeout(10000);

  it('LndClients should fund get funds', async () => {
    const btcAddress = await lndBtcClient1.newAddress();
    const btcTxn = btcManager.constructTransaction(btcAddress.address, channelCapacity * 10);

    await btcManager.broadcastAndMine(btcTxn.toHex());

    await connectPromise();
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

const connectPromise = async () => {
  return new Promise((resolve, reject) => {
    let iteration = 0;

    const interval = setInterval(async () => {
      try {
        const ready1 = await lndBtcClient1.connect();
        const ready2 = await lndBtcClient2.connect();

        if (ready1 && ready2) {
          // To make sure the LNDs are *really* synced
          try {
            await lndBtcClient1.connectPeer('', '');
            await lndBtcClient2.connectPeer('', '');
          } catch (error) {
            if (error.details !== 'pubkey string is empty') {
              throw('');
            }
          }

          clearInterval(interval);
          resolve();
        }
      } catch (err) {}

      iteration += 1;

      if (iteration > 50) {
        reject('LNDs are not connecting');
      }
    }, 500);
  });
};

const certpath = path.join('docker', 'data', 'lnd', 'tls.cert');

export const lndBtcClient1 = new LndClient(Logger.disabledLogger, {
  certpath,
  host: 'localhost',
  port: 10009,
}, ChainType.BTC);

export const lndBtcClient2 = new LndClient(Logger.disabledLogger, {
  certpath,
  host: 'localhost',
  port: 10010,
}, ChainType.LTC);
