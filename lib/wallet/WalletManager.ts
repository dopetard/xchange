import fs from 'fs';
import bip32 from 'bip32';
import bip39 from 'bip39';
import exitHook from 'exit-hook';
import Errors from './Errors';
import Wallet, { Currency } from './Wallet';
import { splitDerivationPath } from '../Utils';
import { Network } from 'bitcoinjs-lib';

type WalletInfo = {
  derivationPath: string;
  network: Network;
  highestUsedIndex: number;
};

type WalletFile = {
  // Base58 encoded master node
  master: string;
  wallets: Map<string, WalletInfo>;
};

// TODO: recovery with existing mnemonic
class WalletManager {
  public wallets = new Map<string, Wallet>();

  private masterNode: string;

  // TODO: support for BIP44
  private static readonly derivationPath = 'm/0';

  /**
   * WalletManager initiates multiple HD wallets and takes care of writing them to and reading them from the disk when exiting
   *
   * @param coins for which UTXO based coins a wallet should be generated
   * @param walletPath where information about the wallets should be stored
   * @param writeOnExit whether the wallet should be written to the disk when exiting
   */
  constructor(coins: Currency[], walletPath: string, writeOnExit = true) {
    const walletFile = this.loadWallet(walletPath);

    this.masterNode = walletFile.master;
    const walletsInfo = walletFile.wallets;

    coins.forEach((coin) => {
      let walletInfo = walletsInfo.get(coin.symbol);

      // Generate new sub wallet information if it doesn't exist
      if (!walletInfo) {
        walletInfo = {
          highestUsedIndex: 0,
          network: coin.network,
          derivationPath: `${WalletManager.derivationPath}/${this.getHighestDepthIndex(2) + 1}`,
        };
      }

      this.wallets.set(coin.symbol, new Wallet(
        bip32.fromBase58(this.masterNode),
        walletInfo.derivationPath,
        walletInfo.highestUsedIndex,
        walletInfo.network,
        coin.chainClient,
      ));
    });

    if (writeOnExit) {
      exitHook(() => {
        this.writeWallet(walletPath);
      });
    }
  }

  /**
   * Initiates a new WalletManager with a mnemonic
   */
  public static fromMnemonic = (mnemonic: string, coins: Currency[], walletPath: string, writeOnExit = true) => {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw(Errors.INVALID_MNEMONIC(mnemonic));
    }

    WalletManager.writeWalletFile(walletPath, {
      master: bip32.fromSeed(bip39.mnemonicToSeed(mnemonic)).toBase58(),
      wallets: new Map<string, WalletInfo>(),
    });

    return new WalletManager(coins, walletPath, writeOnExit);
  }

  private static writeWalletFile = (filename: string, walletFile: WalletFile) => {
    fs.writeFileSync(filename, JSON.stringify({
      master: walletFile.master,
      wallets: Array.from(walletFile.wallets.entries()),
    }));
  }

  private writeWallet = (filename: string) => {
    const walletsInfo = new Map<string, WalletInfo>();

    this.wallets.forEach((wallet, coin) => {
      walletsInfo.set(coin, {
        derivationPath: wallet.derivationPath,
        highestUsedIndex: wallet.highestUsedIndex,
        network: wallet.network,
      });
    });

    WalletManager.writeWalletFile(filename, {
      master: this.masterNode,
      wallets: walletsInfo,
    });
  }

  private loadWallet = (filename: string): WalletFile => {
    if (fs.existsSync(filename)) {
      const rawWalletFile = fs.readFileSync(filename, 'utf-8');
      const walletFile = JSON.parse(rawWalletFile);

      return {
        master: walletFile.master,
        wallets: new Map<string, WalletInfo>(walletFile.wallets),
      };
    }

    throw(Errors.NOT_INITIALIZED());
  }

  private getHighestDepthIndex = (depth: number): number => {
    if (depth === 0) {
      throw(Errors.INVALID_DEPTH_INDEX(depth));
    }

    let highestIndex = -1;

    this.wallets.forEach((info) => {
      const split = splitDerivationPath(info.derivationPath);
      const index = split.sub[depth - 1];

      if (index > highestIndex) {
        highestIndex = index;
      }
    });

    return highestIndex;
  }
}

export default WalletManager;
