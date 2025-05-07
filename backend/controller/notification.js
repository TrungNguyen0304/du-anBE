const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project")
const { getIO, getSocketIdByUserId, isUserOnline } = require("../socket/socketHandler");
const { sendNotification } = require("../utils/firebase-admin");

// thông báo được mời vào taem
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
// thông báo gán project vào taem
const notifyProject = async ({ userId, project }) => {
  const io = getIO();

  const title = " Có dự án mới mới";
  const body = `Bạn được giao: ${project.name}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("project-assigned", {
      id: project._id,
      name: project.name,
      description: project.description,
      deadline: project.deadline,
      status: project.status,
    });
    console.log(`Sent socket to user room: ${userId}`);
  } else {
    const user = await User.findById(userId);
    if (user?.fcmToken) {
      try {
        await sendNotification(user.fcmToken, title, body);
        console.log("Sent FCM to offline user");
      } catch (error) {
        console.error("Error sending FCM:", error.message);
      }
    } else {
      console.log("No FCM token for user.");
    }
  }
};
// thong báo lấy lại dự án
const notifyProjectRemoval = async ({ userId, project }) => {
  const io = getIO();

  const title = "Dự án dã bị hu hồi";
  const body = `Thu hồi dự án: ${project.name}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("project-removed", {
      id: project._id,
      name: project.name,
    });
    console.log(`Sent socket (project-removed) to user room: ${userId}`);
  } else {
    const user = await User.findById(userId);
    if (user?.fcmToken) {
      try {
        await sendNotification(user.fcmToken, title, body);
        console.log(`Sent FCM (project removal) to userId: ${userId}`);
      } catch (error) {
        console.error("Error sending FCM:", error.message);
      }
    } else {
      console.log("No FCM token for user.");
    }
  }
};
// thông báo cho member được gán task
const notifyTask = async ({ userId, task }) => {
  const io = getIO();

  const title = " ban mới được giao task";
  const body = `nhiệm vụ của bạn: ${task.name}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("task-assigned", {
      id: task._id,
      name: task.name,
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

module.exports = { notifyTeam, notifyProject,notifyProjectRemoval,notifyTask};