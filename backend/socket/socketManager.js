let ioInstance;
const onlineUsers = new Map();
const groupMembers = new Map();

function setupSocketManager(io) {
    ioInstance = io;

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // Khi người dùng online
        socket.on("user-online", (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.join(userId);
            console.log(`Người dùng ${userId} đang trực tuyến - tham gia phòng ${userId}`);
        });

        // Tham gia nhóm
        socket.on("join-group", ({ userId, groupId }) => {
            if (!groupMembers.has(groupId)) {
                groupMembers.set(groupId, new Set());
            }
            groupMembers.get(groupId).add(userId);
            socket.join(groupId);
            console.log(`Người dùng ${userId} đã tham gia nhóm ${groupId}`);

            // Gửi thông báo tham gia nhóm
            const joinMessage = {
                senderId: "system",
                groupId,
                message: `Người dùng ${userId} đã tham gia nhóm`,
                timestamp: new Date().toISOString(),
            };
            io.to(groupId).emit("group-message", joinMessage);
        });

        // Gửi tin nhắn nhóm
        socket.on("group-message", ({ userId, groupId, message }) => {
            // Kiểm tra đã được thực hiện trong controller, nên bỏ kiểm tra dư thừa
            const msgPayload = {
                senderId: userId,
                groupId,
                message,
                timestamp: new Date().toISOString(),
            };

            // Gửi cho các thành viên khác
            socket.to(groupId).emit("group-message", msgPayload);
            // Gửi lại cho người gửi (hiển thị ngay trên UI)
            socket.emit("group-message", msgPayload);

            console.log(`Tin nhắn từ ${userId} đến nhóm ${groupId}: ${message}`);
        });

        // Chỉ báo đang nhập
        socket.on("typing", ({ userId, groupId }) => {
            socket.to(groupId).emit("typing", { userId });
            console.log(`Người dùng ${userId} đang nhập trong nhóm ${groupId}`);
        });

        // Rời nhóm
        socket.on("leave-group", ({ userId, groupId }) => {
            if (groupMembers.get(groupId)?.has(userId)) {
                groupMembers.get(groupId).delete(userId);
                socket.leave(groupId);
                const leaveMsg = {
                    senderId: "system",
                    groupId,
                    message: `Người dùng ${userId} đã rời nhóm`,
                    timestamp: new Date().toISOString(),
                };
                io.to(groupId).emit("group-message", leaveMsg);

                if (groupMembers.get(groupId).size === 0) {
                    groupMembers.delete(groupId);
                }
            }
        });

        // Ping server định kỳ để giữ kết nối
        socket.on("ping-server", () => {
            socket.emit("pong-server");
        });

        // Khi ngắt kết nối
        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);

                    for (const [groupId, members] of groupMembers.entries()) {
                        if (members.has(userId)) {
                            members.delete(userId);
                            const disconnectMsg = {
                                senderId: "system",
                                groupId,
                                message: `Người dùng ${userId} đã ngắt kết nối`,
                                timestamp: new Date().toISOString(),
                            };
                            io.to(groupId).emit("group-message", disconnectMsg);

                            if (members.size === 0) {
                                groupMembers.delete(groupId);
                            }
                        }
                    }

                    console.log(`Người dùng ${userId} đã ngắt kết nối`);
                    break;
                }
            }
        });
    });
}

function getIO() {
    return ioInstance;
}

function getSocketIdByUserId(userId) {
    return onlineUsers.get(userId);
}

function isUserOnline(userId) {
    return onlineUsers.has(userId);
}

function getGroupMembers(groupId) {
    return Array.from(groupMembers.get(groupId) || []);
}

function notifyNewMember(groupId, userId, userName, isLeaving = false) {
    const io = getIO();
    io.to(groupId).emit("group-message", {
        senderId: "system",
        groupId,
        message: `Người dùng ${userName || userId} đã ${isLeaving ? 'rời' : 'được thêm vào'} nhóm`,
        timestamp: new Date().toISOString(),
    });
}

module.exports = {
    setupSocketManager,
    getIO,
    getSocketIdByUserId,
    isUserOnline,
    getGroupMembers,
    notifyNewMember,
};