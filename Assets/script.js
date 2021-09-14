var returnData;

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
    console.log(dataset);
  });