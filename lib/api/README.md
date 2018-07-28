# API documentation

The API provided by `walli-server` is a REST API. All arguments must encoded in JSON and every POST request has to include the header `Content-Type` with the value `application/json`. Also every response is encoded in JSON.

## API endpoints

* `/adduser`: creates a new user
  * Method: `POST`
  * Arguments: none
  * Reponse:
    * string `user`: the ID of the created user

* `/getinvoice`: generates a new Lightning invoice
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user who creates the invoice
    * string `currency`: currency of the invoice
    * string `amount`: amount in the smallets unit of the currency (Satoshi, Litoshi, ...)
  * Reponse:
    * string `invoice`: the requested invoice

* `/payinvoice`: sends a Lightning payment
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user who sends the transaction
    * string `invoice`: the invoice to pay
  * Reponse:
    * string `error`: contains either a walli-server or LND error (can be ignored if empty)

* `/requesttokenpayment`: requests a Raiden ERC20 token payment
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user who wanto to receive a token
    * string `currency`: ticker symbol of the token the user wants to receive
  * Response:
    * number `identifier`: identifier of the payment
    * string `targetAddress`: address of the Raiden node of XUD

* `/sendtoken`: sends a ERC20 token on Raiden
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user who sends the transaction
    * string `currency`: ticker symbol of the token the user wants to send
    * string `targetAddress`: address of the Raiden node of the recipient
    * number `amount`: amount of the token the user wants to send in the smallest unit of the token (an ERC20 token has typically 18 decimals)
    * number `identifier`: identifier of the payment
  * Reponse:
    * string `error`: contains either a walli-server or Raiden error (can be ignored if empty)

* `/currency`: get historical data and the balance of a user of a single currency
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user
    * string `currency`: currency to query
  * Reponse:
    * number `balance`: balance of the user in the smallets unit of the currency (Satoshi, Litoshi, ...)
    * object `history`: an object containing historical data
      * number `price`: price of the currency
      * number `change`: price change since 24 hours in percent
      * array `hour`: price history of the last 60 minutes
      * array `day`: price history of the last 24 hours
      * array `week`: price history of the last 7 days
      * array `month`: price history of the last 30 days
      * array `threeMonths`: price history of the last 90 days
      * array `year`: price history of the last 12 months
      * array `twoYears`: price history of the last 24 months

* `/currencies`: get basic historical data and the balances of a user of all currencies
  * Method: `POST`
  * Arguments:
    * string `user`: ID of the user
  * Reponse:
    * object `${currency}`: the ticker symbol of the the currency
      * number `balance`: balance of the user in the smallets unit of the currency (Satoshi, Litoshi, ...)
      * object `history`: an object containing historical data
        * number `price`: price of the currency
        * number `change`: price change since 24 hours in percent
  * Example response:
    ```JSON
    {
        "XUC": {
            "balance": 10000,
            "history": {
                "price": 4.31,
                "change": 1.62
            }
        },
        "BTC": {
            "balance": 123,
            "history": {
                "price": 8196.72,
                "change": -0.22
            }
        }
    }
    ```

## Error handling

If a request fails the only value returned to the client will be a string with the key `error`. This string contains information about the reason why the request failed and may be shown to user. The easiest way to check if a request failed is reading the HTTP status code of the response. If the status code is not `200` it is very likely that the request failed.
