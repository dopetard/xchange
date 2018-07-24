type Error =  {
  message: string,
};

const errors: { [ id: string ]: Error } = {};

errors.CURRENCY_NOT_SUPPORTED = {
  message: 'Currency not supported',
};

errors.NO_ERC20 = {
  message: 'Currency you wanted to send is not an ERC20 token',
};

errors.INSUFFICIENT_BALANCE = {
  message: 'Insufficient balance',
};

errors.AMOUNT_GREATER_ZERO = {
  message: 'Amount has to be greater than 0',
};

errors.INVOICE_NOT_FOUND = {
  message: 'Could not find invoice',
};

export default errors;
export { Error };
