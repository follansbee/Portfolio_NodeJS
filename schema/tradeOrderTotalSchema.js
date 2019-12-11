const mongoose = require("mongoose");

const tradeOrderTotalSchema = mongoose.Schema({
  employeeId: { type: String, required: true },
  totalQty: { type: Number, required: true },
  totalValue: { type: Number },
  avgPrice: { type: Number },
  totalNumOrders: { type: Number },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model("TradeOrderTotals", tradeOrderTotalSchema);
