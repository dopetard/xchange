// tslint:disable:max-line-length
import { fromBase58 } from 'bip32';
import { crypto, address } from 'bitcoinjs-lib';
import { getHexBuffer } from '../../../lib/Utils';
import { p2shOutput, p2wshOutput, p2shP2wshOutput } from '../../../lib/swap/Scripts';
import { pkRefundSwap } from '../../../lib/swap/Submarine';
import { constructClaimTransaction } from '../../../lib/swap/Claim';
import Networks from '../../../lib/consts/Networks';
import { btcManager, btcdClient, btcKeys, btcAddress } from '../chain/ChainClient.spec';
import { OutputType } from '../../../lib/proto/xchangerpc_pb';

describe('Submarine Swaps', () => {
  const preimage = getHexBuffer('b5b2dbb1f0663878ecbc20323b58b92c');
  const preimageHash = crypto.sha256(preimage);

  const swapKeys = fromBase58('xprv9xgxR6htMdXUXGipynZp1janNrWNYJxaz2o4tH9fdtZqcF26BX5VB88GSM5KgZHWCyAyb8FZpQik2UET84CHfGWXFMG5zWWjmtDMgqYuo19');

  // Create, send funds to and claim a Submarine Swap
  const executeSwap = async (outputFunction: (scriptHex: Buffer) => Buffer, outputType: OutputType) => {
    const { blocks } = await btcdClient.getInfo();

    const redeemScript = pkRefundSwap(preimageHash, swapKeys.publicKey, btcKeys.publicKey, blocks + 1000);
    const swapAddress = address.fromOutputScript(outputFunction(redeemScript), Networks.bitcoinSimnet);

    const transaction = btcManager.constructTransaction(swapAddress, 10000);
    await btcManager.broadcastAndMine(transaction.toHex());

    const swapVout = 1;
    const transactionOutput = transaction.outs[swapVout];
    const swapOutput = {
      txHash: transaction.getHash(),
      vout: swapVout,
      type: outputType,
      script: transactionOutput.script,
      value: transactionOutput.value,
    };

    const destinationScript = address.toOutputScript(btcAddress, Networks.bitcoinSimnet);
    const claimTransaction = constructClaimTransaction(
      preimage,
      swapKeys,
      destinationScript,
      swapOutput,
      redeemScript,
    );

    await btcManager.broadcastAndMine(claimTransaction.toHex());
  };

  before(async () => {
    await btcdClient.connect();
  });

  it('should execute a P2WSH Submarine Swap', async () => {
    await executeSwap(p2wshOutput, OutputType.BECH32);
  });

  it('should execute a P2SH Submarine Swap', async () => {
    await executeSwap(p2shOutput, OutputType.LEGACY);
  });

  it('should execute a P2SH nested P2WSH Submarine Swap', async () => {
    await executeSwap(p2shP2wshOutput, OutputType.COMPATIBILITY);
  });

  after(async () => {
    await btcdClient.disconnect();
  });
});
