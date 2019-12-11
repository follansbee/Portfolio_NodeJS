var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var jsonParser = bodyParser.json();

var userRoutes = require("./routes/user");
var tradeOrderRoutes = require("./routes/tradeOrder");
var totals = require("./routes/totals");

var schedule = require("node-schedule");
var dateFormat = require("dateformat");
var getLatestPrice = require("./modules/latestStockPrice");

var globalTotals = require("./modules/hourlyTotals");

var rule = new schedule.RecurrenceRule();
//rule.dayOfWeek = [0, new schedule.Range(4, 6)];
//rule.hour = 17;
rule.minute = [1];

var j = schedule.scheduleJob(rule, function() {
  globalTotals.updateAllTotals();
  console.log("All Totals have been updated: " + dateFormat());
});

app.use(userRoutes);
app.use(tradeOrderRoutes);
app.use(totals);

app.get("/", function(req, res) {
  res.send(`
    <HTML>
    <body>
    <table>
    <th>HTTP METHOD</th>
    <th>URL</th>
    <th>Description</th>
    <tr><td><b><u>Users</u></b></td></tr>
    <tr>
        <td>GET </td>
        <td><a href="localhost:3000/tradeorder/user/" target=_blank >/tradeorder/user/</a> </td>
        <td> All Users</td>
    </tr>
    <tr>
        <td>GET </td>
        <td><a href="localhost:3000/tradeorder/user/1020552/" target=_blank >/tradeorder/user/{id}</a> </td>
        <td>Show a specific User</td>
    </tr>
    <tr>
        <td>POST</td>
        <td><a href="">/portfolio/user/</a> </td>
        <td><p>Add a User:   <br>Body Example:<br>
            {
            "employeeId": "1023322", "firstName": "Julie",<br>
            "lastName": "Benice", "address1": "8 Acorn Ave",<br>
            "address2": null, "city": "Bedford",<br>
            "state": "NH", "zipCode": "03032",<br>
            "phoneNumber": "603-215-3434",<br>
            "email": "julie.benice@gmail.com"
            }</p></td>
    </tr>
    </table>
    </body>
    </HTML>
  `);
});

//app.get("/user", userController);

app.listen(port);
