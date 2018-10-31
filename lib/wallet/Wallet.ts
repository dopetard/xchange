import { BIP32 } from 'bip32';
import FastPriorityQueue from 'fastpriorityqueue';
import { Transaction, Network, address, crypto, TransactionBuilder, ECPair } from 'bitcoinjs-lib';
import ChainClient from '../chain/ChainClient';
import { OutputType } from '../proto/xchangerpc_pb';
import { TransactionOutput } from '../consts/Types';
import { getPubKeyHashEncodeFuntion, getHexString } from '../Utils';
import Errors from './Errors';
import LndClient from '../lightning/LndClient';
import Logger from 'lib/Logger';

type UTXO = TransactionOutput & {
  keys: BIP32;
};

type Currency = {
  symbol: string;
  network: Network;
  chainClient: ChainClient;
  lndClient: LndClient;
};

// TODO: wait for funds being confirmed
// TODO: fix coinbase transactions not being recognised
// TODO: more advanced UTXO management
// TODO: save UTXOs to disk
// TODO: multiple transaction to same output
class Wallet {

  private relevantOutputs = new Map<string, { keys: BIP32, type: OutputType }>();

  private utxos = new FastPriorityQueue(Wallet.getUTXOComparator());

  /**
   * Wallet is a hierarchical deterministic wallet for a single currency
   *
   * @param masterNode the master node from which wallets are derived
   * @param derivationPath should be in the format "m/0/<index of the wallet>"
   * @param network the network of the wallet
   * @param chainClient the ChainClient for the network
   * @param highestIndex the highest index of a used address in the wallet
   */
  constructor(
    private logger: Logger,
    private masterNode: BIP32,
    public readonly derivationPath: string,
    private highestIndex: number,
    public readonly network: Network,
    private chainClient: ChainClient) {

    this.chainClient.on('transaction.relevant', (txHex) => {
      const transaction = Transaction.fromHex(txHex);

      transaction.outs.forEach((output, vout) => {
        const hexScript = getHexString(output.script);
        const outputInfo = this.relevantOutputs.get(hexScript);

        if (outputInfo) {
          this.logger.debug(`Found UTXO of ${chainClient.symbol} wallet: ${transaction.getId()}:${vout} with value ${output.value}`);

          this.relevantOutputs.delete(hexScript);
          this.utxos.add({
            vout,
            txHash: transaction.getHash(),
            ...output,
            ...outputInfo,
          });
        }
      });
    });
  }

  private static getUTXOComparator = () => {
    return (a: UTXO, b: UTXO) => {
      if (a.value !== b.value) {
        return a.value > b.value;
      } else {
        // TODO: prefer spending one OutputType over the other
        return true;
      }
    };
  }

  public get highestUsedIndex() {
    return this.highestIndex;
  }

  /**
   * Gets a specific pair of keys
   *
   * @param index index of the keys to get
   */
  public getKeysByIndex = (index: number) => {
    return this.masterNode.derivePath(`${this.derivationPath}/${index}`);
  }

  /**
   * Gets a new pair of keys
   */
  public getNewKeys = () => {
    this.highestIndex += 1;

    return this.getKeysByIndex(this.highestIndex);
  }

  /**
   * Gets a new address
   *
   * @param type ouput type of the address
   */
  public getNewAddress = async (type: OutputType) => {
    const keys = this.getNewKeys();

    const encodeFunction = getPubKeyHashEncodeFuntion(type);
    const output = encodeFunction(crypto.hash160(keys.publicKey));
    const address = this.encodeAddress(output);

    await this.listenToOutput(output, keys, type, address);

    return address;
  }

  /**
   * Encodes an address
   *
   * @param outputScript the output script to encode
   */
  public encodeAddress = (outputScript: Buffer) => {
    return address.fromOutputScript(
      outputScript,
      this.network,
    );
  }

  /**
   * Add an output that can be spent by the wallet
   *
   * @param output a P2WPKH, P2SH nested P2WPKH or P2PKH ouput
   */
  public listenToOutput = async (output: Buffer, keys: BIP32, type: OutputType, address?: string) => {
    this.relevantOutputs.set(getHexString(output), { keys, type });

    const chainAddress = address ? address : this.encodeAddress(output);
    await this.chainClient.loadTxFiler(false, [chainAddress], []);
  }

  /**
   * Get the balance of the wallet
   */
  public getBalance = () => {
    let balance = 0;

    this.utxos.forEach((utxo) => {
      balance += utxo.value;
    });

    return balance;
  }

  // TODO: fee estimation
  // TODO: compatibility for nested Segwit addresses
  /** Sends a specific amount of funds to and address
   *
   * @param address address to which funds should be sent
   * @param amount how mush should be sent
   *
   * @returns the transaction itself and the vout of the addres
   */
  public sendToAddress = async (address: string, amount: number): Promise<{ tx: Transaction, vout: number }> => {
    let missingAmount = amount + 1000;
    const toSpend: UTXO[] = [];

    // Accumulate UTXO to spend
    this.utxos.forEach((utxo) => {
      if ((missingAmount) >= 0) {
        missingAmount -= utxo.value;
        toSpend.push(utxo);
      }
    });

    // Throw an error if the wallet doesn't have enough funds
    if (missingAmount > 0) {
      throw Errors.NOT_ENOUGH_FUNDS(amount);
    }

    // Remove the UTXOs that are going to be spent from the UTXOs of the wallet
    this.utxos.removeMany((utxo: UTXO) => {
      return toSpend.includes(utxo);
    });

    const builder = new TransactionBuilder(this.network);

    // Add the UTXOs from before as inputs
    toSpend.forEach((utxo) => {
      if (utxo.type !== OutputType.LEGACY) {
        builder.addInput(utxo.txHash, utxo.vout, undefined, utxo.script);
      } else {
        builder.addInput(utxo.txHash, utxo.vout);
      }
    });

    // Add the requested ouput to the transaction
    builder.addOutput(address, amount);

    // If there is anything left from the value of the UTXOs send it to a new change address
    if (missingAmount !== 0) {
      builder.addOutput(await this.getNewAddress(OutputType.BECH32), missingAmount * -1);
    }

    // Sign the transaction
    toSpend.forEach((utxo, index) => {
      const keys = ECPair.fromPrivateKey(utxo.keys.privateKey, { network: this.network });

      if (utxo.type !== OutputType.LEGACY) {
        builder.sign(index, keys, undefined, undefined, utxo.value);
      } else {
        builder.sign(index, keys);
      }
    });

    return {
      tx: builder.build(),
      vout: 0,
    };
  }
}

export default Wallet;
export { Currency };
