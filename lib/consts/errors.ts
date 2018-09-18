import { concatErrorCode } from '../Utils';
import errorCodePrefix from './errorCodePrefix';

type Error = {
  message: string,
  code: string,
};

/**
 * Walli specific errors
 */
const walliErrors = {
  COULD_NOT_BIND: (host: string, port: string): Error => ({
    message: `gRPC couldn't bind on: ${host}:${port}`,
    code: concatErrorCode(errorCodePrefix.WALLI, 0),
  }),
};

/**
 * Errors that are that generic or used in multiple places
 */
const errors = {
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

export {
  walliErrors,
  errors,
};
