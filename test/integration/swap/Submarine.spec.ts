// tslint:disable:max-line-length
import { fromBase58 } from 'bip32';
import { crypto, address } from 'bitcoinjs-lib';
import { getHexBuffer } from '../../../lib/Utils';
import { p2shOutput, p2wshOutput, p2shP2wshOutput } from '../../../lib/swap/Scripts';
import { pkRefundSwap } from '../../../lib/swap/Submarine';
import { constructClaimTransaction, SwapOutputType } from '../../../lib/swap/Claim';
import Networks from '../../../lib/consts/Networks';
import { constructTransaction, broadcastAndMine, btcdClient, testAddress, testKeys } from '../chain/BtcdClient.spec';

describe('Submarine Swaps', () => {
  const preimage = getHexBuffer('b5b2dbb1f0663878ecbc20323b58b92c');
  const preimageHash = crypto.sha256(preimage);

  const swapKeys = fromBase58('xprv9xgxR6htMdXUXGipynZp1janNrWNYJxaz2o4tH9fdtZqcF26BX5VB88GSM5KgZHWCyAyb8FZpQik2UET84CHfGWXFMG5zWWjmtDMgqYuo19');

  // Create, send funds to and claim a Submarine Swap
  const executeSwap = async (outputFunction: (scriptHex: Buffer) => Buffer, swapOutputType: SwapOutputType) => {
    const { blocks } = await btcdClient.getInfo();

    const redeemScript = pkRefundSwap(preimageHash, swapKeys.publicKey, testKeys.publicKey, blocks + 1000);
    const swapAddress = address.fromOutputScript(outputFunction(redeemScript), Networks.bitcoin_regtest);

    const transaction = constructTransaction(swapAddress, 10000);
    await broadcastAndMine(transaction.toHex());

    const swapVout = 1;
    const transactionOutput = transaction.outs[swapVout];
    const swapOutput = {
      txHash: transaction.getHash(),
      vout: swapVout,
      type: swapOutputType,
      script: transactionOutput.script,
      value: transactionOutput.value,
    };

    const destinationScript = address.toOutputScript(testAddress, Networks.bitcoin_regtest);
    const claimTransaction = constructClaimTransaction(
      preimage,
      swapKeys,
      swapOutput,
      redeemScript,
      destinationScript,
    );

    await broadcastAndMine(claimTransaction.toHex());
  };

  before(async () => {
    await btcdClient.connect();
  });

  it('should execute a P2WSH Submarine Swap', async () => {
    await executeSwap(p2wshOutput, SwapOutputType.Bech32);
  });

  it('should execute a P2SH Submarine Swap', async () => {
    await executeSwap(p2shOutput, SwapOutputType.Legacy);
  });

  it('should execute a P2SH nested P2WSH Submarine Swap', async () => {
    await executeSwap(p2shP2wshOutput, SwapOutputType.Compatibility);
  });

  after(async () => {
    await btcdClient.disconnect();
  });
});
