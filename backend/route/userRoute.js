const express = require("express");
const { login } = require("../Controller/user.js");
require("../config/passport.js");

const router = express.Router();

// Route đăng nhập
router.post("/login", login);

module.exports = router;