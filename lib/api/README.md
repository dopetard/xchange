TODO: possible error messages / codes

# API documentation

The API provided by `walli-server` is a REST API. All arguments must encoded in JSON and every POST request has to include the header `Content-Type` with the value `application/json`. Also every response is encoded in JSON.

If a request fails the only value returned to the client will be a string with the key `error`. This string contains information about the reason why the request failed and may be shown to user.

## API endpoints

* `/user`: creates a new user
  * Method: `POST`
  * Arguments: none
  * Reponse:
    * string `user`: the ID of the created user

* `/sendpayment`: sends a Lightning payment
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user who sends the transaction
    * string `invoice`: the invoice to pay
  * Reponse:
    * string `error`: contains either a walli-server or LND error (can be ignored if empty)

* `/getinvoice`: generates a new Lightning invoice
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user who creates the invoice
    * string `currency`: currency of the invoice
    * string `amount`: amount in the smallets unit of the currency (Litoshi, Satoshi, ...)
    * string `memo`: is optional, add a short message to the invoice
  * Reponse:
    * string `invoice`: the requested invoice

* `/balance`: get the balance of a user for a single currency
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user
    * string `currency`: currency to query
  * Reponse:
    * number `balance`: balance of the user in the smallets unit of the currency (Litoshi, Satoshi, ...)

* `/balances`: get the balances of a user for all currencies
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user
  * Reponse:
    * object `balances`: every key in the object is a currency and every value the according balance of the user
    // TODO: add example
