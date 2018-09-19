import { Error } from '../consts/errors';
import errorCodePrefix from '../consts/errorCodePrefix';
import { concatErrorCode } from '../Utils';

/**
 * Walli specific errors
 */
export const errors = {
  COULD_NOT_BIND: (host: string, port: string): Error => ({
    message: `gRPC couldn't bind on: ${host}:${port}`,
    code: concatErrorCode(errorCodePrefix.GENERAL, 0),
  }),
};
