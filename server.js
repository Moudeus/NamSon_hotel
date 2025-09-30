const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
require("dotenv").config();

const app = express();

app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(process.env.PORT, () => console.log(`Server on ${process.env.PORT}`));
