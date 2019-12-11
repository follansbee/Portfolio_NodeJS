const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Emitter = require("events");
var dateFormat = require("dateformat");

const tradeOrderSchema = require("../schema/tradeOrderSchema");
//const request = require("request");

var jsonParser = bodyParser.json();

const tradeOrderTotals = require("../modules/tradeOrderTotals");
const tradeOrderSymbolTotals = require("../modules/tradeOrderSymbolTotals");

var emtr = new Emitter();

emtr.on("updateTotals", function(empId) {
  tradeOrderTotals.updateTotals(empId);
  console.log("Update Totals Emitter!!");
});

emtr.on("updateSymbolTotals", function(empId, symbol) {
  tradeOrderSymbolTotals.updateSymbolTotals(empId, symbol);
  console.log("Update Symbol Totals Emitter!!");
});

mongoose
  .connect(
    "mongodb+srv://dfollansbee:xx@cluster0-fhipk.mongodb.net/tradeOrderNode?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to DB!!");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

//Post New Trade Order
router.post("/tradeorder/", jsonParser, function(req, res) {
  let stockPrice = getLatestPrice(req.body.symbol);
  let initialValue = req.body.qty * stockPrice;
  var newTradeOrder = tradeOrderSchema({
    employeeId: req.body.employeeId,
    symbol: req.body.symbol,
    qty: req.body.qty,
    purchasePrice: stockPrice,
    initialValue: initialValue,
    dateAdded: dateFormat()
  });

  newTradeOrder.save(function(err) {
    if (err) throw err;

    console.log("Trade Order Added!! " + JSON.stringify(newTradeOrder));

    //emtr.emit("updateTotals", newTradeOrder.employeeId);
    //Anytime a user adds a new trade order, update the summary for that employee-symbol combo
    emtr.emit(
      "updateSymbolTotals",
      newTradeOrder.employeeId,
      newTradeOrder.symbol
    );
  });

  res.send("Trade Order Added!!!! " + JSON.stringify(newTradeOrder));
});

//Remove all Trade Order
router.delete("/tradeorder/nuke", jsonParser, function(req, res) {
  tradeOrderSchema.deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log(" document(s) deleted");
  });

  res.send("Trade Orders Deleted!!!! ");
});

//Fetch ALL Trade Orders
router.get("/tradeorder", function(req, res) {
  tradeOrderSchema.find({}, function(err, tradeorders) {
    if (err) throw err;

    res.send(tradeorders);
  });
});

//Fetch All Trade Orders by employee
router.get("/tradeorder/user/:id", function(req, res) {
  tradeOrderSchema.find({ employeeId: req.params.id }, function(
    err,
    tradeorders
  ) {
    if (err) throw err;

    res.send(tradeorders);
  });
});

function getLatestPrice(symbol) {
  var request = require("sync-request");
  var res = request("GET", "http://18.219.170.38/portfolio/stock/" + symbol);
  var hold = JSON.parse(res.getBody("utf8"));
  return hold.latestPrice;
}

module.exports = router;
