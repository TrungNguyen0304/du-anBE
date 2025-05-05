const express = require("express");
const { login, saveFcmToken } = require("../controller/user.js");
require("../config/passport.js");

const router = express.Router();

// Route đăng nhập
router.post("/login", login);

router.post("/fcm-token", saveFcmToken)

module.exports = router;