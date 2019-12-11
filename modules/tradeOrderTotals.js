const request = require("request");
const mongoose = require("mongoose");

const tradeOrderSchema = require("../schema/tradeOrderSchema");
const tradeOrderTotalSchema = require("../schema/tradeOrderTotalSchema");

var dateFormat = require("dateformat");

//Updates the totals of an employees entire portfolio.
function updateTotals(empId) {
  tradeOrderSchema
    .find({ employeeId: empId }, function(err, tradeorders) {
      if (err) throw err;
      //console.log(tradeorders.length);
      var totalQty = 0;
      var totalValue = 0;
      var numberOfOrders = 0;
      var currentSymbol = "";
      var currentSymbolValue = 0;
      tradeorders.forEach(function(item, i) {
        if (currentSymbol != item.symbol) {
          currentSymbol = item.symbol;
          currentSymbolValue = getLatestPrice(item.symbol);
        }

        totalQty = totalQty + item.qty;
        totalValue = totalValue + currentSymbolValue * item.qty;
      });
      //console.log("Total number: " + empId + " " + numberOfOrders);
      let criteria = {
        _id: empId,
        employeeId: empId,
        totalQty: totalQty,
        totalValue: totalValue,
        avgPrice: totalValue / numberOfOrders,
        totalNumOrders: numberOfOrders,
        dateUpdated: dateFormat()
      };
      tradeOrderTotalSchema.collection.save(criteria, function(err) {
        if (err) throw err;

        console.log("Record Saved: " + criteria.employeeId);
      });
    })
    .sort({ symbol: -1 });
}

function getLatestPrice(symbol) {
  var request = require("sync-request");
  var res = request("GET", "http://18.219.170.38/portfolio/stock/" + symbol);
  var hold = JSON.parse(res.getBody("utf8"));
  //console.log(hold.latestPrice);
  return hold.latestPrice;
}

module.exports = {
  updateTotals: updateTotals
};
