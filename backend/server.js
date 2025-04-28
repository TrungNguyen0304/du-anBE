const express = require("express")
const dotenv = require("dotenv");
const ConnectDB = require("./config/db");

dotenv.config()

const app = express();
app.use(express.json());

ConnectDB();



const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });