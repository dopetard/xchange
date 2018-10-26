import { Error } from '../consts/Types';
import { ErrorCodePrefix } from '../consts/Enums';
import { concatErrorCode } from '../Utils';

export default {
  CURRENCY_NOT_FOUND: (currency: string): Error => ({
    message: `could not find currency ${currency}`,
    code: concatErrorCode(ErrorCodePrefix.Service, 0),
  }),
  ORDER_SIDE_NOT_FOUND: (side: number): Error => ({
    message: `could not find order side: ${side}`,
    code: concatErrorCode(ErrorCodePrefix.Service, 1),
  }),
};
