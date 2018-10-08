import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import { ECPair, TransactionBuilder } from 'bitcoinjs-lib';
import BtcdClient from '../../../lib/chain/BtcdClient';
import Networks from '../../../lib/consts/Networks';

chai.use(chaiAsPromised);

describe('BtcdClient', () => {
  const testWif = 'cQ4crx5qPv7NDdj41ehumfB9f89zyWdggy8JnNDjKVQwsLswahd4';
  const testAddress = 'msRY4KpAJ8o9da1YEASy1j2ACnuzh4SyFs';

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
/*
  it('should get info about the node', async () => {
    const result = await client.getInfo();

    expect(result.version).to.be.equal(120000);
  });
*/
  it('should update address subscriptions', async () => {
    await expect(client.loadTxFiler(true, [testAddress], [])).to.be.fulfilled;
  });

  it('should emit an event when a transaction is sent to relevant address', async () => {
    const blockHashes = await client.generate(100);
    const block = await client.getBlock(blockHashes[0]);

    const keys = ECPair.fromWIF(testWif, Networks.bitcoin_regtest);

    const tx = new TransactionBuilder(Networks.bitcoin_regtest);

    tx.addInput(block.tx[0], 0);
    tx.addOutput(testAddress, 1);
    tx.sign(0, keys);

    const txHex = tx.build().toHex();

    let eventReceived = false;

    client.on('transaction', (transactionHex) => {
      if (transactionHex === txHex) {
        eventReceived = true;
      }
    });

    await expect(client.sendRawTransaction(txHex)).to.be.fulfilled;
    await expect(client.generate(1)).to.be.fulfilled;

    expect(eventReceived).to.be.true;
  });

  after(async () => {
    await client.disconnect();
  });
});
