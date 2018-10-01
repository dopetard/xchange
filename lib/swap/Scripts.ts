/**
 * This file is based on the repository github.com/submarineswaps/swaps-service created by Alex Bosworth
 */

import { script, crypto } from 'bitcoinjs-lib';
import ops from '@michael1011/bitcoin-ops';
import { getHexBuffer, getHexString } from '../Utils';

/**
 * Get a P2WPKH output script
 *
 * @param hash public key hash hex string
 *
 * @returns P2WPKH output script buffer
 */
export const p2wpkhOutput = (hash: string) => {
  return script.compile([
    ops.OP_0,
    getHexBuffer(hash),
  ]);
};

/**
 * Encode a P2WSH output script
 *
 * @param scriptHex redeem script hex string
 *
 * @returns P2WSH output script Buffer
 */
export const p2wshOutput = (scriptHex: string) => {
  return script.compile([
    ops.OP_0,
    crypto.sha256(getHexBuffer(scriptHex)),
  ]);
};

/**
 * Get a P2PKH output script
 *
 * @param hash public key hash hex string
 *
 * @returns P2PKH output script Buffer
 */
export const p2pkhOutput = (hash: string) => {
  return script.compile([
    ops.OP_DUP,
    ops.OP_HASH160, getHexBuffer(hash),
    ops.OP_EQUALVERIFY,
    ops.OP_CHECKSIG,
  ]);
};

/**
 * Encode a P2SH output script
 *
 * @param scriptHex redeem script hex string
 *
 * @returns P2SH output script Buffer
 */
export const p2shOutput = (scriptHex: string) => {
  return script.compile([
    ops.OP_HASH160,
    crypto.hash160(getHexBuffer(scriptHex)),
    ops.OP_EQUAL,
  ]);
};

/**
 * Get a P2SH nested P2WSH output script
 *
 * @param scriptHex redeem script hex string
 *
 * @returns P2SH output script Buffer
 */
export const p2shP2wshOutput = (scriptHex: string) => {
  const witness = p2wshOutput(scriptHex);

  return p2shOutput(getHexString(witness));
};
