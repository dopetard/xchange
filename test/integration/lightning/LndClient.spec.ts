import path from 'path';
import Logger from '../../../lib/Logger';
import LndClient from '../../../lib/lightning/LndClient';

describe('LndClient', () => {
  it('LndClients should connect', async () => {
    await lndBtcClient1.connect();
  });

  after(async () => {
    await lndBtcClient1.close();
  });
});

export const lndBtcClient1 = new LndClient(Logger.disabledLogger, {
  host: 'localhost',
  port: 10009,
  certpath: path.join('docker', 'data', 'lndBtc1', 'rpc.cert'),
});

export const lndBtcClient2 = new LndClient(Logger.disabledLogger, {
  host: 'localhost',
  port: 10010,
  certpath: path.join('docker', 'data', 'lndBtc2', 'rpc.cert'),
});
