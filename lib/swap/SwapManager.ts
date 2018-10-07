import { address, Network } from 'bitcoinjs-lib';
import Logger from '../Logger';
import BtcdClient from '../chain/BtcdClient';
import LndClient from '../lightning/LndClient';
import WalletManager from '../wallet/WalletManager';
import { getHexString } from '../Utils';
import { pkRefundSwap } from './Submarine';
import { p2wshOutput, p2shP2wshOutput, p2shOutput } from './Scripts';

type Addresses = {
  bech32: string;
  compatibility: string;
  legacy: string;
};

type SwapDetails = {
  privateKey: Buffer,
  redeemScript: string;
  addresses: Addresses;
};

// TODO: support for more currencies
class SwapManager {

  // A map between the rHash and SwapDetail
  private swaps = new Map<string, SwapDetails>();

  constructor(
    private logger: Logger,
    private walletManager: WalletManager,
    private btcdClient: BtcdClient,
    private lndClient: LndClient) {}

  /**
   * Create a Submarine swap
   *
   * @param network network on which the addresses will be used
   * @param invoice the invoice that should be paid
   * @param refundPublicKey the public key of the refund address
   */
  public createSwap = async (network: Network, invoice: string, refundPublicKey: string): Promise<Addresses> => {
    const wallet = this.walletManager.wallets.get('BTC')!;

    const { blocks } = await this.btcdClient.getInfo();
    const { paymentHash } = await this.lndClient.decodePayReq(invoice);

    const keys = wallet.getNewKeys();
    const destinationPublicKey = getHexString(keys.publicKey);

    this.logger.debug(`creating Submarine Swap for rHash: ${paymentHash}`);

    const redeemScript = pkRefundSwap(
      paymentHash,
      destinationPublicKey,
      refundPublicKey,
      blocks + 10,
    );

    const addresses = {
      bech32: this.encodeAddress(
        p2wshOutput(redeemScript),
        network,
      ),
      compatibility: this.encodeAddress(
        p2shP2wshOutput(redeemScript),
        network,
      ),
      legacy: this.encodeAddress(
        p2shOutput(redeemScript),
        network,
      ),
    };

    this.swaps.set(paymentHash, {
      addresses,
      redeemScript,
      privateKey: keys.privateKey,
    });

    await this.btcdClient.loadTxFiler(false, Object.values(addresses), []);

    return addresses;
  }

  private encodeAddress = (outputScript: Buffer, network: Network) => {
    return address.fromOutputScript(
      outputScript,
      network,
    );
  }
}

export default SwapManager;
export { SwapDetails, Addresses };
