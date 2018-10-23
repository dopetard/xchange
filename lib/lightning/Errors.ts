import { Error } from '../consts/Types';
import errorCodePrefix from '../consts/ErrorCodesPrefix';
import { concatErrorCode } from '../Utils';

export default {
  COULD_NOT_FIND_FILES: (chainType: string): Error => ({
    message: `could not find required files for LND ${chainType}`,
    code: concatErrorCode(errorCodePrefix.Lnd, 0),
  }),
};
