const mongoose = require("mongoose");

const tradeOrderSchema = mongoose.Schema({
  employeeId: { type: String, required: true },
  symbol: { type: String, required: true },
  qty: { type: Number, required: true },
  purchasePrice: { type: Number },
  initialValue: { type: Number },
  dateAdded: { type: Date }
});

module.exports = mongoose.model("TradeOrder", tradeOrderSchema);
