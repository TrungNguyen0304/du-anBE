const express = require('express');
const { getMyTeam, getMyTasks,createReport,showAllFeedback,updateTaskStatus} = require('../controller/member.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();
// xem task của mình được giao
router.get('/showallTeam/', authenticateJWT, getMyTeam);
router.get('/showAllFeedback/', authenticateJWT, showAllFeedback);
router.get('/showallTask/', authenticateJWT, getMyTasks);
router.post('/createReport/', authenticateJWT, createReport);
router.put('/updateStatus/:id', authenticateJWT, updateTaskStatus);

module.exports = router;