import fs from 'fs';
import bip32, { BIP32 } from 'bip32';
import bip39 from 'bip39';
import exitHook from 'exit-hook';
import Errors from './Errors';
import Wallet from './Wallet';
import { splitDerivationPath } from '../Utils';

type WalletInfo = {
  coin: string;
  derivationPath: string;
  highestUsedIndex: number;
};

class WalletManager {
  public wallets = new Map<string, Wallet>();

  private walletsInfo: Map<string, WalletInfo>;
  private masterNode: BIP32;

  private static readonly derivationPath = 'm/0';

  /**
   * WalletManager initiates multiple HD wallets and takes care of writing them to and reading them from the disk when exiting
   *
   * @param mnemonic master seed from which wallets are derived
   * @param coins for which UTXO based coins a wallet should be generated
   * @param walletsFile where information about the wallets should be stored; not defining results in no file being written and read
   */
  constructor(mnemonic: string, coins: string[], walletsFile?: string) {
    if (!bip39.validateMnemonic(mnemonic)) throw(Errors.INVALID_MNEMONIC(mnemonic));

    this.masterNode = bip32.fromSeed(bip39.mnemonicToSeed(mnemonic));

    this.walletsInfo = this.loadWallets(walletsFile);

    coins.forEach((coin) => {
      let walletInfo = this.walletsInfo.get(coin);

      // Generate new wallet information if it doesn't exist
      if (!walletInfo) {
        walletInfo = {
          coin,
          derivationPath: `${WalletManager.derivationPath}/${this.getHighestDepthIndex(2) + 1}`,
          highestUsedIndex: 0,
        };

        this.walletsInfo.set(coin, walletInfo);
      }

      this.wallets.set(coin, new Wallet(this.masterNode, walletInfo.derivationPath, walletInfo.highestUsedIndex));
    });

    if (walletsFile) {
      exitHook(() => {
        this.writeWallets(walletsFile);
      });
    }
  }

  private writeWallets = (filename: string) => {
    fs.writeFileSync(filename, JSON.stringify(Array.from(this.walletsInfo.entries())));
  }

  private loadWallets = (filename?: string): Map<string, WalletInfo> => {
    if (filename && fs.existsSync(filename)) {
      const rawWallets = fs.readFileSync(filename, 'utf-8');
      return new Map<string, WalletInfo>(JSON.parse(rawWallets));
    }

    return new Map<string, WalletInfo>();
  }

  private getHighestDepthIndex = (depth: number): number => {
    if (depth === 0) {
      throw(Errors.INVALID_DEPTH_INDEX(depth));
    }

    let highestIndex = -1;

    this.walletsInfo.forEach((info) => {
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
