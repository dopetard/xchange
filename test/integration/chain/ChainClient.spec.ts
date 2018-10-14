import { expect } from 'chai';
import path from 'path';
import { ECPair, TransactionBuilder, Transaction } from 'bitcoinjs-lib';
import ChainClient from '../../../lib/chain/ChainClient';
import { ChainType } from '../../../lib/consts/ChainType';
import Networks from '../../../lib/consts/Networks';

describe('ChainClient', () => {
  it('BtcdClient should connect', async () => {
    await btcdClient.connect();
  });

  it('BtcdClient should activate SegWit', async () => {
    // 433 blocks are needed to active SegWit on the BTCD regtest network
    const blockHashes = await btcdClient.generate(433);

    const block = await btcdClient.getBlock(blockHashes[0]);
    const rawTransaction = await btcdClient.getRawTransaction(block.tx[0]);
    const transaction = Transaction.fromHex(rawTransaction);

    utxo = {
      hash: transaction.getId(),
      value: transaction.outs[0].value,
    };
  });

  it('LtcdClient should connect', async () => {
    await ltcdClient.connect();
  });

  it('should update address subscriptions', async () => {
    await btcdClient.loadTxFiler(true, [testAddress], []);
  });

  it('should emit an event when a transaction is sent to relevant address', async () => {
    const transaction = await constructTransaction(testAddress, 1);
    const txHex = transaction.toHex();

    let eventReceived = false;

    btcdClient.on('transaction.relevant', (transactionHex) => {
      if (transactionHex === txHex) {
        eventReceived = true;
      }
    });

    await broadcastAndMine(txHex);

    expect(eventReceived).to.be.true;
  });

  after(async () => {
    await Promise.all([
      btcdClient.disconnect(),
      ltcdClient.disconnect(),
    ]);
  });
});

// The UTXO that will can be spent with constructTransaction
let utxo: { hash: string, value: number };

export const testKeys = ECPair.fromWIF('cQ4crx5qPv7NDdj41ehumfB9f89zyWdggy8JnNDjKVQwsLswahd4', Networks.bitcoin_regtest);
export const testAddress = 'msRY4KpAJ8o9da1YEASy1j2ACnuzh4SyFs';

export const btcdClient = new ChainClient({
  host: 'localhost',
  port: 18334,
  rpcuser: 'user',
  rpcpass: 'user',
  certpath: path.join('docker', 'data', 'rpc.cert'),
}, ChainType.BTC);

export const ltcdClient = new ChainClient({
  host: 'localhost',
  port: 19334,
  rpcpass: 'user',
  rpcuser: 'user',
  certpath: path.join('docker', 'data', 'rpc.cert'),
}, ChainType.LTC);

export const constructTransaction = (destinationAddress: string, value: number): Transaction => {
  const tx = new TransactionBuilder(Networks.bitcoin_regtest);

  // Value of the new UTXO
  const utxoValue = (utxo.value - value) - 500;

  tx.addInput(utxo.hash, 0);
  tx.addOutput(testAddress, utxoValue);

  tx.addOutput(destinationAddress, value);

  tx.sign(0, testKeys);

  const transaction = tx.build();

  utxo = {
    hash: transaction.getId(),
    value: utxoValue,
  };

  return transaction;
};

export const broadcastAndMine = async (txHex: string) => {
  await btcdClient.sendRawTransaction(txHex);
  await btcdClient.generate(1);
};
