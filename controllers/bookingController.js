const Booking = require("../models/Booking");
const Room = require("../models/Room");

const isAvailable = async (roomId, checkIn, checkOut) => {
  const bookings = await Booking.find({
    roomId,
    status: { $ne: "cancelled" },
    $or: [
      { checkInDate: { $lt: checkOut, $gte: checkIn } },
      { checkOutDate: { $gt: checkIn, $lte: checkOut } },
      { checkInDate: { $lte: checkIn }, checkOutDate: { $gte: checkOut } },
    ],
  });
  return bookings.length === 0;
};

exports.createBooking = async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (checkIn >= checkOut) return res.status(400).json({ message: "Invalid dates" });
  if (!(await isAvailable(roomId, checkIn, checkOut))) return res.status(400).json({ message: "Room unavailable" });
  const booking = await Booking.create({
    customerId: req.user._id,
    roomId,
    checkInDate: checkIn,
    checkOutDate: checkOut,
  });
  await Room.findByIdAndUpdate(roomId, { available: false });
  req.io.to("admins").emit("newBooking", booking);
  res.status(201).json(booking);
};

exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking || booking.customerId.toString() !== req.user._id.toString())
    return res.status(404).json({ message: "Not found or unauthorized" });
  if (new Date() >= booking.checkInDate) return res.status(400).json({ message: "Cannot cancel" });
  booking.status = "cancelled";
  await booking.save();
  await Room.findByIdAndUpdate(booking.roomId, { available: true });
  res.json({ message: "Cancelled" });
};

exports.getBookings = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const bookings = await Booking.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .populate("customerId roomId");
  const total = await Booking.countDocuments();
  if (!bookings.length) return res.json({ message: "No bookings" });
  res.json({ bookings, totalPages: Math.ceil(total / limit) });
};

exports.getBookingsByDate = async (req, res) => {
  const { checkInDate, checkOutDate } = req.query;
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (checkIn >= checkOut) return res.status(400).json({ message: "Invalid dates" });
  const bookings = await Booking.find({ checkInDate: { $gte: checkIn, $lte: checkOut } }).populate("customerId roomId");
  res.json(bookings);
};
