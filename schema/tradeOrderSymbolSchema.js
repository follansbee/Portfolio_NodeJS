const mongoose = require("mongoose");

const tradeOrderSymbolSchema = mongoose.Schema({
  employeeId: { type: String, required: true },
  symbol: { type: String, required: true },
  totalQty: { type: Number, required: true },
  totalValue: { type: Number },
  avgPrice: { type: Number },
  totalNumOrders: { type: Number },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model("symbolTotals", tradeOrderSymbolSchema);
