import { expect } from 'chai';
import bip32 from 'bip32';
import bip39 from 'bip39';
import Wallet from '../../lib/wallet/Wallet';

describe('Wallet', () => {
  const mnemonic = bip39.generateMnemonic();

  const derivationPath = 'm/0/0';
  const highestIndex = 21;

  const masterNode = bip32.fromSeed(bip39.mnemonicToSeed(mnemonic));
  const wallet = new Wallet(masterNode, derivationPath, highestIndex);

  function getAddressByIndex(index: number) {
    return masterNode.derivePath(`${derivationPath}/${index}`);
  }

  it('should get correct address from index', () => {
    const index = 1;

    expect(wallet.getKeysByIndex(index)).to.be.deep.equal(getAddressByIndex(index));
  });

  it('should get new address', () => {
    const newHighestIndex = highestIndex + 1;

    expect(wallet.getNewKeys()).to.be.deep.equal(getAddressByIndex(newHighestIndex));
    expect(wallet.highestUsedIndex).to.be.equal(newHighestIndex);
  });
});
