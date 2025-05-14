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
    getAssignedTask,
    showallReport,
    showAllReportMember,
    evaluateMemberReport,
    createReportCompany,
    showAllFeedback
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
router.get('/unassignedTask/', authenticateJWT,authorize('leader'), unassignedTask);
// lay task đã giao
router.get('/getAssignedTask/', authenticateJWT,authorize('leader'), getAssignedTask);
//show ra report của member
router.get('/viewReport/', authenticateJWT,authorize('leader'), showallReport);
// lây ra report của từng member
router.get('/viewReportMember/:id/', authenticateJWT,authorize('leader'), showAllReportMember);
// đánh giá báo cáo của member
router.post('/evaluateMemberReport/:id', authenticateJWT, authorize('leader'), evaluateMemberReport);
// bao của của leader dành cho company
router.post('/createReportCompany/',authenticateJWT, authorize('leader'), createReportCompany);
// xem tat ca danh gia
router.get('/showAllFeedback/',authenticateJWT,authorize('leader'),showAllFeedback)

module.exports = router;