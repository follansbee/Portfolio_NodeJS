const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userSchema = require("../schema/userSchema");

var jsonParser = bodyParser.json();

mongoose
  .connect(
    "mongodb+srv://dfollansbee:XX@cluster0-fhipk.mongodb.net/tradeOrderNode?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to DB!!");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

//Get User
router.get("/tradeorder/user/:id", function(req, res) {
  userSchema.find({ employeeId: req.params.id }, function(err, users) {
    if (err) throw err;

    res.send(users);
  });
});

//Get All Users
router.get("/tradeorder/user", function(req, res) {
  userSchema.find({}, function(err, users) {
    if (err) throw err;

    res.send(users);
  });
});

//Get Specific User
// router.get("/tradeorder/user/:id", function(req, res) {
//   //res.send("<html><body><h2>Yo Ho<br>" + req.params.id + "</h2></body></html>");
//   res.send("person", { ID: req.params.id, Qstr: req.query.qstr });
// });

router.post("/user/", jsonParser, function(req, res) {
  //var User = mongoose.model("User", userSchema);

  var newUser = userSchema({
    employeeId: req.body.employeeId,
    email: req.body.email,
    address1: req.body.address1,
    address2: req.body.address2,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    dateAdded: Date.now()
  });

  newUser.save(function(err) {
    if (err) throw err;
    console.log("Person Added!! " + JSON.stringify(newUser));
  });

  res.send("Person Added!! " + JSON.stringify(newUser));
});

router.put("/user/:id", jsonParser, function(req, res) {
  console.log(req.params.id);
  userSchema.updateOne(
    { _id: req.params.id },
    {
      employeeId: req.body.employeeId,
      email: req.body.email,
      address1: req.body.address1,
      address2: req.body.address2,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dateUpdated: Date.now()
    },
    function(err) {
      if (err) throw err;
      console.log("here");
      //console.log("Person Added!! " + JSON.stringify(newUser));
    }
  );

  res.send("Person Updated!! ");
});

router.delete("/user/:id", function(req, res) {
  //delete from the databse

  userSchema.deleteOne({ _id: req.params.id }, function(err, obj) {
    if (err) throw err;
    console.log("User Deleted");
    res.send("User " + req.params.id + " Deleted");
  });
});

module.exports = router;
