const request = require("request");
const mongoose = require("mongoose");

const tradeOrderSchema = require("../schema/tradeOrderSchema");
const tradeOrderSymbolSchema = require("../schema/tradeOrderSymbolSchema");
var dateFormat = require("dateformat");

const latestStockPrice = require("./latestStockPrice");

//Symbol Totals//
//This module is used to update all the totals for each user and symbol combination
//If the record doesn't exits, it will be added to the database, otherwise it will be updated

function updateSymbolTotals(empId, symbol) {
  var totalQty = 0;
  //console.log(symbol);

  var query = "";
  if (symbol != "NONE") {
    query = { employeeId: empId, symbol: symbol };
  } else {
    query = { employeeId: empId };
  }
  //First get all the Trade Orders for the Employee.
  tradeOrderSchema.find({ employeeId: empId }, function(err, tradeorders) {
    //Second, find all the distinct symbols  (stocks)
    tradeOrderSchema.find(query).distinct("symbol", function(err, symbols) {
      symbols.forEach(function(item, i) {
        // For EACH unique Symbol
        totalQty = 0;
        orderCount = 0;
        totalValue = 0;
        tradeorders
          .filter(trade => trade.symbol == item)
          .forEach(function(tradeOrder, z) {
            //I only want to tally the trade orders that match the symbol
            totalQty = totalQty + tradeOrder.qty;
            orderCount++;
          });
        var symbolLatestPrice = getLatestPrice(item); //fetch the latest stock price
        let criteria = {
          _id: item + "-" + empId,
          employeeId: empId,
          totalQty: totalQty,
          totalVale: totalQty * symbolLatestPrice,
          avgPrice: (totalQty * symbolLatestPrice) / totalQty,
          totalNumOrders: orderCount,
          dateUpdated: dateFormat()
        };

        tradeOrderSymbolSchema.collection.save(criteria, function(err) {
          if (err) throw err;
          //console.log("TradeOrder Symbol Record Saved");
        });
      });
    });
  });
}

function getLatestPrice(symbol) {
  var request = require("sync-request");
  var res = request("GET", "http://18.219.170.38/portfolio/stock/" + symbol);
  var hold = JSON.parse(res.getBody("utf8"));
  return hold.latestPrice;
}

module.exports = {
  updateSymbolTotals: updateSymbolTotals
};
