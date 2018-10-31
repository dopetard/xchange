import { expect } from 'chai';
import Logger from '../../../lib/Logger';
import path from 'path';
import { ECPair, TransactionBuilder, Transaction, Network } from 'bitcoinjs-lib';
import ChainClient from '../../../lib/chain/ChainClient';
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

    btcManager = new UtxoManager(btcdClient, Networks.bitcoinRegtest, {
      hash: transaction.getId(),
      value: transaction.outs[0].value,
    });
  });

  it('LtcdClient should connect', async () => {
    await ltcdClient.connect();

    const blockHash = await ltcdClient.generate(1);

    const block = await ltcdClient.getBlock(blockHash[0]);
    const rawTransaction = await ltcdClient.getRawTransaction(block.tx[0]);
    const transaction = Transaction.fromHex(rawTransaction);

    ltcManager = new UtxoManager(ltcdClient, Networks.litecoinRegtest, {
      hash: transaction.getId(),
      value: transaction.outs[0].value,
    });
  });

  it('should update address subscriptions', async () => {
    await btcdClient.loadTxFiler(true, [btcAddress], []);
  });

  it('should emit an event when a transaction is sent to relevant address', async () => {
    const transaction = await btcManager.constructTransaction(btcAddress, 1);
    const txHex = transaction.toHex();

    let eventReceived = false;

    btcdClient.on('transaction.relevant', (transactionHex) => {
      if (transactionHex === txHex) {
        eventReceived = true;
      }
    });

    await btcManager.broadcastAndMine(txHex);

    expect(eventReceived).to.be.true;
  });

  after(async () => {
    await Promise.all([
      btcdClient.disconnect(),
      ltcdClient.disconnect(),
    ]);
  });
});

type Utxo = {
  hash: string;
  value: number;
};

class UtxoManager {
  private keys: ECPair;

  constructor(private chainClient: ChainClient, private network: Network, private utxo: Utxo) {
    this.keys = network === Networks.bitcoinRegtest ? btcKeys : ltcKeys;
  }

  public constructTransaction = (destinationAddress: string, value: number): Transaction => {
    const tx = new TransactionBuilder(this.network);

    // Value of the new UTXO
    const utxoValue = (this.utxo.value - value) - 500;

    tx.addInput(this.utxo.hash, 0);
    tx.addOutput(btcAddress, utxoValue);

    tx.addOutput(destinationAddress, value);

    tx.sign(0, this.keys);

    const transaction = tx.build();

    this.utxo = {
      hash: transaction.getId(),
      value: utxoValue,
    };

    return transaction;
  }

  public broadcastAndMine = async (txHex: string) => {
    await this.chainClient.sendRawTransaction(txHex);
    await this.chainClient.generate(1);
  }
}

export const btcKeys = ECPair.fromWIF('cQ4crx5qPv7NDdj41ehumfB9f89zyWdggy8JnNDjKVQwsLswahd4', Networks.bitcoinRegtest);
export const btcAddress = 'msRY4KpAJ8o9da1YEASy1j2ACnuzh4SyFs';

export const ltcKeys = ECPair.fromWIF('cPnCzwHtVipcX7hb72mkkMMf4MSrknHbRnff2LDutSB8AxvxLaby', Networks.litecoinRegtest);
export const ltcAddress = 'mysNm7METD1JffsC4E1ZW7EcPapmVm9AK4';

const host = process.platform === 'win32' ? '192.168.99.100' : 'localhost';

export const btcdClient = new ChainClient(Logger.disabledLogger, {
  host,
  port: 18334,
  rpcuser: 'user',
  rpcpass: 'user',
  certpath: path.join('docker', 'data', 'rpc.cert'),
}, 'BTC');

export const ltcdClient = new ChainClient(Logger.disabledLogger, {
  host,
  port: 19334,
  rpcpass: 'user',
  rpcuser: 'user',
  certpath: path.join('docker', 'data', 'rpc.cert'),
}, 'LTC');

export let btcManager: UtxoManager;
export let ltcManager: UtxoManager;
