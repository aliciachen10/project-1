const AV_API_URL = 'https://www.alphavantage.co/query?';
const API_KEY = 'iuygasod78g';

const stockSymbol = document.getElementById('stockSymbol');
const cryptoSymbol = document.getElementById('cryptoSymbol');
const stockBtn = document.getElementById('stockBtn');
const cryptoBtn = document.getElementById('cryptoBtn');
var stockSvg = document.getElementById('stock-svg');
var cryptoSvg = document.getElementById('crypto-svg');
let symbol = "";

//Local Storage Variables.
var stockSearch;
var stockList = [];
var cryptoSearch;
var cryptoList = [];

//Enter searced Stock into DOM
function renderStocks(){
  $("#stock-list").empty();
  $("#stockSymbol").val("");
  
  for (i=0; i<stockList.length; i++){
      var a = $("<div.stocklist>");
      a.addClass("list-group-item");
      a.attr("data-name", stockList[i]);
      a.text(stockList[i]);
      $("#stock-list").prepend(a);
  } 
}
//Crypto into DOM
function renderCrypto(){
  $("#crypto-list").empty();
  $("#cryptoSymbol").val("");
  
  for (i=0; i<cryptoList.length; i++){
      var a = $("<div.crypto-list>");
      a.addClass("list-group-item");
      a.attr("data-name", cryptoList[i]);
      a.text(cryptoList[i]);
      $("#crypto-list").prepend(a);
  } 
}
//Save to local array
function storeStockArray() {
  localStorage.setItem("stocks", JSON.stringify(stockList));
  }
function storeCryptoArray() {
    localStorage.setItem("cryptos", JSON.stringify(cryptoList));
    }
function storeCurrentStock() {

      localStorage.setItem("currentstock", JSON.stringify(stockSearch));
  }
function storeCurrentCrypto(){
  localStorage.setItem("currentcrypto", JSON.stringify(cryptoSearch));
}     
//Pull from local storage
function initStockList(){
  var storedStocks = JSON.parse(localStorage.getItem("stocks"));

  if (storedStocks !== null){
    stockList = storedStocks;
  }

  renderStocks();
}
function initCryptoList(){
  var storedCrypto = JSON.parse(localStorage.getItem("cryptos"));

  if (storedCrypto !== null){
    cryptoList = storedCrypto;
  }

  renderCrypto();
}
//Searchbar Stuff

async function getStockSearchResults(symbol) {

  const response = await fetch(AV_API_URL + 'function=SYMBOL_SEARCH&keywords=' + query + '&apikey=' + API_KEY);
  const data = await response.json();

  // console.log(data['bestMatches']);
  return data['bestMatches'];

}



async function getCryptoSearchResults(symbol) {
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



// Graphing Functions

async function getStockData(symbol) {

const response = await fetch(AV_API_URL + 'function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=' + API_KEY);

  const data = await response.json();

  console.log(data);

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

  const response = await fetch(AV_API_URL + 'function=DIGITAL_CURRENCY_DAILY&symbol=' + symbol + '&market=USD&apikey=' + API_KEY);
  const data = await response.json();
  console.log(data);
  console.log(response);

  var myKeysRaw = Object.keys(data['Time Series (Digital Currency Daily)']);
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

async function makeMyStockGraph(symbol) {

  d = await getStockData(symbol);
  console.log(d);
  // Step 3
    var svg = d3.select("#stock-svg"),
    margin = 200,
    width = svg.attr("width") - margin, //30
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

async function makeMyCryptoGraph(symbol) {

  d = await getCryptoData(symbol);
  console.log(d);
  // Step 3
  svg = d3.select("#crypto-svg"),
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

// Make graphs after button click
$("#stockBtn").on('click', async function(event){
  event.preventDefault();

  symbol = $("#stockSymbol").val().trim().toUpperCase();
 
  if(symbol === ""){
    alert("Please enter a stock to look up")
  } else {
    $("svg.stock-graph").empty();

  //Stock List
  
  stockList.push(symbol);
  storeCurrentStock();
  storeStockArray();
  renderStocks();
  
  //const response = await getCurrentStockData(symbol);
  // const response = await fetch(AV_API_URL + 'function=GLOBAL_QUOTE&symbol=' + symbol + '&apikey=' + API_KEY);
  // const data = await response.json();
  console.log(symbol);
  makeMyStockGraph(symbol);
  }

});

$("#cryptoBtn").on('click', async function(event){
  event.preventDefault();
  
  symbol = $("#cryptoSymbol").val().trim().toUpperCase();

  if(symbol === ""){
    alert("Please enter a cryptocurrency to look up")
  } else {
  $("svg.crypto-graph").empty();
  //Crypto List
 
  cryptoList.push(symbol);
  storeCurrentCrypto();
  storeCryptoArray();
  renderCrypto();
  
  // const response = await fetch(AV_API_URL + 'function=CURRENCY_EXCHANGE_RATE&from_currency=' + symbol + '&to_currency=USD&apikey=' + API_KEY);
  // const data = await response.json();
  console.log(symbol);
  makeMyCryptoGraph(symbol);
  }
});




//local storage

// $("#stockBtn").on('click', function(){
//   //$("#stock-list").empty();

//   let keys = Object.keys(stockSearch);
//   for (var i = 0; i < keys.length; i++) {
//     let stockLists = $("#stockBtn");
//     stockLists.addClass("list-group-item list-group-item-action");

//     let splLoop = keys[i].toLowerCase().split(" ");
//     for (var j = 0; j < splLoop.length; j++) {
//       splLoop[j] =
//         splLoop[j].charAt(0).toUpperCase() + splLoop[j].substring(1);
//     }
//     let titleCasedStock = splLoop.join(" ");
//     stockLists.text(titleCasedStock);

//     $("#stock-list").append(stockLists);
//   }
// });


// $(document).ready(function() {
//   var stockSearchStringified = localStorage.getItem("stockSearch");

//   var stockSearch = JSON.parse(stockSearchStringified);

//   if (stockSearch == null) {
//     stockSearch = {};
//   }

//   createList(stockSearch);

//   $("#search-button").on("click", function(event) {
//     event.preventDefault();
//     let stock = $("#stockSymbol")
//       .val().trim()

//     if (stock != "") {
    
//       stockSearch[stock] = true;
//     localStorage.setItem("stockSearch", JSON.stringify(stockSearch));


//     }

//   });

//   //should link to pull up same stock later
//   $("#stock-list").on("click", "button", function(event) {
//     event.preventDefault();
//     let stock = $(this).text();


//   });
// });

