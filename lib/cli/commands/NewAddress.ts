import { Arguments } from 'yargs';
import { callback, loadXchangeClient } from '../Command';
import { NewAddressRequest, OutputType } from '../../proto/xchangerpc_pb';

export const command = 'newaddress <currency> [type]';

export const describe = 'get a new address for the specified coin';

export const builder = {
  currency: {
    describe: 'ticker symbol of the currency',
    type: 'string',
  },
  type: {
    describe: 'type of the output',
    type: 'string',
    choices: ['bech32', 'compatibility', 'legacy'],
    default: 'compatibility',
  },
};

export const handler = (argv: Arguments) => {
  const request = new NewAddressRequest();

  const getOutputType = (type: string) => {
    switch (type) {
      case 'bech32': return OutputType.BECH32;
      case 'compatibility': return OutputType.COMPATIBILITY;
      default: return OutputType.LEGACY;
    }
  };

  request.setCurrency(argv.currency);
  request.setType(getOutputType(argv.type));

  loadXchangeClient(argv).newAddress(request, callback);
};
