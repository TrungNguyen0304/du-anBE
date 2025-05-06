const express = require('express');
const { getMyTeam,viewAssignedProject,createTask,updateTask,showAllTasks} = require('../controller/leader.js');
const authenticateJWT = require('../middleware/auth.js');
const authorize = require('../middleware/authorize.js');

const router = express.Router();
// xem task của mình được giao
router.get('/showallTeam/', authenticateJWT, getMyTeam);
router.get('/showallProject/', authenticateJWT, viewAssignedProject);
router.post('/createTask', authenticateJWT, authorize('leader'), createTask);
router.get('/showallTask/:projectId', authenticateJWT, authorize('leader'), showAllTasks);
router.put('/updateTask/:id', authenticateJWT, authorize('leader'), updateTask);

module.exports = router;