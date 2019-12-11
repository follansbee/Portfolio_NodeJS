const request = require("request");

//This generates portfolio 'value' totals for each user.
//This will be fired once every hour during work hours
function getLatestStockPrice(symbol) {
  var request = require("sync-request");
  var res = request("GET", "http://18.219.170.38/portfolio/stock/" + symbol);
  var hold = JSON.parse(res.getBody("utf8"));
  //console.log(hold.latestPrice);
  return hold.latestPrice;
}

module.exports = {
  getLatestStockPrice: getLatestStockPrice
};
