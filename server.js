const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
connectDB();

app.use((req, res, next) => {
  req.io = io;
  next();
}); // Pass io to req

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

io.on("connection", (socket) => {
  socket.on("joinAdmin", () => socket.join("admins"));
});

server.listen(process.env.PORT, () => console.log(`Server on ${process.env.PORT}`));
