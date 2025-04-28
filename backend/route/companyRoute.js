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
    // team
    createTeam,
    updateTeam,
    showallTeam,
    deleteTeam,
    paginationTeam

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

router.post('/paginationLeader', authenticateJWT, authorize('company'), paginationLeader);
router.post('/paginationMember', authenticateJWT, authorize('company'), paginationMember);
//

// thêm sửa xóa leader và member vào taem
router.post('/createTeam', authenticateJWT, authorize('company'), createTeam);
router.put('/updateTeam/:id', authenticateJWT, authorize('company'), updateTeam);
router.get('/showallTeam', authenticateJWT, authorize('company'), showallTeam);
router.delete('/deleteTeam/:id', authenticateJWT, authorize('company'), deleteTeam);

router.post('/paginationTeam', authenticateJWT, authorize('company'), paginationTeam);



module.exports = router;