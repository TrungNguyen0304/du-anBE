const express = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db");
const cors = require("cors");

const { Server } = require("socket.io");
const http = require("http");
const { setupSocket } = require("./socket/socketHandler.js");
const { startScheduleCheck } = require("./socket/socketSchedule.js");

const authRoute = require("./route/authRoute.js");
const userRoute = require("./route/userRoute.js");
const protectedRoute = require("./route/protectedRoute.js");
const companyRoute = require("./route/companyRoute.js");
const memberRoute = require("./route/memberRoute.js");
const leaderRoute = require("./route/leaderRoute.js");

dotenv.config();
const app = express();

const server = http.createServer(app); // Tạo server để dùng với socket
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://quanlynhansu-seven.vercel.app"], // socket cũng cần config đúng origin
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

// Setup CORS middlewar
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
ConnectDB();

app.use("/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/protected", protectedRoute);
app.use("/api/company", companyRoute);
app.use("/api/member", memberRoute);
app.use("/api/leader", leaderRoute);

// SOCKET setup
setupSocket(io);
startScheduleCheck();

const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
