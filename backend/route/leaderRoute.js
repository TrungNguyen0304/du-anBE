const express = require('express');
const { getMyTeam,viewAssignedProject} = require('../controller/leader.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();
// xem task của mình được giao
router.get('/showallTeam/', authenticateJWT, getMyTeam);
router.get('/showallProject/', authenticateJWT, viewAssignedProject);

module.exports = router;