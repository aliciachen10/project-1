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

  for (var i = 0; i < 100; i++) {
    myKeys.push(i)
  }

  for (var i = 0; i < myKeys.length; i++) {
    myValuesRaw.push(data['Time Series (Daily)'][myKeysRaw[i]]['4. close'])
    myValues.push(parseFloat(myValuesRaw[i]))
  }

  var graphPoints = myKeys.map(function (e, i) {
    return ([e, myValues[i]]);
  });

  return graphPoints
}

async function getCryptoData(symbol) {

  const response = await fetch('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=' + symbol + '&market=USD&apikey=iuygasod78g');
  const data = await response.json();
  console.log(data);

  var myKeysRaw = Object.keys(data['Time Series (Digital Currency Daily)'])
  var myKeys = []
  var myValuesRaw = []
  var myValues = []
  
  for (var i = 0; i < 100; i++) {
    myKeys.push(i)
  }

  for (var i = 0; i < myKeys.length; i++) {
    myValuesRaw.push(data['Time Series (Digital Currency Daily)'][myKeysRaw[i]]['4a. close (USD)']);
    myValues.push(parseFloat(myValuesRaw[i]))
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


async function makeMyGraph(symbol) {
  d = await getStockData(symbol)
  console.log(d)
  // Step 3
  var svg = d3.select("svg"),
    margin = 200,
    width = svg.attr("width") - margin, //300
    height = svg.attr("height") - margin //200

  //get stock prices
  var stockPrices = d.map(function (x) {
    return x[1];
  })
  //get lower bound
  lowerBound = Math.min(...stockPrices) - 5
  //get upper bound
  upperBound = Math.max(...stockPrices) + 5

  // Step 4 
  var xScale = d3.scaleLinear().domain([0, 99]).range([0, width]),
    yScale = d3.scaleLinear().domain([lowerBound, upperBound]).range([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  // Step 5
  // Title
  svg.append('text')
    .attr('x', width / 2 + 100)
    .attr('y', 100)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 20)
    .text('Time vs. Stock Price');

  // X label
  svg.append('text')
    .attr('x', width / 2 + 100)
    .attr('y', height - 15 + 150)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('History');

  // Y label
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Stock price');

  // Step 6
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  g.append("g")
    .call(d3.axisLeft(yScale));

  // Step 7
  svg.append('g')
    .selectAll("dot")
    .data(d)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); })
    .attr("cy", function (d) { return yScale(d[1]); })
    .attr("r", 3)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#CC0000");

  // Step 8   
  
  var line = d3.line()
    .x(function (d) { return xScale(d[0]); })
    .y(function (d) { return yScale(d[1]); })
    .curve(d3.curveMonotoneX)

  svg.append("path")
    .datum(d)
    .attr("class", "line")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "2");

}

makeMyGraph("JBLU")