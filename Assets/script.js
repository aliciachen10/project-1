async function getStockSearchResults(query) {
  const response = await fetch('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' + query + '&apikey=iuygasod78g');
  const data = await response.json();

  // console.log(data['bestMatches']);
  return data['bestMatches'];
}

async function getStockData(symbol) {
  const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=iuygasod78g');
  const data = await response.json();

  var myKeysRaw = Object.keys(data['Time Series (Daily)'])
  var myKeys = []
  var myValuesRaw = []
  var myValues = []
  for (var i = 0; i < myKeysRaw.length; i++) {
    myValuesRaw.push(data['Time Series (Daily)'][myKeysRaw[i]]['4. close'])
    myValues.push(parseFloat(myValuesRaw[i]))
  }

  for (var i=0; i < myKeysRaw.length; i++) {
    myKeys.push(i)
  }

  var graphPoints = myKeys.map(function (e, i) {
    return ([e, myValues[i]]);
  });

  return graphPoints
}

async function getCryptoData(symbol) {
  const response = await fetch('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=iuygasod78g');
  const data = await response.json();

  var myKeysRaw = Object.keys(data['Time Series (Digital Currency Daily)'])
  var myKeys = []
  var myValuesRaw = []
  var myValues = []
  for (var i = 0; i < myKeysRaw.length; i++) {
    myValuesRaw.push(data['Time Series (Digital Currency Daily)'][myKeysRaw[i]]['4. close'])
    myValues.push(parseFloat(myValuesRaw[i]))
  }

  for (var i=0; i < myKeysRaw.length; i++) {
    myKeys.push(i)
  }

  var graphPoints = myKeys.map(function (e, i) {
    return ([e, myValues[i]]);
  });

  return graphPoints
}

var results = getCryptoData('BTC');
console.log(results);

async function getCryptoSearchResults(query) {
  const response = await fetch('https://finnhub.io/api/v1/crypto/symbol?exchange=coinbase&token=c50jesqad3ic9bdl9ojg');
  const data = await response.json();

  var filteredResults = [];
  for (var entry in data) {
    // console.log(data[entry]['displaySymbol']);
    if (data[entry]['displaySymbol'].includes('BTC')) {
      filteredResults.push(data[entry]);
    }
  }

  return filteredResults;
}

async function getCurrentStockData(symbol) {
  const response = await fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + symbol + '&apikey=iuygasod78g');
  const data = await response.json();

  return data;
}

async function getCurrentCryptoData(symbol) {
  const response = await fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=' + symbol + '&to_currency=USD&apikey=iuygasod78g');
  const data = await response.json();

  return data;
}
