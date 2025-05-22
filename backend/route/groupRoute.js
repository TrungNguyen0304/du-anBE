const express = require('express');
const router = express.Router();
const {
    createGroup,
    getGroups,
    addMember,
    getGroupMessages,
    sendGroupMessage,
    removeMember,
    leaveGroup
} = require('../controller/group');
const authenticateJWT = require('../middleware/auth.js');


// Tạo nhóm mới
router.post('/create', authenticateJWT, createGroup);

// Lấy danh sách nhóm
router.get('/', authenticateJWT, getGroups);

// Thêm thành viên vào nhóm
router.post('/:groupId/members', authenticateJWT, addMember);

// Lấy lịch sử tin nhắn nhóm
router.get('/:groupId/messages', authenticateJWT, getGroupMessages);

// Gửi tin nhắn nhóm
router.post('/:groupId/messages', authenticateJWT, sendGroupMessage);

//  xóa một thành viên
router.delete("/:groupId/members/:userId", authenticateJWT, removeMember); 

//rời khỏi nhóm
router.delete("/:groupId/leave", authenticateJWT, leaveGroup); 

module.exports = router;