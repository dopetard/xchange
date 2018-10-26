import { OutputType } from '../proto/xchangerpc_pb';

export const getOutputType = (type: string) => {
  switch (type) {
    case 'bech32': return OutputType.BECH32;
    case 'compatibility': return OutputType.COMPATIBILITY;
    default: return OutputType.LEGACY;
  }
};
