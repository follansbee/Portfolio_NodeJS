const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const tradeOrderTotalSchema = require("../schema/tradeOrderTotalSchema");

var jsonParser = bodyParser.json();

// mongoose
//   .connect(
//     "mongodb+srv://dfollansbee:99Mongo20@cluster0-fhipk.mongodb.net/tradeOrderNode?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => {
//     console.log("Connected to DB!!");
//   })
//   .catch(() => {
//     console.log("Connection Failed");
//   });

//Get All User's Total
router.get("/tradeorder/totals", function(req, res) {
  tradeOrderTotalSchema.find({}, function(err, users) {
    if (err) throw err;

    res.send(users);
  });
});

//Fetch All Trade Orders by employee
router.get("/tradeorder/totals/user/:id", function(req, res) {
  tradeOrderTotalSchema.find({ employeeId: req.params.id }, function(
    err,
    totals
  ) {
    if (err) throw err;

    res.send(totals);
  });
});

module.exports = router;
