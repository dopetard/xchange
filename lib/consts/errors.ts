import { concatErrorCode } from '../Utils';
import errorCodePrefix from './errorCodePrefix';
import { Error } from './types';

export const errors = {
  IS_DISABLED: (clientName: string): Error => ({
    message: `${clientName} is disabled`,
    code: concatErrorCode(errorCodePrefix.GENERAL, 0),
  }),
  IS_DISCONNECTED: (clientName: string): Error => ({
    message: `${clientName} is disconnected`,
    code: concatErrorCode(errorCodePrefix.GENERAL, 1),
  }),
  COULD_NOT_PARSE_CONFIG: (configType: string, error: string): Error => ({
    message: `could not parse ${configType} config: ${error}`,
    code: concatErrorCode(errorCodePrefix.GENERAL, 2),
  }),
};
