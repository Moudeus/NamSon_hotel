const express = require("express");
const { protect, admin } = require("../middleware/auth");
const { createBooking, cancelBooking, getBookings, getBookingsByDate } = require("../controllers/bookingController");
const router = express.Router();

router.post("/", protect, createBooking);
router.delete("/:id", protect, cancelBooking);
//router.get("/", protect, admin, getBookings);
//router.get("/bydate", protect, admin, getBookingsByDate);
router.get("/", getBookings);
router.get("/bydate", getBookingsByDate);

module.exports = router;
