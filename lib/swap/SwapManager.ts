import { BIP32 } from 'bip32';
import { address, Transaction, crypto, Network } from 'bitcoinjs-lib';
import Logger from '../Logger';
import LndClient from '../lightning/LndClient';
import { getHexBuffer } from '../Utils';
import { pkRefundSwap } from './Submarine';
import { p2wshOutput, p2shP2wshOutput, p2shOutput, p2pkhOutput } from './Scripts';
import ChainClient from '../chain/ChainClient';
import Wallet from '../wallet/Wallet';
import { constructClaimTransaction, SwapOutput, SwapOutputType } from './Claim';

type Addresses = {
  bech32: string;
  compatibility: string;
  legacy: string;
};

type SwapDetails = {
  keys: BIP32,
  redeemScript: Buffer;
  addresses: Addresses;
};

// TODO: support for more currencies / networks
class SwapManager {

  // A map between the rHash and SwapDetail
  private swaps = new Map<string, SwapDetails>();

  private claimPromises: Promise<void>[] = [];

  constructor(private logger: Logger, private network: Network,
    private wallet: Wallet, private btcdClient: ChainClient, private lndClient: LndClient) {

    this.btcdClient.on('transaction.relevant', (transactionHex) => {
      const transaction = Transaction.fromHex(transactionHex);

      // TODO: make more efficient
      transaction.outs.forEach((output, vout) => {
        const address = this.encodeAddress(output.script);

        this.swaps.forEach((swapDetails, rHash) => {
          const swapAddresses = swapDetails.addresses;

          if (Object.values(swapAddresses).includes(address)) {
            const getSwapOutputType = (): SwapOutputType => {
              switch (address) {
                case swapAddresses.bech32:
                  return SwapOutputType.Bech32;

                case swapAddresses.compatibility:
                  return SwapOutputType.Compatibility;

                default:
                  return SwapOutputType.Legacy;
              }
            };

            this.claimPromises.push(this.claimSwap(rHash, {
              vout,
              value: output.value,
              script: output.script,
              type: getSwapOutputType(),
              txHash: transaction.getHash(),
            }));

            return;
          }
        });
      });
    });
  }

  /**
   * Create a Submarine swap
   *
   * @param invoice the invoice that should be paid
   * @param refundPublicKey the public key of the refund address
   */
  public createSwap = async (invoice: string, refundPublicKey: Buffer): Promise<Addresses> => {
    const { blocks } = await this.btcdClient.getInfo();
    const { paymentHash } = await this.lndClient.decodePayReq(invoice);

    const keys = this.wallet.getNewKeys();

    this.logger.debug(`creating Submarine Swap for rHash: ${paymentHash}`);

    const redeemScript = pkRefundSwap(
      getHexBuffer(paymentHash),
      keys.publicKey,
      refundPublicKey,
      blocks + 10,
    );

    const addresses = {
      bech32: this.encodeAddress(
        p2wshOutput(redeemScript),
      ),
      compatibility: this.encodeAddress(
        p2shP2wshOutput(redeemScript),
      ),
      legacy: this.encodeAddress(
        p2shOutput(redeemScript),
      ),
    };

    this.swaps.set(paymentHash, {
      keys,
      addresses,
      redeemScript,
    });

    await this.btcdClient.loadTxFiler(false, Object.values(addresses), []);

    return addresses;
  }

  private claimSwap = async (rHash: string, utxo: SwapOutput) => {
    // TODO: get preimage
    const preimage = Buffer.from('');

    const destinationKeys = this.wallet.getNewKeys();
    const destinationAddess = p2pkhOutput(
      crypto.hash160(destinationKeys.publicKey),
    );

    const { keys, redeemScript } = this.swaps.get(rHash)!;

    const tx = constructClaimTransaction(preimage, keys, utxo, redeemScript, destinationAddess);
    await this.btcdClient.sendRawTransaction(tx.toHex());

    this.swaps.delete(rHash);
  }

  private encodeAddress = (outputScript: Buffer) => {
    return address.fromOutputScript(
      outputScript,
      this.network,
    );
  }
}

export default SwapManager;
export { SwapDetails, Addresses };
