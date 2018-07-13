type Error =  {
  message: string,
};

const errors: { [ id: string ]: Error } = {};

errors.CURRENCY_NOT_SUPPORTED = {
  message: 'Currency not supported',
};

errors.INSUFFICIENT_BALANCE = {
  message: 'Insufficient balance',
};

export default errors;
