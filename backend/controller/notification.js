const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project")
const { sendNotification } = require("../utils/firebase-admin");
const { getIO, getSocketIdByUserId, isUserOnline } = require("../socket/socketHandler");

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
// thông báo khi report cho company
const notifyReportCompany = async ({ userId, project, report, leader }) => {
  const io = getIO();

  const title = "Báo cáo công việc mới";
  const body = `Thành viên ${leader} đã gửi báo cáo cho project: ${project.name}`;

  if (isUserOnline(userId)) {
    io.to(userId).emit("report-submitted", {
      reportId: report._id,
      projectId: project._id,
      projectName: project.name,
      leader,
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
// thông váo khi đánh giá report từ leader
const notifyEvaluateCompany = async ({ userId, feedback, report }) => {
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
// gửi thông báo khi trễ deadline 
const notifyTaskOverdue = async ({ userId, task }) => {
  const io = getIO();
  const title = "Task trễ deadline";
  const body = `Task "${task.name}" của bạn đã trễ deadline!`;
  const userIdStr = String(userId);

  try {
    if (isUserOnline(userIdStr)) {
      io.to(userIdStr).emit("task-overdue", {
        id: task._id,
        name: task.name,
        deadline: task.deadline,
        status: task.status,
        message: body,
      });
      console.log(`Sent socket notification to user: ${userIdStr}`);
    } else {
      const user = await User.findById(userIdStr);
      if (user?.fcmToken) {
        await sendNotification(user.fcmToken, title, body);
        console.log(`Sent FCM notification to offline user: ${userIdStr}`);
      } else {
        console.log(`No FCM token found for user: ${userIdStr}`);
      }
    }
  } catch (error) {
    console.error(`Error in notifyTaskOverdue for user ${userIdStr}:`, error.message);
  }
};
const notifyProjectOverdue = async ({ project }) => {
  const io = getIO();
  const title = "Dự án trễ hạn chót";
  const body = `Dự án Team bạn đang làm "${project.name}" đã trễ hạn chót!`;

  try {
    const team = await Team.findById(project.assignedTeam); // Bỏ populate
    if (!team || !team.assignedLeader) {
      console.log(`Không tìm thấy Team hoặc leader cho dự án: ${project._id}`);
      return;
    }

    const leaderId = String(team.assignedLeader); // team.assignedLeader là ObjectId

    if (!leaderId || leaderId === "null" || leaderId === "undefined") {
      console.log(`Không có leader hợp lệ để thông báo cho dự án: ${project._id}`);
      return;
    }

    if (isUserOnline(leaderId)) {
      io.to(leaderId).emit("project-overdue", {
        id: project._id,
        name: project.name,
        deadline: project.deadline,
        status: project.status,
        message: body,
      });
      console.log(`Đã gửi thông báo socket tới leader: ${leaderId}`);
    } else {
      const user = await User.findById(leaderId);
      if (user?.fcmToken) {
        await sendNotification(user.fcmToken, title, body);
        console.log(`Đã gửi thông báo FCM tới leader offline: ${leaderId}`);
      } else {
        console.log(`Không tìm thấy FCM token cho leader: ${leaderId}`);
      }
    }
  } catch (error) {
    console.error(`Lỗi trong notifyProjectOverdue cho dự án ${project._id}:`, error.message);
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
  notifyStatusTask,
  notifyReportCompany,
  notifyEvaluateCompany,
  notifyTaskOverdue,
  notifyProjectOverdue
};