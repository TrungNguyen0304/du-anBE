const { use } = require("passport");
const user = require("../models/user")
const bcrypt = require("bcrypt");
const Team = require("../models/team");

// thêm sửa xóa , show sắp xếp, phân trang leader và member
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new user({
            name,
            email,
            password: hashedPassword,
            role: role || "member"
        });

        await newEmployee.save();

        res.status(201).json({
            message: "Tạo nhân viên thành công.",
            user: {
                id: newEmployee._id,
                name: newEmployee.name,
                email: newEmployee.email,
                role: newEmployee.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const existingUser = await user.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        if (email && email !== existingUser.email) {
            const emailTaken = await user.findOne({ email });
            if (emailTaken && emailTaken._id.toString() !== id) {
                return res.status(400).json({ message: "Email đã được sử dụng bởi người dùng khác." });
            }
            existingUser.email = email;
        }
        if (name) {
            existingUser.name = name;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.password = hashedPassword;
        }
        if (role) {
            existingUser.role = role;
        }

        await existingUser.save();
        res.status(200).json({
            message: "Cập nhật nhân viên thành công.",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
}
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm user theo id
        const existingUser = await user.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "Nhân viên không tồn tại." });
        }

        // Xóa nhân viên
        await user.findByIdAndDelete(id);

        res.status(200).json({
            message: "Xóa nhân viên thành công.",
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const showAllLeaders = async (req, res) => {
    try {
        // Lấy giá trị sort và order từ query, mặc định sort theo name tăng dần
        const sortField = req.query.sort || 'name';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;

        // Tạo object để sort
        const sortOptions = {};
        sortOptions[sortField] = sortOrder;

        // Lấy tất cả users có role = leader và sắp xếp
        const leaders = await user.find({ role: "leader" }).sort(sortOptions);

        if (leaders.length === 0) {
            return res.status(404).json({ message: "Không có leader nào." });
        }

        // Trả về danh sách leaders
        res.status(200).json({
            message: "Lấy danh sách leader thành công.",
            leaders: leaders.map(leader => ({
                id: leader._id,
                name: leader.name,
                email: leader.email,
                role: leader.role
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const showAllMember = async (req, res) => {
    try {
        // Lấy giá trị sort và order từ query, mặc định sort theo name tăng dần
        const sortField = req.query.sort || 'name';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;

        // Tạo object để sort
        const sortOptions = {};
        sortOptions[sortField] = sortOrder;

        // Lấy tất cả users có role = member và sắp xếp
        const members = await user.find({ role: "member" }).sort(sortOptions);

        if (members.length === 0) {
            return res.status(404).json({ message: "Không có member nào." });
        }

        // Trả về danh sách members
        res.status(200).json({
            message: "Lấy danh sách member thành công.",
            members: members.map(member => ({
                id: member._id,
                name: member.name,
                email: member.email,
                role: member.role
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const paginationLeader = async (req, res) => {
    try {
        const { limit = 3, page = 1 } = req.body;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const offset = (parsedPage - 1) * parsedLimit;

        // Query leader có phân trang
        const [leaders, total] = await Promise.all([
            user.find({ role: "leader" }).skip(offset).limit(parsedLimit),
            user.countDocuments({ role: "leader" })
        ]);

        if (leaders.length === 0) {
            return res.status(404).json({ message: "Không có leader nào." });
        }

        const pages = Math.ceil(total / parsedLimit);

        res.status(200).json({
            message: "Lấy danh sách leader phân trang thành công.",
            leaders: leaders.map(leader => ({
                id: leader._id,
                name: leader.name,
                email: leader.email,
                role: leader.role
            })),
            total,
            page: parsedPage,
            offset,
            limit: parsedLimit,
            pages
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const paginationMember = async (req, res) => {
    try {
        const { limit = 3, page = 1 } = req.body;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const offset = (parsedPage - 1) * parsedLimit;

        // Query member có phân trang
        const [members, total] = await Promise.all([
            user.find({ role: "member" }).skip(offset).limit(parsedLimit),
            user.countDocuments({ role: "member" })
        ]);

        if (members.length === 0) {
            return res.status(404).json({ message: "Không có member nào." });
        }

        const pages = Math.ceil(total / parsedLimit);

        res.status(200).json({
            message: "Lấy danh sách member phân trang thành công.",
            members: members.map(member => ({
                id: member._id,
                name: member.name,
                email: member.email,
                role: member.role
            })),
            total,
            page: parsedPage,
            offset,
            limit: parsedLimit,
            pages
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
//

// thêm sửa xóa leader và member vào taem
const createTeam = async (req, res) => {
    try {
        const { name, assignedLeader, assignedMembers } = req.body;

        if (!name || !assignedLeader || !assignedMembers || !Array.isArray(assignedMembers)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc (name, assignedLeader, assignedMembers phải là mảng)." });
        }

        // Kiểm tra leader
        const leader = await user.findById(assignedLeader);
        if (!leader || leader.role !== "leader") {
            return res.status(400).json({ message: "Leader không hợp lệ." });
        }

        // Kiểm tra tất cả các member
        const members = await user.find({ _id: { $in: assignedMembers }, role: "member" });

        if (members.length !== assignedMembers.length) {
            return res.status(400).json({ message: "Một hoặc nhiều member không hợp lệ." });
        }

        // Tạo team mới
        const newTeam = new Team({
            name,
            assignedLeader: assignedLeader,
            assignedMembers: assignedMembers
        });

        await newTeam.save();
        const populatedTeam = await Team.findById(newTeam._id)
            .populate('assignedLeader', 'id name') // Lấy id và name của leader
            .populate('assignedMembers', 'id name'); // Lấy id và name của members


        res.status(201).json({
            message: "Tạo team thành công.",
            team: {
                id: populatedTeam._id,
                name: populatedTeam.name,
                assignedLeader: populatedTeam.assignedLeader,
                assignedMembers: populatedTeam.assignedMembers
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;  // Lấy id từ params
        const { name, assignedLeader, assignedMembers } = req.body;

        // Kiểm tra thông tin bắt buộc
        if (!name && !assignedLeader && !assignedMembers) {
            return res.status(400).json({ message: "Cần ít nhất một thông tin để cập nhật." });
        }

        // Kiểm tra leader
        if (assignedLeader) {
            const leader = await user.findById(assignedLeader);
            if (!leader || leader.role !== "leader") {
                return res.status(400).json({ message: "Leader không hợp lệ." });
            }
        }

        // Kiểm tra các member
        if (assignedMembers) {
            const members = await user.find({ _id: { $in: assignedMembers }, role: "member" });
            if (members.length !== assignedMembers.length) {
                return res.status(400).json({ message: "Một hoặc nhiều thành viên không hợp lệ." });
            }
        }

        // Tạo object chứa dữ liệu cần cập nhật
        const updateData = {};

        if (name) updateData.name = name;
        if (assignedLeader) updateData.assignedLeader = assignedLeader;
        if (assignedMembers) updateData.assignedMembers = assignedMembers;

        // Cập nhật team
        const updatedTeam = await Team.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedTeam) {
            return res.status(404).json({ message: "Team không tồn tại." });
        }

        res.status(200).json({
            message: "Cập nhật team thành công.",
            team: {
                id: updatedTeam._id,
                name: updatedTeam.name,
                assignedLeader: updatedTeam.assignedLeader,
                assignedMembers: updatedTeam.assignedMembers
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const showallTeam = async (req, res) => {
    try {
        const sortField = req.query.sort || 'name';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;

        // Tạo object để sort
        const sortOptions = {};
        sortOptions[sortField] = sortOrder;


        const teams = await Team.find().sort(sortOptions).lean();

        if (teams.length === 0) {
            return res.status(404).json({ message: "Không có công việc nào." });
        }

        res.status(200).json({
            message: "Danh sách Team",
            teams: teams.map(team => ({
                _id: team._id,
                name: team.name,
                assignedLeader: team.assignedLeader,
                assignedMembers: team.assignedMembers,
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
const paginationTeam = async (req, res) => {
    try {
        const { limit = 3, page = 1 } = req.body;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const offset = (parsedPage - 1) * parsedLimit;

        // Query leader có phân trang
        const [teams, total] = await Promise.all([
            Team.find().skip(offset).limit(parsedLimit),
            Team.countDocuments()
        ]);

        if (teams.length === 0) {
            return res.status(404).json({ message: "Không có team nào." });
        }

        const pages = Math.ceil(total / parsedLimit);

        res.status(200).json({
            message: "Lấy danh sách team phân trang thành công.",
            teams: teams.map(team => ({
                id: team._id,
                name: team.name,
                assignedLeader: team.assignedLeader,
                assignedMembers: team.assignedMembers
            })),
            total,
            page: parsedPage,
            offset,
            limit: parsedLimit,
            pages
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm team theo id
        const existingTeam = await Team.findById(id);
        if (!existingTeam) {
            return res.status(404).json({ message: "Team không tồn tại." });
        }

        // Xóa Team
        await Team.findByIdAndDelete(id);

        res.status(200).json({
            message: "Xóa Team thành công.",
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
//


module.exports = {
    createUser,
    updateUser,
    deleteUser,
    showAllLeaders,
    showAllMember,
    paginationLeader,
    paginationMember,
    createTeam,
    updateTeam,
    showallTeam,
    deleteTeam,
    paginationTeam
};