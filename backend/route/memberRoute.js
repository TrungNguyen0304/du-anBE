const express = require('express');
const { getMyTeam, getMyTasks,createReport} = require('../controller/member.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();
// xem task của mình được giao
router.get('/showallTeam/', authenticateJWT, getMyTeam);
router.get('/showallTask/', authenticateJWT, getMyTasks);
router.post('/createReport/', authenticateJWT, createReport);

module.exports = router;