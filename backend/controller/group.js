const mongoose = require("mongoose");
const Group = require("../models/group");
const Message = require("../models/message");
const User = require("../models/user");
const Team = require("../models/team");
const { getIO, notifyNewMember } = require("../socket/socketManager");
const sanitizeHtml = require("sanitize-html");

const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.user._id;

        if (!name || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({
                message: "Tên nhóm và danh sách thành viên là bắt buộc",
            });
        }

        // Kiểm tra leader
        const team = await Team.findOne({ assignedLeader: userId });
        if (!team) {
            return res.status(403).json({
                message: "Bạn không phải leader của team nào",
            });
        }

        // Đảm bảo người tạo nhóm cũng là thành viên
        const membersSet = new Set(members.map(id => id.toString()));
        membersSet.add(userId.toString());
        const finalMembers = Array.from(membersSet);

        // Kiểm tra từng thành viên có thuộc team không
        for (const memberId of finalMembers) {
            const user = await User.findById(memberId);
            if (!user) {
                return res.status(404).json({ message: `Không tìm thấy người dùng với ID ${memberId}` });
            }

            if (!team.assignedMembers.map(id => id.toString()).includes(memberId.toString()) &&
                userId.toString() !== memberId.toString()) {
                return res.status(400).json({
                    message: `Người dùng ${memberId} không thuộc team`,
                });
            }
        }

        // Tạo nhóm
        const group = new Group({ name, members: finalMembers });
        await group.save();

        // Gửi thông báo cho các thành viên
        for (const memberId of finalMembers) {
            const user = await User.findById(memberId).select("name");
            notifyNewMember(group._id, memberId, user.name);
        }

        // Lấy nhóm với thông tin tên thành viên
        const populatedGroup = await Group.findById(group._id).populate("members", "name");

        return res.status(201).json({
            message: "Tạo nhóm thành công",
            group: populatedGroup,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi tạo nhóm",
            error: error.message,
        });
    }
};

const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId }).populate("members", "name email");
        return res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách nhóm",
            error: error.message,
        });
    }
};

const addMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;
        const leaderId = req.user._id;

        if (!userId) {
            return res.status(400).json({ message: "userId là bắt buộc" });
        }

        // Tìm nhóm
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Nhóm không tồn tại" });
        }

        // Kiểm tra quyền leader
        const team = await Team.findOne({ assignedLeader: leaderId });
        if (!team) {
            return res.status(403).json({ message: "Bạn không quản lý team nào, không thể thêm thành viên vào nhóm" });
        }

        // Lấy danh sách thành viên team và nhóm
        const assignedMemberIds = team.assignedMembers.filter(id => id != null).map(id => id.toString());
        const groupMemberIds = group.members.filter(id => id != null).map(id => id.toString());

        // Kiểm tra xem user có thuộc team không
        if (!assignedMemberIds.includes(userId.toString())) {
            return res.status(400).json({ message: "Người dùng này không thuộc team của bạn" });
        }

        // Thêm vào nhóm nếu chưa có
        if (!groupMemberIds.includes(userId.toString())) {
            group.members.push(userId);
            await group.save();

            const user = await User.findById(userId).select("name");
            notifyNewMember(groupId, userId, user.name); // Gửi thông báo
        }

        // Populate để lấy thông tin thành viên (tên)
        const populatedGroup = await Group.findById(groupId).populate("members", "name");

        res.status(200).json({
            message: "Thêm thành viên thành công",
            group: populatedGroup,
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm thành viên", error: error.message });
    }
};


const sendGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;
        const { message } = req.body;

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: "ID nhóm không hợp lệ" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID người dùng không hợp lệ" });
        }

        if (!message || typeof message !== "string") {
            return res.status(400).json({ message: "Tin nhắn không hợp lệ" });
        }

        const sanitizedMessage = sanitizeHtml(message, {
            allowedTags: [], // Loại bỏ tất cả thẻ HTML
            allowedAttributes: {},
        });

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Nhóm không tồn tại" });

        const memberIds = group.members.map((id) => id.toString());
        if (!memberIds.includes(userId.toString())) {
            return res.status(403).json({ message: "Người dùng không có trong nhóm" });
        }

        const user = await User.findById(userId).select("name");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const newMessage = new Message({
            groupId,
            senderId: userId,
            message: sanitizedMessage,
        });
        await newMessage.save();

        const io = getIO();
        io.to(groupId).emit("group-message", {
            senderId: userId,
            senderName: user.name,
            groupId,
            message: sanitizedMessage,
            timestamp: newMessage.timestamp.toISOString(),
        });

        res.status(201).json({
            _id: newMessage._id,
            groupId,
            senderId: userId,
            senderName: user.name,
            message: sanitizedMessage,
            timestamp: newMessage.timestamp,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi gửi tin nhắn", error: error.message });
    }
};

const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { skip = 0, limit = 50 } = req.query; // Hỗ trợ phân trang

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: "ID nhóm không hợp lệ" });
        }

        const messages = await Message.find({ groupId })
            .sort({ timestamp: 1 })
            .skip(Number(skip))
            .limit(Number(limit))
            .populate("senderId", "name");

        const formattedMessages = messages.map(msg => ({
            _id: msg._id,
            groupId: msg.groupId,
            senderId: msg.senderId._id,
            senderName: msg.senderId.name,
            message: msg.message,
            timestamp: msg.timestamp,
        }));

        res.status(200).json(formattedMessages);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy tin nhắn", error: error.message });
    }
};

const removeMember = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const leaderId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Nhóm không tồn tại" });
        }

        const team = await Team.findOne({ assignedLeader: leaderId });
        if (!team) {
            return res.status(403).json({ message: "Bạn không phải leader của team nào" });
        }

        if (userId.toString() === leaderId.toString()) {
            return res.status(400).json({ message: "Leader không thể tự xóa mình khỏi nhóm" });
        }

        const groupMemberIds = group.members.map(id => id.toString());
        if (!groupMemberIds.includes(userId.toString())) {
            return res.status(400).json({ message: "Người dùng không có trong nhóm" });
        }

        const assignedMemberIds = team.assignedMembers.map(id => id.toString());
        if (!assignedMemberIds.includes(userId.toString())) {
            return res.status(400).json({ message: "Người dùng không thuộc team của bạn" });
        }

        group.members = group.members.filter(id => id.toString() !== userId.toString());
        await group.save();

        const user = await User.findById(userId).select("name");
        notifyNewMember(groupId, userId, user.name, true); // Thông báo rời nhóm
       
        const populatedGroup = await Group.findById(groupId).populate("members", "name");

        res.status(200).json({
            message: `Đã xóa thành viên ${user.name} khỏi nhóm`,
            group:populatedGroup
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa thành viên", error: error.message });
    }
};

const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Nhóm không tồn tại" });
        }

        const groupMemberIds = group.members.map(id => id.toString());
        if (!groupMemberIds.includes(userId.toString())) {
            return res.status(400).json({ message: "Bạn không có trong nhóm" });
        }

        group.members = group.members.filter(id => id.toString() !== userId.toString());
        await group.save();

        const user = await User.findById(userId).select("name");
        notifyNewMember(groupId, userId, user.name, true); // Thông báo rời nhóm

        res.status(200).json({ message: "Rời nhóm thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi rời nhóm", error: error.message });
    }
};

module.exports = {
    createGroup,
    getGroups,
    addMember,
    getGroupMessages,
    sendGroupMessage,
    removeMember,
    leaveGroup,
};