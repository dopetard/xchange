import assert from 'assert';
import { BIP32 } from 'bip32';
import { address, Transaction, crypto, Network } from 'bitcoinjs-lib';
import Logger from '../Logger';
import LndClient from '../lightning/LndClient';
import { getHexBuffer, getHexString } from '../Utils';
import { pkRefundSwap } from './Submarine';
import { p2wshOutput, p2shP2wshOutput, p2shOutput, p2pkhOutput, p2wpkhOutput } from './Scripts';
import ChainClient from '../chain/ChainClient';
import Wallet from '../wallet/Wallet';
import { constructClaimTransaction, SwapOutputType } from './Claim';

type BaseSwapDetails = {
  outputType: SwapOutputType;
  redeemScript: Buffer;
};

type SwapDetails = BaseSwapDetails & {
  invoice: string;
  destinationKeys: BIP32;
};

type ReverseSwapDetails = BaseSwapDetails & {
  preimage: string;
  refundKeys: BIP32;
};

type Currency = {
  wallet: Wallet;
  network: Network;
  chainClient: ChainClient;
  lndClient: LndClient;
};

type SwapMaps = {
  swaps: Map<Buffer, SwapDetails>;
  reverseSwaps: Map<Buffer, ReverseSwapDetails>;
};

// TODO: automatically refund swaps
// TODO: verify values
// TODO: one SwapManager for all pairs
// TODO: configurable timeouts
class SwapManager {

  private baseSwaps: SwapMaps;
  private quoteSwaps: SwapMaps;

  private claimPromises: Promise<void>[] = [];

  constructor(private logger: Logger, private baseCurrency: Currency, private quoteCurrency: Currency) {
    this.baseSwaps = this.initCurrencyMap();
    this.quoteSwaps = this.initCurrencyMap();

    this.bindCurrency(baseCurrency, this.baseSwaps);
    this.bindCurrency(quoteCurrency, this.quoteSwaps);
  }

  public stop = async () => {
    await Promise.all(this.claimPromises);
  }

  public createSwap = async (pairId: string, isBuy: boolean, invoice: string, refundPublicKey: Buffer,
    swapOutputType: SwapOutputType): Promise<string> => {

    assert(pairId === 'LTC/BTC');

    const { wallet, network, chainClient, lndClient } = isBuy ? this.baseCurrency : this.quoteCurrency;
    const { swaps } = isBuy ? this.baseSwaps : this.quoteSwaps;

    const { blocks } = await chainClient.getInfo();
    const { paymentHash } = await lndClient.decodePayReq(invoice);

    this.logger.debug(`Creating new Swap on ${chainClient.chainType} with preimage hash: ${paymentHash}`);

    const destinationKeys = wallet.getNewKeys();

    const redeemScript = pkRefundSwap(
      getHexBuffer(paymentHash),
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

  private initCurrencyMap = (): SwapMaps => {
    return {
      swaps: new Map<Buffer, SwapDetails>(),
      reverseSwaps: new Map<Buffer, ReverseSwapDetails>(),
    };
  }
}

export default SwapManager;
export { Currency };
