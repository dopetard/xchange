import { Error } from '../consts/Types';
import errorCodesPrefix from '../consts/ErrorCodesPrefix';
import { concatErrorCode } from '../Utils';

export default {
  PAIR_NOT_FOUND: (pairId: string): Error => ({
    message: `could not find pair ${pairId}`,
    code: concatErrorCode(errorCodesPrefix.General, 0),
  }),
};
