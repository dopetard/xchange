import { Error } from '../consts/Types';
import errorCodesPrefix from '../consts/ErrorCodesPrefix';
import { concatErrorCode } from '../Utils';

export default {
  CURRENCY_NOT_FOUND: (currency: string): Error => ({
    message: `could not find currency ${currency}`,
    code: concatErrorCode(errorCodesPrefix.Service, 0),
  }),
};
