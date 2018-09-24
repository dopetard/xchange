import { Error } from '../consts/Types';
import errorCodePrefix from '../consts/ErrorCodesPrefix';
import { concatErrorCode } from '../Utils';

export default {
  COULD_NOT_BIND: (host: string, port: string): Error => ({
    message: `gRPC couldn't bind on: ${host}:${port}`,
    code: concatErrorCode(errorCodePrefix.Grpc, 0),
  }),
};
