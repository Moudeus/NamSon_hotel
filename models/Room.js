const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // e.g., 'Single', 'Double'
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model("Room", roomSchema);
