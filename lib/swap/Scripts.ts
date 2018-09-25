/**
 * This file is based on scripts created by Alex Bosworth in the repository github.com/submarineswaps/swaps-service
 */

// TODO: add missing typings
import bip66 from 'bip66';
import { script, crypto } from 'bitcoinjs-lib';
import Bn from 'bn.js';
import * as varuint from 'varuint-bitcoin';
import ops from '@michael1011/bitcoin-ops';
import { getHexBuffer, getHexString } from '../Utils';
import { ScriptElement } from '../consts/Types';

/**
 * DER encode bytes to eliminate sign confusion in a big-endian number
 *
 * @param point bytes encode
 *
 * @returns an enocded point buffer
 */
const derEncode = (point: string) => {
  const zero = getHexBuffer('00');

  let i = 0;
  let x = getHexBuffer(point);

  while (x[i] === 0) {
    i += 1;
  }

  if (i === x.length) {
    return zero;
  }

  x = x.slice(i);

  if (x[0] & 0x80) {
    return Buffer.concat([zero, x], x.length + 1);
  } else {
    return x;
  }
};

/**
 * Encode a signature
 *
 * @param flag signature hash flag number
 * @param signature signature hex string
 *
 * @returns encoded signature Buffer
 */
export const encodeSignature = (flag: number, signature: string) => {
  const pointSize = 32;

  const signatureEnd = pointSize + pointSize;

  const hashType = Buffer.from([flag]);
  const signatureBuffer = getHexBuffer(signature);

  const r = derEncode(getHexString(signatureBuffer.slice(0, pointSize)));
  const s = derEncode(getHexString(signatureBuffer.slice(pointSize, signatureEnd)));

  return Buffer.concat([bip66.encode(r, s), hashType]);
};

/**
 * Convert an array of ScriptElement to a formed pushdata script
 *
 * @param elements array of ScriptElement
 *
 * @returns a formed pushdata script
 */
export const toPushdataScript = (elements: ScriptElement[]): string => {
  const buffers: Buffer[] = [];

  elements.forEach((element) => {
    if (Buffer.isBuffer(element)) {
      buffers.push(Buffer.concat([varuint.encode(element.length), element]));
    } else {
      buffers.push(new Bn(element, 10).toArrayLike(Buffer));
    }
  });

  return getHexString(Buffer.concat(buffers));
};

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
