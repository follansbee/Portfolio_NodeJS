const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  employeeId: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  address1: String,
  address2: String,
  dateAdded: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
