const express = require('express');
const { getMyTeam,
    viewAssignedProject,
    createTask,
    updateTask,
    showAllTasks,
    deleteTask,
    paginationTask,
    assignTask,
    revokeTaskAssignment,
    unassignedTask,
    getAssignedTask
} = require('../controller/leader.js');
const authenticateJWT = require('../middleware/auth.js');
const authorize = require('../middleware/authorize.js');

const router = express.Router();
// xem task của mình được giao
router.get('/showallTeam/', authenticateJWT, getMyTeam);
router.get('/showallProject/', authenticateJWT, viewAssignedProject);
router.post('/createTask', authenticateJWT, authorize('leader'), createTask);
router.get('/showallTask/:projectId', authenticateJWT, authorize('leader'), showAllTasks);
router.put('/updateTask/:id', authenticateJWT, authorize('leader'), updateTask);
router.delete('/deleteTask/:id', authenticateJWT, authorize('leader'), deleteTask);
router.post('/paginationTask', authenticateJWT, authorize('leader'), paginationTask);
// gán task vào member
router.put('/assignTask/:id', authenticateJWT, authorize('leader'), assignTask);
// thu thu hồi task
router.put('/revokeTask/:id/revoke', authenticateJWT, authorize('leader'), revokeTaskAssignment);
// lấy ra task chưa giao
router.get('/unassignedTask/', authenticateJWT, unassignedTask);
router.get('/getAssignedTask/', authenticateJWT, getAssignedTask);

module.exports = router;