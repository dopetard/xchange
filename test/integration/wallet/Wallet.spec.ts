import { expect } from 'chai';
import bip32 from 'bip32';
import bip39 from 'bip39';
import Wallet from '../../../lib/wallet/Wallet';
import Networks from '../../../lib/consts/Networks';
import { OutputType } from '../../../lib/consts/Enums';
import { btcdClient, btcManager } from '../chain/ChainClient.spec';

describe('Wallet', () => {
  before(async () => {
    await btcdClient.connect();
  });

  const mnemonic = bip39.generateMnemonic();
  const masterNode = bip32.fromSeed(bip39.mnemonicToSeed(mnemonic));

  const wallet = new Wallet(
    masterNode,
    'm/0/0',
    0,
    Networks.bitcoinRegtest,
    btcdClient,
  );

  it('should recognize transactions to its addresses', async () => {
    const addresses: { address: string, amount: number }[] = [];
    let expectedBalance = 0;

    for (let i = 0; i < 5; i += 1) {
      const address = {
        address: await wallet.getNewAddress(OutputType.Bech32),
        amount: i * 10000,
      };

      expectedBalance += address.amount;
      addresses.push(address);
    }

    for (const address of addresses) {
      const tx = btcManager.constructTransaction(address.address, address.amount);
      await btcManager.broadcastAndMine(tx.toHex());
    }

    const balancePromise = new Promise<void>((resolve, reject) => {
      let iteration = 0;

      const interval = setInterval(() => {
        if (wallet.getBalance() !== 0) {
          clearInterval(interval);
          resolve();
        }

        iteration += 1;

        if (iteration > 20) {
          reject('Wallet did not recognize transactions');
        }
      }, 100);
    });

    await balancePromise;

    expect(wallet.getBalance()).to.be.equal(expectedBalance);
  }).timeout(5000);

  after(async () => {
    await btcdClient.disconnect();
  });
});
