import os from 'os';
import path from 'path';
import fs from 'fs';
import { pki, md } from 'node-forge';

/**
 * Get pair id of base and quote asset
 */
export const getPairId = (base: string, quote: string): string => {
  return `${base}/${quote}`;
};

/**
 * Get base and quote asset of paid id
 */
export const splitPairId = (pairId: string): { base: string, quote: string } => {
  const split = pairId.split('/');

  return {
    base: split[0],
    quote: split[1],
  };
};

/**
 * Splits a derivation path into multiple parts
 */
export const splitDerivationPath = (path: string): { master: string, sub: number[] } => {
  const split = path.split('/');
  const master = split.shift()!;

  const sub: number[] = [];

  split.forEach((part) => {
    sub.push(Number(part));
  });

  return {
    master,
    sub,
  };
};

/**
 * Concat an error code and its prefix
 */
export const concatErrorCode = (prefix: number, code: number) => {
  return `${prefix}.${code}`;
};

/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

/**
 * Resolve '~' on Linux and Unix-Like systems
 * @returns the resolved path if the path starts with '~'
 */
export const resolveHome = (filename: string) => {
  if (os.platform() !== 'win32') {
    if (filename.charAt(0) === '~') {
      return path.join(process.env.HOME!, filename.slice(1));
    }
  }

  return filename;
};

/**
 * Get a hex encoded Buffer from a string
 * @returns a hex encoded Buffer
 */
export const getHexBuffer = (input: string) => {
  return Buffer.from(input, 'hex');
};

/**
 * Get a hex encoded string from a Buffer
 *
 * @returns a hex encoded string
 */
export const getHexString = (input: Buffer) => {
  return input.toString('hex');
};

/**
 * Check whether a variable is a non-array object
 */
export const isObject = (val: any): boolean => {
  return (val && typeof val === 'object' && !Array.isArray(val));
};

/**
 * Get the current date in the LocaleString format.
 */
export const getTsString = (): string => (new Date()).toLocaleString('en-US', { hour12: false });

/**
 * Recursively merge properties from different sources into a target object, overriding any
 * existing properties.
 * @param target The destination object to merge into.
 * @param sources The sources objects to copy from.
 */
export const deepMerge = (target: any, ...sources: any[]): object => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return deepMerge(target, ...sources);
};

/**
 * Get all methods from an object whose name doesn't start with an underscore.
 */
export const getPublicMethods = (obj: any): any => {
  const ret = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach((name) => {
    const func = obj[name];
    if ((func instanceof Function) && name !== 'constructor' && !name.startsWith('_')) {
      ret[name] = func;
    }
  });
  return ret;
};

export const groupBy = (arr: object[], keyGetter: (item: any) => string | number): any => {
  const ret = {};
  arr.forEach((item) => {
    const key = keyGetter(item);
    const group = ret[key];
    if (!group) {
      ret[key] = [item];
    } else {
      group.push(item);
    }
  });
  return ret;
};

/**
 * Get current time in unix time (milliseconds).
 */
export const ms = (): number => {
  return Date.now();
};

export const generateCertificate = (tlsCertPath: string, tlsKeyPath: string): void => {
  const keys = pki.rsa.generateKeyPair(1024);
  const cert = pki.createCertificate();

  cert.publicKey = keys.publicKey;
  cert.serialNumber = String(Math.floor(Math.random() * 1024) + 1);

  const date = new Date();
  cert.validity.notBefore = date;
  cert.validity.notAfter = new Date(date.getFullYear() + 5, date.getMonth(), date.getDay());

  const attributes = [
    {
      name: 'organizationName',
      value: 'value',
    },
  ];

  cert.setSubject(attributes);
  cert.setIssuer(attributes);

  cert.setExtensions([
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 2,
          value: 'localhost',
        },
        {
          type: 7,
          ip: '127.0.0.1',
        },
      ],
    },
  ]);

  cert.sign(keys.privateKey, md.sha256.create());

  const certificate = pki.certificateToPem(cert);
  const privateKey = pki.privateKeyToPem(keys.privateKey);

  fs.writeFileSync(tlsCertPath, certificate);
  fs.writeFileSync(tlsKeyPath, privateKey);
};

export const getSystemHomeDir = (): string => {
  switch (os.platform()) {
    case 'win32': return process.env.LOCALAPPDATA!;
    case 'darwin': return path.join(process.env.HOME!, 'Library', 'Application Support');
    default: return process.env.HOME!;
  }
};
