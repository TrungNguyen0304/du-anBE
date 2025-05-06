const mongoose = require("mongoose");
const Team = require("../models/team");
const Task = require("../models/task")
const Project = require("../models/project")

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

module.exports = {
  getMyTeam,
  getMyTasks
};
