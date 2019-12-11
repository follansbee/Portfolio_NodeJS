const Emitter = require("events");

const tradeOrderSymbolTotals = require("./tradeOrderSymbolTotals");
const tradeOrderTotals = require("./tradeOrderTotals");
const tradeOrderSchema = require("../schema/tradeOrderSchema");

var dateFormat = require("dateformat");

var emtr = new Emitter();

emtr.on("updateSymbolTotals", function(empId, symbol) {
  // tradeOrderSymbolTotals.updateSymbolTotals(empId, "RTN");
  tradeOrderSymbolTotals.updateSymbolTotals(empId, "NONE");

  //console.log("Update Symbol Totals Emitter!!");
});

emtr.on("updateUserTotals", function(empId, symbol) {
  // tradeOrderSymbolTotals.updateSymbolTotals(empId, "RTN");
  tradeOrderTotals.updateTotals(empId);

  //console.log("Update User Totals Emitter!!");
});

//This generates portfolio 'value' totals for each user.
//This will be fired once every hour during work hours
function updateAllTotals() {
  var totalQty = 0;
  //var userList = ["1020552", "14444", "18667"];

  tradeOrderSchema.find({}).distinct("employeeId", function(err, userList) {
    console.log(userList);
    userList.forEach(function(empId, i) {
      //console.log("User " + empId + " processed.");

      emtr.emit("updateSymbolTotals", empId, "NONE");
      // tradeOrderSymbolTotals.updateSymbolTotals(empId);
      emtr.emit("updateUserTotals", empId);
      //Second, find all the distinct symbols  (stocks)
    });
  });
}

module.exports = {
  updateAllTotals: updateAllTotals
};
