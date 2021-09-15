var stockdata;
async function getStockData() {
  const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo')
  const data = await response.json()

  // var dataset = [];
  // var xValue = 100; // the API gives us an output of 100 values, so we're decrementing against that for x values

  // for (var datecode in data['Time Series (Daily)']) {
  //   dataset.unshift({
  //     'x': xValue,
  //     'y': data['Time Series (Daily)'][datecode]['1. open'],
  //     'date': datecode
  //   });
  //   xValue--;
  // }

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



async function makeMyGraph() {
  dataset1 = await getStockData()

  // Step 3
  var svg = d3.select("svg"),
    margin = 200,
    width = svg.attr("width") - margin, //300
    height = svg.attr("height") - margin //200

  // Step 4 
  var xScale = d3.scaleLinear().domain([0, 100]).range([0, width]),
    yScale = d3.scaleLinear().domain([130, 160]).range([height, 0]);

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
    .data(dataset1)
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
    .datum(dataset1)
    .attr("class", "line")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "2");
  
}

makeMyGraph()
