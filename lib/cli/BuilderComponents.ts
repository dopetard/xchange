export const OutputTypeComponent = {
  describe: 'type of the output',
  type: 'string',
  choices: ['bech32', 'compatibility', 'legacy'],
  default: 'compatibility',
};

export const OrderSideComponent = {
  describe: 'whether the order is a buy or sell one',
  type: 'string',
  choices: ['buy', 'sell'],
};
