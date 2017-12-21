const fs = require('fs')
const request = require('request')

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
    let coin_count = 0
    let total_coins = Object.keys(holdings.crypto).length
    let total_portfolio_value = 0
    for( let coin in holdings.crypto ) {
      get_coin(coin)
      .then( (coin_data) => {
        let coin_value = parseFloat(coin_data.price_usd) * holdings.crypto[coin]
        total_portfolio_value += coin_value
        //console.log(`${coin_data.symbol}:\t\t$${coin_value}`)
        coin_count++
        if( coin_count === total_coins ) {
          let return_value = total_portfolio_value - holdings.invested
          resolve({
            total: total_portfolio_value,
            return: return_value,
            performance: (return_value / holdings.invested * 100),
          })
        }
      })
    }
  })
}

setInterval( () => {
  compute_portfolio()
  .then( (portfolio) => {
    console.log(`Return:\t\t$${portfolio.return.toFixed(2)}\t(${portfolio.performance.toFixed(2)}%)`)
  })
}, 10000)
