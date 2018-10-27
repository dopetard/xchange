import assert from 'assert';
import { BIP32 } from 'bip32';
import { Transaction, crypto } from 'bitcoinjs-lib';
import Logger from '../Logger';
import { getHexBuffer, getPairId, getHexString, getScriptHashEncodeFunction } from '../Utils';
import { pkRefundSwap } from './Submarine';
import { p2wshOutput, p2wpkhOutput } from './Scripts';
import { constructClaimTransaction } from './Claim';
import { TransactionOutput } from '../consts/Types';
import Errors from './Errors';
import { OutputType } from '../consts/Enums';
import { Currency } from '../wallet/Wallet';
import WalletManager from '../wallet/WalletManager';
import { OrderSide } from '../proto/xchangerpc_pb';
import LndClient from 'lib/lightning/LndClient';

type BaseSwapDetails = {
  redeemScript: Buffer;
};

type SwapDetails = BaseSwapDetails & {
  lndClient: LndClient;
  invoice: string;
  destinationKeys: BIP32;
  outputType: OutputType;
};

type ReverseSwapDetails = BaseSwapDetails & {
  refundKeys: BIP32;
  output: TransactionOutput;
};

type Pair = {
  quote: Currency;
  base: Currency;
};

type SwapMaps = {
  // A map between an output script and the SwapDetails
  swaps: Map<string, SwapDetails>;

  // A map between an invoice and the ReverseSwapDetails
  reverseSwaps: Map<string, ReverseSwapDetails>;
};

// TODO: configurable timeouts
// TODO: verify values and amounts
// TODO: fees for the Xchange to collect
// TODO: automatically refund failed swaps
class SwapManager {
  private currencies = new Map<string, Currency & SwapMaps>();
  private pairMap = new Map<string, { quote: string, base: string }>();

  private claimPromises: Promise<void>[] = [];

  constructor(private logger: Logger, private walletManager: WalletManager, private pairs: Pair[]) {
    this.pairs.forEach((pair) => {
      const entry = {
        quote: pair.quote.symbol,
        base: pair.base.symbol,
      };

      this.pairMap.set(getPairId(pair.quote.symbol, pair.base.symbol), entry);

      this.addToCurrencies(pair.base);
      this.addToCurrencies(pair.quote);
    });
  }

  public stop = async () => {
    await Promise.all(this.claimPromises);
  }

  /**
   * Creates a new Swap from the chain to Lightning
   *
   * @param pairId pair of the Swap
   * @param orderSide whether the order is a buy or sell one
   * @param invoice the invoice that should be paid
   * @param refundPublicKey the public key for the refund
   * @param outputType what kind of adress should be returned
   *
   * @returns an onchain address
   */
  public createSwap = async (pairId: string, orderSide: OrderSide, invoice: string, refundPublicKey: Buffer, outputType: OutputType) => {
    const { symbol, wallet, chainClient, lndClient, swaps } = this.getCurrency(pairId, orderSide);

    const { blocks } = await chainClient.getInfo();
    const { paymentHash } = await lndClient.decodePayReq(invoice);

    this.logger.debug(`Creating new Swap on ${symbol} with preimage hash: ${paymentHash}`);

    const destinationKeys = wallet.getNewKeys();

    const redeemScript = pkRefundSwap(
      Buffer.from(paymentHash),
      destinationKeys.publicKey,
      refundPublicKey,
      blocks + 10,
    );

    const encodeFunction = getScriptHashEncodeFunction(outputType);
    const output = encodeFunction(redeemScript);
    const address = wallet.encodeAddress(output);

    swaps.set(getHexString(output), {
      lndClient,
      invoice,
      outputType,
      redeemScript,
      destinationKeys,
    });

    await chainClient.loadTxFiler(false, [address], []);

    return address;
  }

  /**
   * Creates a new reverse Swap from Lightning to the chain
   *
   * @param pairId pair of the Swap
   * @param orderSide whether the order is a buy or sell one
   * @param destinationPublicKey the public key for the claiming
   * @param amount the amount of the invoice
   *
   * @returns a Lightning invoice and the hash of a onchain transaction
   */
  public createReverseSwap = async (pairId: string, orderSide: OrderSide, destinationPublicKey: Buffer, amount: number):
    Promise<{ invoice: string, txHash: string }> => {

    const { symbol, wallet, chainClient, lndClient, reverseSwaps } = this.getCurrency(pairId, orderSide);

    this.logger.debug(`Creating new reverse Swap on ${symbol} for public key: ${getHexString(destinationPublicKey)}`);

    const { blocks } = await chainClient.getInfo();
    const { rHash, paymentRequest } = await lndClient.addInvoice(amount);

    const refundKeys = wallet.getNewKeys();
    const redeemScript = pkRefundSwap(
      Buffer.from(rHash as string),
      destinationPublicKey,
      refundKeys.publicKey,
      blocks + 10,
    );

    const output = p2wshOutput(redeemScript);
    const address = wallet.encodeAddress(output);

    const { tx, vout } = await wallet.sendToAddress(address, amount);

    reverseSwaps.set(paymentRequest, {
      redeemScript,
      refundKeys,
      output: {
        vout,
        txHash: tx.getHash(),
        type: OutputType.Bech32,
        script: output,
        value: amount,
      },
    });

    return {
      invoice: paymentRequest,
      txHash: tx.getId(),
    };
  }

  private bindCurrency = (currency: Currency, maps: SwapMaps) => {
    currency.chainClient.on('transaction.relevant', (transactionHex: string) => {
      const transaction = Transaction.fromHex(transactionHex);

      transaction.outs.forEach((output, vout) => {
        const hexScript = getHexString(output.script);
        const swapDetails = maps.swaps.get(hexScript);

        if (swapDetails) {
          maps.swaps.delete(hexScript);
          this.claimPromises.push(this.claimSwap(
            currency,
            swapDetails.lndClient,
            transaction.getHash(),
            output.script,
            output.value,
            vout,
            swapDetails,
          ));
        }
      });
    });
  }

  private claimSwap = async (currency: Currency, lndClient: LndClient,
    txHash: Buffer, swapScript: Buffer, swapValue: number, vout: number, details: SwapDetails) => {

    const { symbol, chainClient } = currency;

    this.logger.info(`Claiming swap output ${vout} of ${symbol} transaction ${txHash}`);
    assert(details.invoice);

    const payInvoice = await lndClient.payInvoice(details.invoice);

    if (payInvoice.paymentError !== '') {
      // TODO: retry and show error to the user
      this.logger.warn(`Could not pay invoice ${details.invoice}: ${payInvoice.paymentError}`);
      return;
    }

    const destinationScript = p2wpkhOutput(crypto.hash160(details.destinationKeys.publicKey));

    const claimTx = constructClaimTransaction(
      getHexBuffer(payInvoice.paymentPreimage as string),
      details.destinationKeys,
      destinationScript,
      {
        txHash,
        vout,
        type: details.outputType,
        script: swapScript,
        value: swapValue,
      },
      details.redeemScript,
    );

    await chainClient.sendRawTransaction(claimTx.toHex());
  }

  private getCurrency = (pairId: string, orderSide: OrderSide) => {
    const pair = this.pairMap.get(pairId);

    if (!pair) {
      throw Errors.PAIR_NOT_FOUND(pairId);
    }

    const symbol = orderSide === OrderSide.BUY ? pair.quote : pair.base;

    return {
      ...this.currencies.get(symbol)!,
      wallet: this.walletManager.wallets.get(symbol)!,
    };
  }

  private addToCurrencies = (currency: Currency) => {
    if (!this.currencies.get(currency.symbol)) {
      const swapMaps = this.initCurrencyMap();

      this.currencies.set(currency.symbol, {
        ...currency,
        ...swapMaps,
      });

      this.bindCurrency(currency, swapMaps);
    }
  }

  private initCurrencyMap = (): SwapMaps => {
    return {
      swaps: new Map<string, SwapDetails>(),
      reverseSwaps: new Map<string, ReverseSwapDetails>(),
    };
  }
}

export default SwapManager;
export { Pair };
