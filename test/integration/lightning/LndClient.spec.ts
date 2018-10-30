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
    await connectPromise();
    // Connect the LNDs to eachother
    const lndBtc2Info = await lndBtcClient2.getInfo();

    try {
      await lndBtcClient1.connectPeer(lndBtc2Info.identityPubkey, 'lnd:9735');
    } catch (error) {
      // Handle "already connected" errors gracefully
      if (!error.details.startsWith('already connected to peer:')) {
        throw error;
      }
    }

    lndBtc2PubKey = lndBtc2Info.identityPubkey;
  });

  it('LndClients should fund get funds', async () => {
    const btcAddress = await lndBtcClient1.newAddress();
    const btcTxn = btcManager.constructTransaction(btcAddress.address, channelCapacity * 10);

    await btcManager.broadcastAndMine(btcTxn.toHex());

    await connectPromise();
  });

  it('LndClients should open a channel to eachother', async () => {
    expect(lndBtc2PubKey).to.not.be.undefined;

    const channelPromise = new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          await lndBtcClient1.openChannel(lndBtc2PubKey, channelCapacity, channelCapacity / 2),
          await btcdClient.generate(1);

          clearInterval(interval);
          resolve();
        } catch (error) {
          // Don't throw an error if the problem is LND not being synced yet
          if (error.details !== 'channels cannot be created before the wallet is fully synced') {
            throw error;
          }
        }
      }, 500);
    });

    await channelPromise;
  });

  after(async () => {
    await lndBtcClient1.disconnect();
    await lndBtcClient2.disconnect();

    await btcdClient.disconnect();
  });
});

const connectPromise = async () => {
  return new Promise(async (resolve) => {
    await lndBtcClient1.connect();
    await lndBtcClient2.connect();

    const interval = setInterval(async () => {
      if (lndBtcClient1.isConnected() && lndBtcClient2.isConnected()) {
        // To make sure the LNDs are *really* synced
        try {
          await lndBtcClient1.connectPeer('', '');
          await lndBtcClient2.connectPeer('', '');
        } catch (error) {
          if (error.details === 'pubkey string is empty') {
            clearInterval(interval);
            resolve();
          }
        }
      }
    }, 1000);
  });
};

const certpath = path.join('docker', 'data', 'lnd', 'tls.cert');
const host = process.platform === 'win32' ? '192.168.99.100' : 'localhost';

// TODO: the logger shouldn't print anything
export const lndBtcClient1 = new LndClient(Logger.disabledLogger, {
  certpath,
  host,
  port: 10009,
}, 'BTC');

export const lndBtcClient2 = new LndClient(Logger.disabledLogger, {
  certpath,
  host,
  port: 10010,
}, 'LTC');
