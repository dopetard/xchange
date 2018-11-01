import Networks from '../consts/Networks';
import { OutputType, OrderSide } from '../proto/xchangerpc_pb';

export const getOrderSide = (side: string) => {
  switch (side.toLowerCase()) {
    case 'buy': return OrderSide.BUY;
    case 'sell': return OrderSide.SELL;

    default: throw `could not find order side: ${side}`;
  }
};

export const getOutputType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'bech32': return OutputType.BECH32;
    case 'compatibility': return OutputType.COMPATIBILITY;

    default: return OutputType.LEGACY;
  }
};

export const getNetwork = (networkKey: string) => {
  const network = Networks[networkKey];

  if (!network) {
    throw `Could not find network: ${networkKey}`;
  }

  return network;
};
