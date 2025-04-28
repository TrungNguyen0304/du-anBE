const express = require("express")
const dotenv = require("dotenv");
const ConnectDB = require("./config/db");

const authRoute = require("./route/authRoute.js");
const userRoute = require("./route/userRoute.js");
const protectedRoute = require("./route/protectedRoute.js");
const companyRoute = require("./route/companyRoute.js")
const memberRoute = require("./route/memberRoute.js")
dotenv.config()

const app = express();
app.use(express.json());

ConnectDB();


app.use("/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/protected", protectedRoute);
app.use("/api/company", companyRoute);
app.use("/api/member", memberRoute);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});