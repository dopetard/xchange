import fs from 'fs';
import { expect } from 'chai';
import bip39 from 'bip39';
import WalletManager from '../../lib/wallet/WalletManager';
import WalletErrors from '../../lib/wallet/Errors';

describe('WalletManager', () => {
  const mnemonic = bip39.generateMnemonic();
  const coins = [
    'BTC',
    'LTC',
    'DOGE',
  ];
  const walletsFile = 'wallets.dat';

  let walletManager: WalletManager;

  function removeWalletsFile() {
    if (fs.existsSync(walletsFile)) {
      fs.unlinkSync(walletsFile);
    }
  }

  function newWalletManager() {
    return new WalletManager(mnemonic, coins);
  }

  before(() => {
    removeWalletsFile();

    walletManager = newWalletManager();
  });

  it('should initiate a new wallet for each coin', () => {
    coins.forEach((coin, index) => {
      const wallet = walletManager.wallets.get(coin);

      expect(wallet).to.not.be.undefined;

      const { derivationPath, highestUsedIndex } = wallet!;

      expect(derivationPath).to.be.equal(`m/0/${index}`);
      expect(highestUsedIndex).to.be.equal(0);
    });
  });

  it('should write wallets to the disk', () => {
    walletManager['writeWallets'](walletsFile);

    expect(fs.existsSync(walletsFile)).to.be.true;
    expect(walletManager['loadWallets'](walletsFile)).to.be.deep.equal(walletManager['walletsInfo']);
  });

  it('should read wallet from the disk', () => {
    const compare = newWalletManager();
    compare['loadWallets'](walletsFile);

    expect(compare['walletsInfo']).to.be.deep.equal(walletManager['walletsInfo']);
  });

  it('should not accept invalid mnemonics', () => {
    const invalidMnemonic = 'invalid';

    expect(() => new WalletManager(invalidMnemonic, [], '')).to.throw(WalletErrors.INVALID_MNEMONIC(invalidMnemonic).message);
  });

  after(() => {
    removeWalletsFile();
  });
});
