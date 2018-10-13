/**
 * This file is based on the repository github.com/submarineswaps/swaps-service created by Alex Bosworth
 */

import { script, crypto } from 'bitcoinjs-lib';
import ops from '@michael1011/bitcoin-ops';
import * as bip65 from 'bip65';
import { toPushdataScript } from './SwapUtils';

/**
 * Generate a Submarine Swap redeem script with a public key refund path
 *
 * @param preimageHash hash of the preimage of the swap
 * @param destinationPublicKey public key of the receiving address
 * @param refundPublicKey public key of the refund address
 * @param timeoutBlockHeight at what block the HTLC should time out
 *
 * @returns redeem script
 */
export const pkRefundSwap = (preimageHash: Buffer, destinationPublicKey: Buffer, refundPublicKey: Buffer, timeoutBlockHeight: number) => {
  const cltv = script.number.encode(
    bip65.encode({ blocks: timeoutBlockHeight }),
  );

  return toPushdataScript([
    ops.OP_SHA256,
    preimageHash,
    ops.OP_EQUAL,

    ops.OP_IF,
    destinationPublicKey,

    ops.OP_ELSE,
    cltv,
    ops.OP_CHECKLOCKTIMEVERIFY,
    ops.OP_DROP,
    refundPublicKey,
    ops.OP_ENDIF,

    ops.OP_CHECKSIG,
  ]);
};

/**
 * Generate a Submarine Swap redeem script with a public key hash refund path
 *
 * @param preimageHash hash of the preimage of the swap
 * @param destinationPublicKey public key of the receiving address
 * @param refundPublicKeyHash hash of the public key of the refund address
 * @param timeoutBlockHeight at what block the HTLC should time out
 *
 * @returns redeem script
 */
export const pkHashRefundSwap = (preimageHash: Buffer, destinationPublicKey: Buffer, refundPublicKeyHash: Buffer, timeoutBlockHeight: number) => {
  const cltv = script.number.encode(
    bip65.encode({ blocks: timeoutBlockHeight }),
  );

  return toPushdataScript([
    ops.OP_DUP,
    ops.OP_SHA256,
    preimageHash,
    ops.OP_EQUAL,

    ops.OP_IF,
    ops.OP_DROP,
    destinationPublicKey,

    ops.OP_ELSE,
    cltv,
    ops.OP_CHECKLOCKTIMEVERIFY,
    ops.OP_DROP,
    ops.OP_DUP,
    ops.OP_HASH160,
    refundPublicKeyHash,
    ops.OP_EQUALVERIFY,

    ops.OP_ENDIF,

    ops.OP_CHECKSIG,
  ]);
};
