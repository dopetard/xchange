/**
 * This file is based on the repository github.com/submarineswaps/swaps-service created by Alex Bosworth
 */

import { BIP32 } from 'bip32';
import { Transaction, crypto, script, ECPair } from 'bitcoinjs-lib';
import ops from '@michael1011/bitcoin-ops';
import * as varuint from 'varuint-bitcoin';
import { encodeSignature, scriptBuffersToScript } from './SwapUtils';
import { OutputType } from '../consts/OutputType';
import { TransactionOutput } from '../consts/Types';

// TODO: claiming with multiple UTXOs
// TODO: support for RBF
// TODO: set locktime of transaction
// TODO: check that Swap didn't time out yet
/**
 * Claim a Submarine Swap
 *
 * @param preimage the preimage of the transaction
 * @param destinationKeys the key pair of the swap address
 * @param destinationScript the output script to which the funds should be sent
 * @param utxo the Swap UTXO to claim
 * @param redeemScript the redeem script of the swap
 *
 * @returns claim transaction
 */
export const constructClaimTransaction = (preimage: Buffer, destinationKeys: ECPair | BIP32, destinationScript: Buffer, utxo: TransactionOutput,
  redeemScript: Buffer): Transaction => {

  const tx = new Transaction();

  // Add UTXO as input to transaction
  tx.addInput(utxo.txHash, utxo.vout, 0);

  // TODO: fee estimation
  tx.addOutput(destinationScript, utxo.value - 1000);

  // Add missing witness and scripts
  switch (utxo.type) {
    // Construct the signed input scripts for P2SH inputs
    case OutputType.Legacy:
      const sigHash = tx.hashForSignature(0, redeemScript, Transaction.SIGHASH_ALL);
      const signature = destinationKeys.sign(sigHash);

      const inputScript = [
        encodeSignature(Transaction.SIGHASH_ALL, signature),
        preimage,
        ops.OP_PUSHDATA1,
        redeemScript,
      ];

      tx.setInputScript(0, scriptBuffersToScript(inputScript));

      break;

    // Construct the nested redeem script for nested SegWit inputs
    case OutputType.Compatibility:
      const nestedScript = [
        varuint.encode(ops.OP_0).toString('hex'),
        crypto.sha256(redeemScript),
      ];

      const nested = scriptBuffersToScript(nestedScript);

      tx.setInputScript(0, scriptBuffersToScript([nested]));

      break;
  }

  // Construct the signed witness for (nested) SegWit inputs
  if (utxo.type !== OutputType.Legacy) {
    const sigHash = tx.hashForWitnessV0(0, redeemScript, utxo.value, Transaction.SIGHASH_ALL);
    const signature = script.signature.encode(destinationKeys.sign(sigHash), Transaction.SIGHASH_ALL);

    tx.setWitness(0, [
      signature,
      preimage,
      redeemScript,
    ]);
  }

  return tx;
};
