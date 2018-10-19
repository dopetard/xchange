import assert from 'assert';
import { BIP32 } from 'bip32';
import { address, Transaction, crypto, Network } from 'bitcoinjs-lib';
import Logger from '../Logger';
import { getHexBuffer, getPairId, getHexString } from '../Utils';
import { pkRefundSwap } from './Submarine';
import { p2wshOutput, p2shP2wshOutput, p2shOutput, p2wpkhOutput } from './Scripts';
import { constructClaimTransaction, SwapOutputType, SwapOutput } from './Claim';
import { Pair, Currency } from '../consts/Types';
import Errors from './Errors';

type BaseSwapDetails = {
  redeemScript: Buffer;
};

type SwapDetails = BaseSwapDetails & {
  invoice: string;
  destinationKeys: BIP32;
  outputType: SwapOutputType;
};

type ReverseSwapDetails = BaseSwapDetails & {
  refundKeys: BIP32;
  output: SwapOutput;
};

type SwapMaps = {
  // A map between an output script and the SwapDetails
  swaps: Map<Buffer, SwapDetails>;

  // A map between an invoice and the ReverseSwapDetails
  reverseSwaps: Map<string, ReverseSwapDetails>;
};

// TODO: configurable timeouts
// TODO: verify values and amounts
// TODO: fees for the Xchange to collect
// TODO: automatically refund failed swaps
class SwapManager {

  private currencies = new Map<string, Currency & SwapMaps>();
  private pairMap = new Map<string, { base: string, quote: string }>();

  private claimPromises: Promise<void>[] = [];

  constructor(private logger: Logger, private pairs: Pair[]) {
    this.pairs.forEach((pair) => {
      const entry = {
        base: pair.base.symbol,
        quote: pair.quote.symbol,
      };

      this.pairMap.set(getPairId(pair), entry);

      this.addToCurrencies(pair.base);
      this.addToCurrencies(pair.quote);
    });
  }

  public stop = async () => {
    await Promise.all(this.claimPromises);
  }

  /**
   * Creates a new Swap
   * @param pairId pair of the Swap
   * @param isBuy whether the order is a buy one
   * @param invoice the invoice that should be paid
   * @param refundPublicKey the public key for the refund
   * @param swapOutputType what kind of adress should be returned
   *
   * @returns an onchain address
   */
  public createSwap = async (pairId: string, isBuy: boolean, invoice: string, refundPublicKey: Buffer, swapOutputType: SwapOutputType) => {
    const { symbol, wallet, network, chainClient, lndClient, swaps } = this.getCurrency(pairId, isBuy);

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

    const encodeFuntion = this.getEncodeFunction(swapOutputType);
    const output = encodeFuntion(redeemScript);

    const address = this.encodeAddress(
      output,
      network,
    );

    swaps.set(output, {
      invoice,
      redeemScript,
      destinationKeys,
      outputType: swapOutputType,
    });

    await chainClient.loadTxFiler(false, [address], []);

    return address;
  }

  /**
   * Creates a new reverse Swap
   * @param pairId pair of the Swap
   * @param isBuy whether the order is a buy one
   * @param destinationPublicKey the public key for the claiming
   * @param amount the amount of the invoice
   *
   * @returns a Lightning invoice and the hash of a onchain transaction
   */
  public createReverseSwap = async (pairId: string, isBuy: boolean, destinationPublicKey: Buffer, amount: number):
    Promise<{ invoice: string, txHash: string }> => {

    const { symbol, wallet, network, chainClient, lndClient, reverseSwaps } = this.getCurrency(pairId, isBuy);

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
    const address = this.encodeAddress(
      output,
      network,
    );

    const { tx, vout } = wallet.sendToAddress(address, amount);

    reverseSwaps.set(paymentRequest, {
      redeemScript,
      refundKeys,
      output: {
        vout,
        txHash: tx.getHash(),
        type: SwapOutputType.Bech32,
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
        const swapDetails = maps.swaps.get(output.script);

        if (swapDetails) {
          maps.swaps.delete(output.script);
          this.claimPromises.push(this.claimSwap(
            currency,
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

  private claimSwap = async (currency: Currency, txHash: Buffer, swapScript: Buffer, swapValue: number, vout: number, details: SwapDetails) => {
    const { chainClient, lndClient } = currency;

    this.logger.info(`Claiming swap output ${vout} of ${chainClient.chainType} transaction ${txHash}`);
    assert(details.invoice);

    const payInvoice = await lndClient.payInvoice(details.invoice!);

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

    await currency.chainClient.sendRawTransaction(claimTx.toHex());
  }

  private getEncodeFunction = (outputType: SwapOutputType) => {
    switch (outputType) {
      case SwapOutputType.Bech32:
        return p2wshOutput;

      case SwapOutputType.Compatibility:
        return p2shP2wshOutput;

      case SwapOutputType.Legacy:
        return p2shOutput;
    }
  }

  private encodeAddress = (outputScript: Buffer, network: Network): string => {
    return address.fromOutputScript(
      outputScript,
      network,
    );
  }

  private getCurrency = (pairId: string, isBuy: boolean) => {
    const pair = this.pairMap.get(pairId);

    if (!pair) {
      throw Errors.PAIR_NOT_FOUND(pairId);
    }

    return isBuy ? this.currencies.get(pair.quote)! : this.currencies.get(pair.base)!;
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
      swaps: new Map<Buffer, SwapDetails>(),
      reverseSwaps: new Map<string, ReverseSwapDetails>(),
    };
  }
}

export default SwapManager;
