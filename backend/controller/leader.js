const mongoose = require("mongoose");
const Team = require("../models/team");
const Project = require("../models/project")
const Task = require("../models/task")
const getMyTeam = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Tìm tất cả nhóm mà userId có trong assignedLeader
    const teams = await Team.find({ assignedLeader: userId })
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
// xem dự án company giao
const viewAssignedProject = async (req, res) => {
  try {
    const userId = req.user._id;

    // Tìm các team mà user là trưởng nhóm
    const teams = await Team.find({ assignedLeader: userId }).select("_id");

    if (!teams.length) {
      return res.status(404).json({ message: "Bạn chưa là trưởng nhóm của nhóm nào." });
    }

    const teamIds = teams.map(team => team._id);

    // Tìm các project có assignedTeam là 1 trong các team mà user là leader
    const projects = await Project.find({ assignedTeam: { $in: teamIds } });

    if (!projects.length) {
      return res.status(404).json({ message: "Không có nhiệm vụ nào được giao cho nhóm bạn phụ trách." });
    }

    res.status(200).json({
      message: "Danh sách nhiệm vụ nhóm bạn phụ trách:",
      projects: projects.map(project => ({
        id: project._id,
        name: project.name,
        description: project.description,
        deadline: project.deadline,
        status: project.status,
        teamId: project.assignedTeam
      }))
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách project:", error);
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
// const viewAssignedProject = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Tìm tất cả team mà user là leader hoặc là member
//     const teams = await Team.find({
//       $or: [
//         { assignedLeader: userId },
//         { assignedMembers: userId }
//       ]
//     }).select("_id");

//     if (!teams.length) {
//       return res.status(404).json({ message: "Bạn không thuộc nhóm nào được giao nhiệm vụ." });
//     }

//     const teamIds = teams.map(team => team._id);

//     // Tìm các project được giao cho các team đó
//     const projects = await Project.find({ assignedTeam: { $in: teamIds } });

//     if (!projects.length) {
//       return res.status(404).json({ message: "Không có nhiệm vụ nào được giao cho nhóm của bạn." });
//     }

//     res.status(200).json({
//       message: "Danh sách nhiệm vụ của nhóm bạn:",
//       projects: projects.map(project => ({
//         id: project._id,
//         name: project.name,
//         description: project.description,
//         deadline: project.deadline,
//         status: project.status,
//         teamId: project.assignedTeam
//       }))
//     });
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách project:", error);
//     res.status(500).json({ message: "Lỗi server.", error: error.message });
//   }
// };

// thêm sửa xóa task

const createTask = async (req, res) => {
  try {
    const { name, description, status, projectId, priority } = req.body;
    const userId = req.user._id; 

    if (!name || !projectId) {
      return res.status(400).json({ message: "Thiếu tên task hoặc projectId." });
    }

    // 1. Kiểm tra project tồn tại
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy project." });
    }

    // 2. Kiểm tra project đã được gán team chưa
    if (!project.assignedTeam) {
      return res.status(400).json({ message: "Project chưa được gán cho team nào." });
    }

    // 3. Lấy team và kiểm tra leader
    const team = await Team.findById(project.assignedTeam);
    if (!team || team.assignedLeader.toString() !== userId.toString()) {
      return res.status(403).json({ message: "bạn không có quyền tạo task" });
    }

    // 4. Tạo task
    const allowedStatuses = ["pending", "in_progress", "completed", "cancelled"];
    const allowedPriorities = [1, 2, 3];
    const taskStatus = allowedStatuses.includes(status) ? status : "pending";
    const taskPriority = allowedPriorities.includes(priority) ? priority : 2;

    const newTask = new Task({
      name,
      description,
      status: taskStatus,
      projectId: projectId,
      priority: taskPriority,
    });

    await newTask.save();

    res.status(201).json({
      message: "Tạo task thành công.",
      task: {
        _id: newTask._id,
        name: newTask.name,
        description: newTask.description,
        status: newTask.status,
        projectId: newTask.projectId,
        priority: newTask.priority
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, priority } = req.body;
    const userId = req.user._id;

    // 1. Tìm task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy task." });
    }

    // 2. Tìm project liên quan tới task
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy project." });
    }

    // 3. Kiểm tra project có assignedTeam chưa
    if (!project.assignedTeam) {
      return res.status(400).json({ message: "Project chưa được gán cho team nào." });
    }

    // 4. Kiểm tra user có phải là leader không
    const team = await Team.findById(project.assignedTeam);
    if (!team || team.assignedLeader.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật task này." });
    }

    // 5. Cập nhật các trường nếu có
    const allowedStatuses = ["pending", "in_progress", "completed", "cancelled"];
    const allowedPriorities = [1, 2, 3];

    if (name !== undefined) task.name = name;
    if (description !== undefined) task.description = description;
    if (status !== undefined && allowedStatuses.includes(status)) task.status = status;
    if (priority !== undefined && allowedPriorities.includes(priority)) task.priority = priority;

    await task.save();

    res.status(200).json({
      message: "Cập nhật task thành công.",
      task: {
        _id: task._id,
        name: task.name,
        description: task.description,
        status: task.status,
        project: task.project,
        priority: task.priority
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)
    if (!task) {
      res.status(404).json({ message: "Công việc không tồn tại" })
    }
    await Task.findByIdAndDelete(id);
    
    res.status(200).json({
      message: "Xóa công việc thành công.",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const showAllTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // 1. Kiểm tra projectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "projectId không hợp lệ." });
    }

    // 2. Tìm project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy project." });
    }

    // 3. Kiểm tra project đã được gán team chưa
    if (!project.assignedTeam) {
      return res.status(400).json({ message: "Project chưa được gán cho team nào." });
    }

    // 4. Kiểm tra user có phải là leader của team không
    const team = await Team.findById(project.assignedTeam);
    if (!team || team.assignedLeader.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền xem các task của project này." });
    }

    // 5. Lấy tất cả task thuộc project
    const tasks = await Task.find({ project: projectId });

    res.status(200).json({
      message: "Lấy danh sách task thành công.",
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports = {
  getMyTeam,
  viewAssignedProject,
  createTask,
  updateTask,
  deleteTask,
  showAllTasks
};
