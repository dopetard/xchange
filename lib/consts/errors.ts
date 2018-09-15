import { concatErrorCode } from '../Utils';
import errorCodePrefix from './errorCodePrefix';

/**
 * Errors that are that generic or used in multiple places
 */
const errors = {
  IS_DISABLED: (clientName: string) => ({
    message: `${clientName} is disabled`,
    code: concatErrorCode(errorCodePrefix.GENERAL, 0),
  }),
  IS_DISCONNECTED: (clientName: string) => ({
    message: `${clientName} is disconnected`,
    code: concatErrorCode(errorCodePrefix.GENERAL, 1),
  }),
  COULD_NOT_PARSE_CONFIG: (configType: string, error: string) => ({
    message: `could not parse ${configType} config: ${error}`,
    code: concatErrorCode(errorCodePrefix.GENERAL, 2),
  }),
};

export default errors;
