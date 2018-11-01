import { expect } from 'chai';
import bip32 from 'bip32';
import bip39 from 'bip39';
import Wallet from '../../../lib/wallet/Wallet';
import Networks from '../../../lib/consts/Networks';
import { OutputType } from '../../../lib/proto/xchangerpc_pb';
import { btcdClient, btcManager } from '../chain/ChainClient.spec';
import Logger from '../../../lib/Logger';
import Database from '../../../lib/db/Database';
import UtxoRepository from '../../../lib/wallet/UtxoRepository';
import WalletRepository from '../../../lib/wallet/WalletRepository';

describe('Wallet', () => {
  before(async () => {
  });

  const derivationPath = 'm/0/0';
  const highestUsedIndex = 0;

  const mnemonic = bip39.generateMnemonic();
  const masterNode = bip32.fromSeed(bip39.mnemonicToSeed(mnemonic));

  const database = new Database(Logger.disabledLogger, ':memory:');
  const walletRepository = new WalletRepository(database.models);
  const utxoRepository = new UtxoRepository(database.models);

  const wallet = new Wallet(
    Logger.disabledLogger,
    walletRepository,
    utxoRepository,
    masterNode,
    Networks.bitcoinRegtest,
    btcdClient,
    derivationPath,
    highestUsedIndex,
  );

  let walletBalance: number;

  before(async () => {
    await btcdClient.connect();
    await database.init();

    // Create the foreign constraint for the "utxos" table
    const walletRepository = new WalletRepository(database.models);
    await walletRepository.addWallet({
      derivationPath,
      highestUsedIndex,
      symbol: 'BTC',
    });
  });

  it('should recognize transactions to its addresses', async () => {
    const addresses: { address: string, amount: number }[] = [];
    let expectedBalance = 0;

    for (let i = 0; i < 5; i += 1) {
      const address = {
        address: await wallet.getNewAddress(OutputType.BECH32),
        amount: i * 10000,
      };

      expectedBalance += address.amount;
      addresses.push(address);
    }

    for (const address of addresses) {
      const tx = btcManager.constructTransaction(address.address, address.amount);
      await btcManager.broadcastAndMine(tx.toHex());
    }

    const balancePromise = new Promise<void>((resolve) => {
      const interval = setInterval(async () => {
        if (await wallet.getBalance() !== 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    await balancePromise;

    expect(await wallet.getBalance()).to.be.equal(expectedBalance);

    walletBalance = expectedBalance;
  });

  it('should spend UTXOs', async () => {
    expect(walletBalance).to.not.be.undefined;

    const destinationAddress = await wallet.getNewAddress(OutputType.BECH32);
    const destinationAmount = walletBalance - 1000;

    const { tx, vout } = await wallet.sendToAddress(destinationAddress, destinationAmount);

    await btcdClient.sendRawTransaction(tx.toHex());
    await btcdClient.generate(1);

    expect(vout).to.be.equal(0);
    expect(await wallet.getBalance()).to.be.equal(destinationAmount);
  });

  after(async () => {
    await btcdClient.disconnect();
  });
});
