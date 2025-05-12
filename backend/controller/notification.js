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
// thông báo lấy lại task
const notifyTaskRemoval = async ({ userId, task }) => {
  const io = getIO();

  const title = "nhiệm vụ dã bị hu hồi";
  const body = `Thu hồi nhiệm vụ: ${task.name}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("task-removed", {
      id: task._id,
      name: task.name,
    });
    console.log(`Sent socket (task-removed) to user room: ${userId}`);
  } else {
    const user = await User.findById(userId);
    if (user?.fcmToken) {
      try {
        await sendNotification(user.fcmToken, title, body);
        console.log(`Sent FCM (task removal) to userId: ${userId}`);
      } catch (error) {
        console.error("Error sending FCM:", error.message);
      }
    } else {
      console.log("No FCM token for user.");
    }
  }
};
// thông báo khi member report 
const notifyReport = async ({ userId, task, report, member }) => {
  const io = getIO();

  const title = "Báo cáo công việc mới";
  const body = `Thành viên ${member} đã gửi báo cáo cho task: ${task.name}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("report-submitted", {
      reportId: report._id,
      taskId: task._id,
      taskName: task.name,
      member,
      submittedAt: report.createdAt,
    });
    console.log(`Sent socket to leader room: ${userId}`);
  } else {
    const user = await User.findById(userId);
    if (user?.fcmToken) {
      try {
        await sendNotification(user.fcmToken, title, body);
        console.log(`Sent FCM to offline leader with userId: ${userId}`);
      } catch (error) {
        console.error("Error sending FCM:", error.message);
      }
    } else {
      console.log("No FCM token for leader.");
    }
  }
};
// thông báo khi leader feedback
const notifyEvaluateLeader = async ({ userId, feedback, report }) => {
  const io = getIO();

  const title = "Báo cáo của bạn đã được đánh giá";
  const body = `Bạn nhận được đánh giá: ${feedback.score}/10 - ${feedback.comment}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("report-evaluated", {
      reportId: report._id,
      feedbackId: feedback._id,
      score: feedback.score,
      comment: feedback.comment,
      evaluatedAt: feedback.createdAt
    });
    console.log(`Sent socket to member room: ${userId}`);
  } else {
    const user = await User.findById(userId);
    if (user?.fcmToken) {
      try {
        await sendNotification(user.fcmToken, title, body);
        console.log(`Sent FCM to offline member with userId: ${userId}`);
      } catch (error) {
        console.error("Error sending FCM:", error.message);
      }
    } else {
      console.log("No FCM token for member.");
    }
  }
};
// thông báo khi member update status
const notifyStatusTask = async ({ userId, task, member, oldStatus }) => {
  
  const io = getIO();
  const title = "Trạng thái Nhiệm Vụ";
  const body = `Thành viên ${member} đã thay đổi trạng thái từ ${oldStatus} thành ${task.status}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("report-submitted", {
      taskId: task._id,
      taskName: task.name,
      taskStatus: task.status,
      member,
      oldStatus,
      submittedAt: new Date(),
    });
    console.log(`Sent socket to leader room: ${userId}`);
  } else {
    const user = await User.findById(userId);
    if (user?.fcmToken) {
      try {
        await sendNotification(user.fcmToken, title, body);
        console.log(`Sent FCM to offline leader with userId: ${userId}`);
      } catch (error) {
        console.error("Error sending FCM:", error.message);
      }
    } else {
      console.log("No FCM token for leader.");
    }
  }
};

module.exports = {
  notifyTeam,
  notifyProject,
  notifyProjectRemoval,
  notifyTask,
  notifyTaskRemoval,
  notifyReport,
  notifyEvaluateLeader,
  notifyStatusTask
};