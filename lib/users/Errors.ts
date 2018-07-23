type Error =  {
  message: string,
};

const errors: { [ id: string ]: Error } = {};

errors.CURRENCY_NOT_SUPPORTED = {
  message: 'Currency not supported',
};

errors.NO_ERC20 = {
  message: 'Currency you wanted to send is not a ERC20 token',
};

errors.INSUFFICIENT_BALANCE = {
  message: 'Insufficient balance',
};

export default errors;
export { Error };
