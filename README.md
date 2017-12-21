# Crypto Portfolio Tracker for NodeJS
Fill out your crypto holdings inside `holdings.json`.  The app will then display your total worth in realtime by consulting Coinmarketcap.com!

1.  Fill out `holdings.json` with your portfolio allocation.
1.  `$ npm install`
1.  `$ node index.js`

## Holdings
A typical `holdings.json` file might look like

```json
{
  "invested": 20035.00,
  "usd": 35,
  "crypto": {
    "ethereum": 2,
    "litecoin": 7,
    "omisego": 10,
    "iota": 20,
    "bitcoin": 1
  }
}
```

Here's what each property means:

*  `invested` is the total number of US dollars you have put into your portfolio.  This is the sum total of all money you have used to purchase cryptocurrencies, as well as cash set aside for cryptocurrencies that is currently available.
*  `usd` is cash set aside for investment but not being used.  e.g. if you put $20,035 into GDAX, and bought $20,000 worth of crypto, then `usd: 35`.
*  `crypto` is where you enumerate how much of each coin you earn.  Acceptable key values are those supported by coinmarketcap.com
