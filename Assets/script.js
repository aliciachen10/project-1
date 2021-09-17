var returnData;

// concept for getting search results from Alphavantage API
fetch('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=amaz&apikey=iuygasod78g')
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {
      var searchResults = [];
      for (var i = 0; i < data['bestMatches'].length; i++) {
          searchResults.push(data['bestMatches'][i]);
      }
      // console.log(searchResults);
  });

// concept for getting the historical data from a stock
fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var dataset = [];
    var xValue = 100; // the API gives us an output of 100 values, so we're decrementing against that for x values

    for (var datecode in data['Time Series (Daily)']) {
        dataset.unshift({
            'x': xValue,
            'y': data['Time Series (Daily)'][datecode]['1. open'],
            'date': datecode
        });
        xValue--;
    }
    // console.log(dataset);
  });

// concept for using FinnHub API results to search for crypto and outputting results 
fetch('https://finnhub.io/api/v1/crypto/symbol?exchange=coinbase&token=c50jesqad3ic9bdl9ojg')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var filteredResults = [];
    for (var entry in data) {
      // console.log(data[entry]['displaySymbol']);
      if (data[entry]['displaySymbol'].includes('BTC')) {
        filteredResults.push(data[entry]);
      }
    }
    console.log(filteredResults);
  });

// concept for getting current stock data results from the AlphaVantage API
fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });

// concept for getting current crypto info results from the AlphaVantage API
fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=CNY&apikey=demo')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })


// crypto exchanges:
// ["BITTREX","BITFINEX","BITMEX","HUOBI","FXPIG","GEMINI","COINBASE","KRAKEN","HITBTC","BINANCE","KUCOIN","OKEX","ZB","POLONIEX"]

// finnhub api key
// c50jesqad3ic9bdl9ojg
