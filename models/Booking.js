const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerId: { type: String, required: true }, // Ref to User._id
  roomId: { type: String, required: true }, // Ref to Room._id
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
});

module.exports = mongoose.model("Bookings", bookingSchema);
