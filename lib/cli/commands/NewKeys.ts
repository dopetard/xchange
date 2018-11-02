import { Arguments } from 'yargs';
import { ECPair } from 'bitcoinjs-lib';
import { getNetwork } from '../Utils';
import { getHexString } from '../../Utils';

export const command = 'newkeys <network>';

export const describe = 'get new keys for the specified network';

export const builder = {
  network: {
    describe: 'network for the keys',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const network = getNetwork(argv.network);
  const keys = ECPair.makeRandom({ network });

  console.log(JSON.stringify({
    publicKey: getHexString(keys.publicKey),
    privateKey: getHexString(keys.privateKey),
  }, undefined, 2));
};
