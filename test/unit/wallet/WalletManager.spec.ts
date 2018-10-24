import { expect } from 'chai';
import { mock } from 'ts-mockito';
import fs from 'fs';
import bip32 from 'bip32';
import bip39 from 'bip39';
import WalletManager from '../../../lib/wallet/WalletManager';
import WalletErrors from '../../../lib/wallet/Errors';
import Networks from '../../../lib/consts/Networks';
import ChainClient from '../../../lib/chain/ChainClient';
import LndClient from '../../../lib/lightning/LndClient';

describe('WalletManager', () => {
  const mnemonic = bip39.generateMnemonic();

  const chainClient = mock(ChainClient);
  const lndClient = mock(LndClient);

  const coins = [
    {
      chainClient,
      lndClient,
      symbol: 'BTC',
      network: Networks.bitcoinRegtest,
    },
    {
      chainClient,
      lndClient,
      symbol: 'LTC',
      network: Networks.litecoinRegtest,
    },
  ];
  const walletPath = 'wallet.dat';

  let walletManager: WalletManager;

  function removeWalletFile() {
    if (fs.existsSync(walletPath)) {
      fs.unlinkSync(walletPath);
    }
  }

  before(() => {
    removeWalletFile();
  });

  it('should not initialize without wallet file', () => {
    expect(() => new WalletManager(coins, walletPath, false)).to.throw(WalletErrors.NOT_INITIALIZED().message);
  });

  it('should initialize a new wallet for each coin', () => {
    walletManager = WalletManager.fromMnemonic(mnemonic, coins, walletPath, false);

    coins.forEach((coin, index) => {
      const wallet = walletManager.wallets.get(coin.symbol);

      expect(wallet).to.not.be.undefined;
      const { derivationPath, highestUsedIndex } = wallet!;

      expect(derivationPath).to.be.equal(`m/0/${index}`);
      expect(highestUsedIndex).to.be.equal(0);
    });
  });

  it('should write wallet to the disk', () => {
    walletManager['writeWallet'](walletPath);

    expect(fs.existsSync(walletPath)).to.be.true;

    const walletInfo = walletManager['loadWallet'](walletPath);
    expect(walletInfo.master).to.be.equal(bip32.fromSeed(bip39.mnemonicToSeed(mnemonic)).toBase58());
    expect(walletInfo.wallets.size).to.be.deep.equal(2);
  });

  it('should read wallet from the disk', () => {
    const compare = new WalletManager(coins, walletPath, false);
    compare['loadWallet'](walletPath);

    expect(compare['walletsInfo']).to.be.deep.equal(walletManager['walletsInfo']);
  });

  it('should not accept invalid mnemonics', () => {
    const invalidMnemonic = 'invalid';

    expect(() => WalletManager.fromMnemonic(invalidMnemonic, [], '')).to.throw(WalletErrors.INVALID_MNEMONIC(invalidMnemonic).message);
  });

  after(() => {
    removeWalletFile();
  });
});
