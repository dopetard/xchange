import { concatErrorCode } from '../Utils';
import ErrorCodePrefix from './ErrorCodesPrefix';
import { Error } from './Types';

export default {
  IS_DISCONNECTED: (clientName: string): Error => ({
    message: `${clientName} is disconnected`,
    code: concatErrorCode(ErrorCodePrefix.General, 1),
  }),
  COULD_NOT_PARSE_CONFIG: (configType: string, error: string): Error => ({
    message: `could not parse ${configType} config: ${error}`,
    code: concatErrorCode(ErrorCodePrefix.General, 2),
  }),
};
