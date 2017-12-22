const fs = require('fs')
const request = require('request')
const _ = require('underscore')

let holdings = JSON.parse( fs.readFileSync("holdings.json", "utf8") )

function get_coin( coin ) {
  return new Promise( (resolve, reject) => {
    const request_url = `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=USD`
    request.get( request_url, (err, resp, body) => {
      if( err ) reject( err )
      let data = JSON.parse(body)[0]
      resolve(data)
    })
  })
}

function compute_portfolio() {
  return new Promise( (resolve, reject) => {
    let coins = {}
    let total_coins = Object.keys(holdings.crypto).length
    let total_portfolio_value = 0
    for( let coin in holdings.crypto ) {
      get_coin(coin)
      .then( (coin_data) => {
        coins[coin_data.symbol] = coin_data
        let coin_value = parseFloat(coin_data.price_usd) * holdings.crypto[coin]
        coins[coin_data.symbol].coin_value = coin_value
        total_portfolio_value += coin_value
        if( Object.keys(coins).length === total_coins ) {
          let return_value = total_portfolio_value - holdings.invested
          resolve({
            total: total_portfolio_value,
            return: return_value,
            performance: (return_value / holdings.invested * 100),
            coins
          })
        }
      })
      .catch( (error) => {
        reject(error)
      })
    }
  })
}

setInterval( () => {
  compute_portfolio()
  .then( (portfolio) => {
    for( let coin of _.sortBy(portfolio.coins, c => c.coin_value) ) {
      console.log(`${coin.symbol}:\t\t$${coin.coin_value.toFixed(2)}`)
    }
    console.log(`Return:\t\t$${portfolio.return.toFixed(2)}\t(${portfolio.performance.toFixed(2)}%)\n`)
  })
  .catch( (error) => {
    console.log(`Encountered error: `, error)
  })
}, 10000)
