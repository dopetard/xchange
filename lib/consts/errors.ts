import { concatErrorCode } from '../Utils';
import errorCodePrefix from './errorCodePrefix';

export type Error = {
  message: string,
  code: string,
};

/**
 * Errors that are that generic or used in multiple places
 */

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
