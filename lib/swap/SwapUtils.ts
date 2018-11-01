/**
 * This file is based on the repository github.com/submarineswaps/swaps-service created by Alex Bosworth
 */

// TODO: add missing typings
import bip66 from 'bip66';
import Bn from 'bn.js';
import * as varuint from 'varuint-bitcoin';
import { getHexBuffer, getHexString } from '../Utils';
import { ScriptElement } from '../consts/Types';

const inBits = 5;
const outBits = 8;
const trimByteLength = 1;

const bigTen = new Bn(10, 10);

const tokenDivisibility = new Bn(1e8, 10);
const divisibilityMarkerLen = 1;
const maxMilliTokens = '2100000000000000';
const maxTokenDivisibility = 3;
const noDecimals = '000';
const decBase = 10;
const divisors = {
  m: '1000',
  n: '1000000000',
  p: '1000000000000',
  u: '1000000',
};

/**
 * DER encode bytes to eliminate sign confusion in a big-endian number
 *
 * @param point bytes to encode
 *
 * @returns an encoded point buffer
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
 * @param signature signature hex Buffer
 *
 * @returns encoded signature Buffer
 */
export const encodeSignature = (flag: number, signature: Buffer) => {
  const pointSize = 32;

  const signatureEnd = pointSize + pointSize;

  const hashType = Buffer.from([flag]);

  const r = derEncode(getHexString(signature.slice(0, pointSize)));
  const s = derEncode(getHexString(signature.slice(pointSize, signatureEnd)));

  return Buffer.concat([bip66.encode(r, s), hashType]);
};

/**
 * Convert an array of ScriptElement to a formed script
 *
 * @param elements array of ScriptElement
 *
 * @returns a script Buffer
 */
export const scriptBuffersToScript = (elements: ScriptElement[]): Buffer => {
  const buffers: Buffer[] = [];

  elements.forEach((element) => {
    if (Buffer.isBuffer(element)) {
      buffers.push(Buffer.concat([varuint.encode(element.length), element]));
    } else {
      buffers.push(getHexBuffer(element.toString(16)));
    }
  });

  return Buffer.concat(buffers);
};

/**
 * Convert an array of ScriptElement to a formed pushdata script
 *
 * @param elements array of ScriptElement
 *
 * @returns a script Buffer
 */
export const toPushdataScript = (elements: ScriptElement[]): Buffer => {
  const buffers: Buffer[] = [];

  elements.forEach((element) => {
    if (Buffer.isBuffer(element)) {
      buffers.push(Buffer.concat([varuint.encode(element.length), element]));
    } else {
      buffers.push(new Bn(element, 10).toArrayLike(Buffer));
    }
  });

  return Buffer.concat(buffers);
};

/*
/**
 * Decode bech32 encoded words to bytes
 */
export const wordsToBuffer = (words: Buffer, trim = false) => {
  let bits = 0;
  const maxV = (1 << outBits) - 1;
  const result: number[] = [];
  let value = 0;

  for (let i = 0; i < words.length; i += 1) {
    value = (value << inBits) | words[i];
    bits += inBits;

    while (bits >= outBits) {
      bits -= outBits;

      result.push((value >> bits) & maxV);
    }
  }

  if (bits > 0) {
    result.push((value << (outBits - bits)) & maxV);
  }

  if (trim && words.length * inBits % outBits !== 0) {
    return Buffer.from(result).slice(0, -trimByteLength);
  } else {
    return Buffer.from(result);
  }
};

/** Convert words to a big endian number */
export const wordsToNumber = (words: Buffer) => {
  return words.reverse().reduce((sum, n, i) => sum + n * Math.pow(32, i), 0);
};

const dividedRemainder = (div: Bn, max: number, modArg: any) => {
  let mod = modArg;

  return Array.from({ length: max }).reduce((accumulator) => {
    const bigDiv = mod.mul(bigTen).divmod(div);

    mod = bigDiv.mod;

    return accumulator + bigDiv.div.toString();
  }, '');
};

/** Get the nuber of tokens from a bech32 "HRP" */
export const hrpToTokens = (hrp: string) => {
  let decimals;
  let divisor;
  let tokens;
  let value;

  if (hrp.slice(-divisibilityMarkerLen).match(/^[munp]$/)) {
    divisor = hrp.slice(-divisibilityMarkerLen);
    value = hrp.slice(0, -divisibilityMarkerLen);
  } else if (hrp.slice(-divisibilityMarkerLen).match(/^[^munp0-9]$/)) {
    throw new Error('InvalidAmountMultiplier');
  } else {
    value = hrp;
  }

  if (!value.match(/^\d+$/)) {
    throw new Error('InvalidAmount');
  }

  const val = new Bn(value, decBase);

  // HRPs can encode values smaller than tokens on the chain can represent
  if (!!divisor) {
    const div = new Bn(divisors[divisor], decBase);

    const divmod = val.mul(tokenDivisibility).divmod(div);
    const max = maxTokenDivisibility;

    const isMilliTokens = divmod.mod.toString() !== '0';
    const { mod } = divmod;

    decimals = !isMilliTokens ? noDecimals : dividedRemainder(div, mod, max);
    tokens = divmod.div;
  } else {
    decimals = noDecimals;
    tokens = val.mul(tokenDivisibility);
  }

  if (tokens.gt(new Bn(maxMilliTokens, decBase))) {
    throw new Error('TokenCountExceedsMaximumValue');
  }

  return {
    mtokens: `${tokens.toString()}${decimals}`,
    tokens: tokens.toNumber(),
  };
};

/** Get the expiration time of an invoice bases on its creation time */
export const getInvoiceExpiration = (createdAt: string, words?: Buffer) => {
  const createdAtMs = Date.parse(createdAt);
  const secondsToAdd = !words ? 3600 : wordsToNumber(words);

  return new Date(createdAtMs + secondsToAdd * 1e3).toISOString();
};
