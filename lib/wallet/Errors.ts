import { Error } from '../consts/Types';
import errorCodesPrefix from '../consts/ErrorCodesPrefix';
import { concatErrorCode } from '../Utils';

export default {
  INVALID_MNEMONIC: (mnemonic: string): Error => ({
    message: `mnemonic "${mnemonic}" is invalid`,
    code: concatErrorCode(errorCodesPrefix.Wallet, 0),
  }),
  INVALID_DEPTH_INDEX: (depth: number): Error => ({
    message: `depth index "${depth}" is invalide`,
    code: concatErrorCode(errorCodesPrefix.Wallet, 1),
  }),
};
