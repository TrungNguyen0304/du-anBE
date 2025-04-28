const mongoose = require("mongoose");
const Team = require("../models/team");

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

module.exports = {
  getMyTeam
};
