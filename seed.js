const mongoose = require("mongoose");
const fs = require("fs");
const User = require("./models/User");
const Room = require("./models/Room");
const Booking = require("./models/Booking");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const data = JSON.parse(fs.readFileSync("hotel.json", "utf8"));

async function seed() {
  try {
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});

    // Hash mật khẩu trước khi lưu
    for (let userData of data.users) {
      const hashedPassword = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Mật khẩu sẽ tự động hash bởi middleware
        role: userData.role,
      });
    }

    const rooms = await Room.insertMany(data.rooms);
    data.bookings[0].customerId = (await User.findOne({ email: "customer@example.com" }))._id;
    data.bookings[0].roomId = rooms[0]._id;
    await Booking.insertMany(data.bookings);

    console.log("Seeded successfully");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    mongoose.disconnect();
  }
}
seed();
