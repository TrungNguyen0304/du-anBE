const express = require('express');
const { getMyTeam,} = require('../controller/member.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();
// xem task của mình được giao
router.get('/showallTeam/', authenticateJWT, getMyTeam);

module.exports = router;