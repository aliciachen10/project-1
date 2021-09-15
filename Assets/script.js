var returnData;

fetch('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=amaz&apikey=iuygasod78g')
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {
      var searchResults = [];
      for (var i = 0; i < data['bestMatches'].length; i++) {
          searchResults.push(data['bestMatches'][i]);
      }
      console.log(searchResults);
  });

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


  function createList(stockSearch) {
    $("#stock-list").empty();
  
    let keys = Object.keys(stockSearch);
    for (var i = 0; i < keys.length; i++) {
      let stockLists = $("<button>");
      stockLists.addClass("list-group-item list-group-item-action");
  
      let splLoop = keys[i].toLowerCase().split(" ");
      for (var j = 0; j < splLoop.length; j++) {
        splLoop[j] =
          splLoop[j].charAt(0).toUpperCase() + splLoop[j].substring(1);
      }
      let titleCasedStock = splLoop.join(" ");
      stockLists.text(titleCasedStock);
  
      $("#stock-list").append(stockLists);
    }
  }


  $(document).ready(function() {
    var stockSearchStringified = localStorage.getItem("stockSearch");
  
    var stockSearch = JSON.parse(stockSearchStringified);
  
    if (stockSearch == null) {
      stockSearch = {};
    }
  
    createList(stockSearch);

    $("#search-button").on("click", function(event) {
      event.preventDefault();
      let stock = $("#stock-input")
        .val().trim()
  
      if (stock != "") {
      
        stockSearch[stock] = true;
      localStorage.setItem("stockSearch", JSON.stringify(stockSearch));
  
  
      }
  
    });
  
    //should link to pull up same stock later
    $("#stock-list").on("click", "button", function(event) {
      event.preventDefault();
      let stock = $(this).text();
  

    });
  });