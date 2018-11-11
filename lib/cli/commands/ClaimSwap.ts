import { Arguments } from 'yargs';
import { ECPair, address, Transaction } from 'bitcoinjs-lib';
import { getNetwork } from '../Utils';
import { constructClaimTransaction } from '../../swap/Claim';
import { getHexBuffer, getHexString } from '../../Utils';
import { OutputType } from '../../proto/xchangerpc_pb';
import { printResponse } from '../Command';

export const command = 'claimswap <network> <lockup_transaction> <redeem_script> <preimage> <claim_private_key> <destination_address>';

export const describe = 'claims the onchain part of a reverse swap';

export const builder = {
  network: {
    describe: 'network on which the claim transaction should be broadcasted',
    type: 'string',
  },
  lockup_transaction: {
    describe: 'hex encoded transaction in which Xchange locked up the funds',
    type: 'string',
  },
  redeem_script: {
    describe: 'hex encoded redeem script of the swap output',
    type: 'string',
  },
  preimage: {
    describe: 'preimage of the invoice',
    type: 'string',
  },
  claim_private_key: {
    describe: 'public key with which a claiming transaction has to be signed',
    type: 'string',
  },
  destination_address: {
    describe: 'address to which the claimed funds should be sent',
    type: 'string',
  },
};

// TODO: detect swap output instead of assuming that it is the first one and compatibility
export const handler = (argv: Arguments) => {
  const network = getNetwork(argv.network);

  const claimKeys = ECPair.fromPrivateKey(getHexBuffer(argv.claim_private_key), { network });
  const destinationScript = address.toOutputScript(argv.destination_address, network);

  const lockupTransaction = Transaction.fromHex(argv.lockup_transaction);
  const swapOutput = lockupTransaction.outs[0];

  const claimTransaction = constructClaimTransaction(
    getHexBuffer(argv.preimage),
    claimKeys,
    destinationScript,
    {
      txHash: lockupTransaction.getHash(),
      vout: 0,
      type: OutputType.COMPATIBILITY,
      script: swapOutput.script,
      value: swapOutput.value,
    },
    getHexBuffer(argv.redeem_script),
  );

  printResponse({
    claimTransaction: claimTransaction.toHex(),
  });
};
