
let ioInstance;
const onlineUsers = new Map();

function setupSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("user-online", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(` User ${userId} online - joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
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


module.exports = {
  setupSocket,
  getIO,
  getSocketIdByUserId,
  isUserOnline,

};