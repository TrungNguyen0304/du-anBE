const mongoose = require("mongoose");
const Team = require("../models/team");
const Project = require("../models/project")

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
// const viewAssignedProject = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Tìm các team mà user là trưởng nhóm
//     const teams = await Team.find({ assignedLeader: userId }).select("_id");

//     if (!teams.length) {
//       return res.status(404).json({ message: "Bạn chưa là trưởng nhóm của nhóm nào." });
//     }

//     const teamIds = teams.map(team => team._id);

//     // Tìm các project có assignedTeam là 1 trong các team mà user là leader
//     const projects = await Project.find({ assignedTeam: { $in: teamIds } });

//     if (!projects.length) {
//       return res.status(404).json({ message: "Không có nhiệm vụ nào được giao cho nhóm bạn phụ trách." });
//     }

//     res.status(200).json({
//       message: "Danh sách nhiệm vụ nhóm bạn phụ trách:",
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

const viewAssignedProject = async (req, res) => {
  try {
    const userId = req.user._id;

    // Tìm tất cả team mà user là leader hoặc là member
    const teams = await Team.find({
      $or: [
        { assignedLeader: userId },
        { assignedMembers: userId }
      ]
    }).select("_id");

    if (!teams.length) {
      return res.status(404).json({ message: "Bạn không thuộc nhóm nào được giao nhiệm vụ." });
    }

    const teamIds = teams.map(team => team._id);

    // Tìm các project được giao cho các team đó
    const projects = await Project.find({ assignedTeam: { $in: teamIds } });

    if (!projects.length) {
      return res.status(404).json({ message: "Không có nhiệm vụ nào được giao cho nhóm của bạn." });
    }

    res.status(200).json({
      message: "Danh sách nhiệm vụ của nhóm bạn:",
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
module.exports = {
  getMyTeam,
  viewAssignedProject
};
