import { BIP32 } from 'bip32';
import { Transaction } from 'bitcoinjs-lib';

// TODO: actually store funds and allow sending them
// TODO: store network type and encode addresses here
class Wallet {

  /**
   * Wallet is a hierarchical deterministic wallet for a single currency
   *
   * @param masterNode the master node from which wallets are derived
   * @param derivationPath should be in the format "m/0/<index of the wallet>"
   * @param highestIndex the highest index of a used address in the wallet
   */
  constructor(private masterNode: BIP32, public readonly derivationPath: string, private highestIndex: number) {}

  public get highestUsedIndex() {
    return this.highestIndex;
  }

  public getKeysByIndex = (index: number) => {
    return this.masterNode.derivePath(`${this.derivationPath}/${index}`);
  }

  public getNewKeys = () => {
    this.highestIndex += 1;

    return this.getKeysByIndex(this.highestIndex);
  }

  public sendToAddress = (_address: string, _amount: number): { tx: Transaction, vout: number } => {
    return {
      tx: new Transaction(),
      vout: 0,
    };
  }
}

export default Wallet;
