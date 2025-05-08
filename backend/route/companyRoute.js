const express = require('express');
const {
    // user
    createUser,
    updateUser,
    deleteUser,
    showAllLeaders,
    showAllMember,
    paginationLeader,
    paginationMember,
    viewMember,
    viewLeader,
    // team
    createTeam,
    updateTeam,
    showallTeam,
    deleteTeam,
    paginationTeam,
    //project
    createProject,
    updateProject,
    showallProject,
    deleteProject,
    assignProject,
    viewTeamProject,
    getUnassignedProject,
    paginationUnassignedProject,
    getAssignedProjects,
    paginationAssignedProjects,
    revokeProjectAssignment

} = require('../controller/company.js');
const authenticateJWT = require('../middleware/auth.js');
const authorize = require('../middleware/authorize.js');

const router = express.Router();

// thêm sửa xóa , show sắp xếp, phân trang leader và member
router.post('/createUser', authenticateJWT, authorize('company'), createUser);
router.put('/updateUser/:id', authenticateJWT, authorize('company'), updateUser);
router.delete('/deleteUser/:id', authenticateJWT, authorize('company'), deleteUser);
router.get('/showallLeaders', authenticateJWT, authorize('company'), showAllLeaders);
router.get('/showallMember', authenticateJWT, authorize('company'), showAllMember);
router.get('/viewMember/:id', authenticateJWT, authorize('company'), viewMember);
router.get('/viewLeader/:id', authenticateJWT, authorize('company'), viewLeader);

router.post('/paginationLeader', authenticateJWT, authorize('company'), paginationLeader);
router.post('/paginationMember', authenticateJWT, authorize('company'), paginationMember);
//

// thêm sửa xóa leader và member vào taem
router.post('/createTeam', authenticateJWT, authorize('company'), createTeam);
router.put('/updateTeam/:id', authenticateJWT, authorize('company'), updateTeam);
router.get('/showallTeam', authenticateJWT, authorize('company'), showallTeam);
router.delete('/deleteTeam/:id', authenticateJWT, authorize('company'), deleteTeam);
router.post('/paginationTeam', authenticateJWT, authorize('company'), paginationTeam);
//

// thêm sửa xóa , show sắp xếp, phân trang project và gán project vào team
router.post('/createProject', authenticateJWT, authorize('company'), createProject);
router.put('/updateProject/:id', authenticateJWT, authorize('company'), updateProject);
router.get('/showallProject', authenticateJWT, authorize('company'), showallProject);
router.delete('/deleteProject/:id', authenticateJWT, authorize('company'), deleteProject);
router.post('/paginationProject', authenticateJWT, authorize('company'), paginationTeam);
//assignProject
router.put('/assignProject/:id', authenticateJWT, authorize('company'), assignProject);
router.get('/viewTeamProject/:id', authenticateJWT, authorize('company'), viewTeamProject);
// lấy ra dự án  chk giao
router.get('/unassigned', authenticateJWT, authorize('company'), getUnassignedProject);
router.post('/paginationunassigned', authenticateJWT, authorize('company'), paginationUnassignedProject);
// lấy ra dự án đã được giao
router.get('/getassigned', authenticateJWT, authorize('company'), getAssignedProjects);
router.post('/paginationgetassigned', authenticateJWT, authorize('company'), paginationAssignedProjects);
// thu hồi lại dự án 
router.put('/revokeProject/:id/revoke', authenticateJWT, authorize('company'), revokeProjectAssignment);


module.exports = router;