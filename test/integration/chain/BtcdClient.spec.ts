import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import BtcdClient from '../../../lib/chain/BtcdClient';

chai.use(chaiAsPromised);

describe('BtcdClient', () => {
  const client = new BtcdClient({
    host: 'localhost',
    port: 18334,
    user: 'user',
    password: 'user',
    certPath: path.join('docker', 'btcd', 'data', 'rpc.cert'),
  });

  it('should connect', async () => {
    await expect(client.connect()).to.be.fulfilled;
  });

  after(async () => {
    await client.disconnect();
  });
});
