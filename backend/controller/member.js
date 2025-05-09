const mongoose = require("mongoose");
const Team = require("../models/team");
const Task = require("../models/task")
const Project = require("../models/project")
const user = require("../models/user")
const Report = require("../models/report");
const { notifyReport } = require("../controller/notification");

const getMyTeam = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Tìm tất cả nhóm mà userId có trong assignedMembers
    const teams = await Team.find({ assignedMembers: userId })
      .populate('assignedLeader', 'name')  
      .populate('assignedMembers', 'name'); 

    if (teams.length === 0) {
      return res.status(404).json({ message: "Bạn không tham gia vào nhóm nào." });
    }

    // Trả về thông tin các nhóm mà người dùng tham gia
    res.status(200).json({
      message: "Lấy thông tin nhóm thành công.",
      teams: teams.map(team => ({
        id: team._id,
        name: team.name,
        assignedLeader: team.assignedLeader ? team.assignedLeader.name : null,
        assignedMembers: team.assignedMembers.map(member => member.name)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Lấy tất cả task của user
    const tasks = await Task.find({ assignedMember: userId }).lean();

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Bạn chưa được giao task nào." });
    }

    // Lấy danh sách projectId liên quan
    const projectIds = tasks.map(task => task.projectId);
    const validProjects = await Project.find({
      _id: { $in: projectIds },
      assignedTeam: { $ne: null } // chỉ giữ lại project còn được gán cho team
    }).select('_id');

    const validProjectIds = validProjects.map(p => p._id.toString());

    // Lọc task theo project còn hợp lệ
    const filteredTasks = tasks.filter(task => validProjectIds.includes(task.projectId?.toString()));

    if (filteredTasks.length === 0) {
      return res.status(404).json({ message: "Bạn chưa được giao task nào." });
    }

    res.status(200).json({
      message: "Lấy danh sách task của bạn thành công.",
      tasks: filteredTasks.map(task => ({
        id: task._id,
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        projectId: task.projectId
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const createReport = async (req, res) => {
  try {
    const { taskId, content, taskProgress, difficulties, feedback } = req.body;
    const userId = req.user._id;

    if (!taskId || !content || !taskProgress) {
      return res
        .status(400)
        .json({ message: "Thiếu taskId, nội dung hoặc tiến độ công việc." });
    }

    const task = await Task.findById(taskId).populate({
      path: 'projectId',
      populate: {
        path: 'assignedTeam',
        model: 'Team',
        populate: {
          path: 'assignedLeader',
          model: 'User'
        }
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy công việc." });
    }

    if (String(task.assignedMember) !== String(userId)) {
      return res.status(403).json({ message: "Bạn không được giao công việc này." });
    }

    const team = task.projectId?.assignedTeam;
    const assignedLeader = team?.assignedLeader;

    if (!team || !assignedLeader) {
      return res.status(400).json({ message: "Không tìm thấy team hoặc leader." });
    }

    const report = new Report({
      assignedMember: userId,
      content,
      difficulties,
      taskProgress,
      task: taskId,
      team: team._id,
      assignedLeader: assignedLeader._id,
      feedback
    });

    await report.save();

    await notifyReport({
      userId: assignedLeader._id.toString(),
      task,
      report,
      member: req.user.name || 'Thành viên' // fallback nếu thiếu tên
    });

    res.status(201).json({
      message: "Gửi báo cáo thành công.",
      report
    });

  } catch (error) {
    console.error("createReport error:", error);
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

const showAllFeedback = async (req, res) => {
  try {
    const userId = req.user._id;

    // Tìm tất cả báo cáo của member kèm feedback
    const reports = await Report.find({ assignedMember: userId })
      .populate({
        path: 'feedback',
        model: 'Feedback'
      })
      .populate({
        path: 'task',
        select: 'name'
      })
      .sort({ createdAt: -1 }); // Mới nhất trước

    // Lọc ra những báo cáo đã có feedback
    const feedbacks = reports
      .filter(r => r.feedback)
      .map(r => ({
        reportId: r._id,
        taskName: r.task?.name || 'Không rõ',
        feedbackId: r.feedback._id,
        comment: r.feedback.comment,
        score: r.feedback.score,
        from: r.feedback.from,
        createdAt: r.feedback.createdAt
      }));

    res.status(200).json({
      message: "Lấy danh sách đánh giá thành công.",
      feedbacks
    });

  } catch (error) {
    console.error("showAllFeedback error:", error);
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};


module.exports = {
  getMyTeam,
  getMyTasks,
  createReport,
  showAllFeedback
};
