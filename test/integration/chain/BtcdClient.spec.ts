import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import { ECPair, TransactionBuilder } from 'bitcoinjs-lib';
import ChainClient from '../../../lib/chain/ChainClient';
import { ChainType } from '../../../lib/consts/ChainType';
import Networks from '../../../lib/consts/Networks';

chai.use(chaiAsPromised);

describe('BtcdClient', () => {
  const testWif = 'cQ4crx5qPv7NDdj41ehumfB9f89zyWdggy8JnNDjKVQwsLswahd4';
  const testAddress = 'msRY4KpAJ8o9da1YEASy1j2ACnuzh4SyFs';

  const client = new ChainClient({
    host: 'localhost',
    port: 18334,
    rpcuser: 'user',
    rpcpass: 'user',
    certpath: path.join('docker', 'btcd', 'data', 'rpc.cert'),
  }, ChainType.BTC);

  const ltcdClient = new ChainClient({
    host: 'localhost',
    port: 19334,
    rpcpass: 'user',
    rpcuser: 'user',
    certpath: path.join('docker', 'ltcd', 'data', 'rpc.cert'),
  }, ChainType.LTC);

  it('BtcdClient should connect', async () => {
    await expect(client.connect()).to.be.fulfilled;
  });

  it('LtcdClient should connect', async () => {
    await expect(ltcdClient.connect()).to.be.fulfilled;
  });

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
