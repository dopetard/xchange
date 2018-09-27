import { address, networks } from 'bitcoinjs-lib';
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
  redeemScript: string;
  addresses: Addresses;
};

// TODO: support for more currencies
class SwapManager {
  constructor(
    private logger: Logger,
    private walletManager: WalletManager,
    private btcdClient: BtcdClient,
    private lndClient: LndClient) {}

  /**
   * Create a Submarine swap
   *
   * @param invoice the invoice that should be paid
   * @param refundPublicKey the public key of the refund address
   */
  public createSwap = async (invoice: string, refundPublicKey: string): Promise<SwapDetails> => {
    const wallet = this.walletManager.wallets.get('BTC')!;

    const { blocks } = await this.btcdClient.getInfo();
    const { paymentHash } = await this.lndClient.decodePayReq(invoice);
    const destinationPublicKey = getHexString(wallet.getNewAddress().publicKey);

    this.logger.debug(`creating Submarine Swap for ${paymentHash}`);

    const redeemScript = pkRefundSwap(
      paymentHash,
      destinationPublicKey,
      refundPublicKey,
      blocks + 10,
    );

    return {
      redeemScript,
      addresses: {
        bech32: this.encodeAddress(
          p2wshOutput(redeemScript),
        ),
        compatibility: this.encodeAddress(
          p2shP2wshOutput(redeemScript),
        ),
        legacy: this.encodeAddress(
          p2shOutput(redeemScript),
        ),
      },
    };
  }

  private encodeAddress = (outputScript: Buffer) => {
    return address.fromOutputScript(
      outputScript,
      networks.testnet,
    );
  }
}

export default SwapManager;
export { SwapDetails, Addresses };
