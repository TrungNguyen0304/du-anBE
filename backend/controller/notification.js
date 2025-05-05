const User = require("../models/user");
const Team = require("../models/team");
const { getIO, getSocketIdByUserId, isUserOnline } = require("../socket/socketHandler");
const { sendNotification } = require("../utils/firebase-admin");


const notifyTeam = async ({ userId, team }) => {
  const io = getIO();

  const title = " ban đã được thêm vào nhóm";
  const body = `Bạn được thêm vào nhóm: ${team.name}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("team-assigned", {
      id: team._id,
      name: team.name,
    });
    console.log(`Sent socket to user room: ${userId}`);
  } else {
    const user = await User.findById(userId);
    if (user?.fcmToken) {
      try {
        await sendNotification(user.fcmToken, title, body);
        console.log(`Sent FCM to offline user with userId: ${userId}`);
      } catch (error) {
        console.error("Error sending FCM:", error.message);
      }
    } else {
      console.log("No FCM token for user.");
    }
  }
};


module.exports = { notifyTeam };