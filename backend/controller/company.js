const { use } = require("passport");
const user = require("../models/user")
const bcrypt = require("bcrypt");
const Team = require("../models/team");
const { notifyTeam, notifyProject, notifyProjectRemoval } = require("../controller/notification");
const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");

// thêm sửa xóa , show sắp xếp, phân trang leader và member
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, gender, dateOfBirth, phoneNumber, address } = req.body;

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
            role: role || "member",
            gender,
            dateOfBirth,
            phoneNumber,
            address
        });

        await newEmployee.save();

        res.status(201).json({
            message: "Tạo nhân viên thành công.",
            user: {
                id: newEmployee._id,
                name: newEmployee.name,
                email: newEmployee.email,
                role: newEmployee.role,
                gender: newEmployee.gender,
                dateOfBirth: newEmployee.dateOfBirth,
                phoneNumber: newEmployee.phoneNumber,
                address: newEmployee.address
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, gender, dateOfBirth, phoneNumber, address } = req.body;

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
        if (gender) {
            existingUser.gender = gender;
        }
        if (dateOfBirth) {
            existingUser.dateOfBirth = dateOfBirth;
        }
        if (phoneNumber) {
            existingUser.phoneNumber = phoneNumber;
        }
        if (address) {
            existingUser.address = address;
        }

        await existingUser.save();
        res.status(200).json({
            message: "Cập nhật nhân viên thành công.",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                gender: existingUser.gender,
                dateOfBirth: existingUser.dateOfBirth,
                phoneNumber: existingUser.phoneNumber,
                address: existingUser.address,
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
                role: leader.role,
                gender: leader.gender,
                dateOfBirth: leader.dateOfBirth,
                phoneNumber: leader.phoneNumber,
                address: leader.address,
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
                role: member.role,
                gender: member.gender,
                dateOfBirth: member.dateOfBirth,
                phoneNumber: member.phoneNumber,
                address: member.address,
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
                role: leader.role,
                gender: leader.gender,
                dateOfBirth: leader.dateOfBirth,
                phoneNumber: leader.phoneNumber,
                address: leader.address,
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
                role: member.role,
                gender: member.gender,
                dateOfBirth: member.dateOfBirth,
                phoneNumber: member.phoneNumber,
                address: member.address,
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
const viewMember = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // Tìm các team mà user là thành viên
        const teams = await Team.find({ assignedMembers: id }).select("name");
        // Tìm các task được gán cho user
        const tasks = await Task.find({ assignedMember: id }).select("name description ")

        res.status(200).json({
            message: `Thông tin người dùng ${user.name}`,
            user,
            teams,
            tasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const viewLeader = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // Tìm các team mà user là thành viên
        const teams = await Team.find({ assignedLeader: id }).select("name");
        // Lấy danh sách teamId
        const teamIds = teams.map(team => team._id);
        // Tìm các project được gán cho user
        const projects = await Project.find({ assignedTeam: { $in: teamIds } }).select("name description");

        res.status(200).json({
            message: `Thông tin người dùng ${user.name}`,
            user,
            teams,
            projects,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// thêm sửa xóa leader và member vào team
const createTeam = async (req, res) => {
    try {
        const { name, description, assignedLeader, assignedMembers } = req.body;

        if (!name || !assignedLeader || !assignedMembers || !Array.isArray(assignedMembers)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc (name, assignedLeader, assignedMembers phải là mảng)." });
        }

        // Kiểm tra leader
        const leader = await user.findById(assignedLeader);
        if (!leader || leader.role !== "leader") {
            return res.status(400).json({ message: "Leader không hợp lệ." }); s
        }
        // Kiểm tra leader đã được gán vào team nào chưa
        const existingTeam = await Team.findOne({ assignedLeader });
        if (existingTeam) {
            return res.status(400).json({ message: "Leader đã được gán vào một team khác." });
        }

        // Kiểm tra tất cả các member
        const members = await user.find({ _id: { $in: assignedMembers }, role: "member" });

        if (members.length !== assignedMembers.length) {
            return res.status(400).json({ message: "Một hoặc nhiều member không hợp lệ." });
        }

        // Tạo team mới
        const newTeam = new Team({
            name,
            description,
            assignedLeader: assignedLeader,
            assignedMembers: assignedMembers
        });

        await newTeam.save();
        // Gửi thông báo cho leader và các members
        await notifyTeam({ userId: assignedLeader, team: newTeam });
        for (const member of assignedMembers) {
            await notifyTeam({ userId: member, team: newTeam });
        }

        const populatedTeam = await Team.findById(newTeam._id)
            .populate('assignedLeader', 'id name')
            .populate('assignedMembers', 'id name');
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
        const { name, assignedLeader, assignedMembers, description } = req.body;

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
        if (description) updateData.description = description;
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
                description: updatedTeam.description,
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
        const teams = await Team.find().sort(sortOptions)
            .populate('assignedLeader', 'name')
            .populate('assignedMembers', 'name')
            .lean();

        if (teams.length === 0) {
            return res.status(404).json({ message: "Không có công việc nào." });
        }

        res.status(200).json({
            message: "Danh sách Team",
            teams: teams.map(team => ({
                _id: team._id,
                name: team.name,
                description: team.description,
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
                description: team.description,
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

// thêm sửa xóa project và phân sắp xếp, phân trang, và gán project cho team
const createProject = async (req, res) => {
    try {
        const { name, description, status, priority } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Thiếu tiêu đề công việc." });
        }

        const allowedStatuses = ["pending", "in_progress", "completed", "cancelled"];
        const allowedPriorities = [1, 2, 3];
        const projectStatus = allowedStatuses.includes(status) ? status : "pending";
        const projectPriority = allowedPriorities.includes(priority) ? priority : 2;

        const newProject = new Project({
            name,
            description,
            status: projectStatus,
            priority: projectPriority,
        });

        await newProject.save();

        res.status(201).json({
            message: "Tạo công việc thành công.",
            project: {
                _id: newProject._id,
                name: newProject.name,
                description: newProject.description,
                status: newProject.status,
                priority: newProject.priority,
                notes: newProject.notes
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status, priority } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Công việc không tồn tại." });
        }
        if (name) {
            project.name = name;
        }
        if (description) {
            project.description = description;
        }
        if (status) {
            const allowedStatuses = ["pending", "in_progress", "completed", "cancelled"];
            if (allowedStatuses.includes(status)) {
                project.status = status;
            } else {
                return res.status(400).json({ message: "Trạng thái không hợp lệ." });
            }
        }
        if (priority) {
            project.priority = priority;
        }

        // Lưu công việc đã được cập nhật
        await project.save();

        res.status(200).json({
            message: "Cập nhật công việc thành công.",
            project: {
                _id: project._id,
                name: project.name,
                description: project.description,
                status: project.status,
                priority: project.priority,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const showallProject = async (req, res) => {
    try {
        const sortOption = req.query.sort;

        let sortCriteria = {};

        if (sortOption === "name_asc") {
            sortCriteria = { name: 1 };
        } else if (sortOption === "name_desc") {
            sortCriteria = { name: -1 };
        } else if (sortOption === "priority_asc") {
            sortCriteria = { priority: 1 };
        } else if (sortOption === "priority_desc") {
            sortCriteria = { priority: -1 }; // Low -> High
        }


        const projects = await Project.find().sort(sortCriteria).lean();

        if (projects.length === 0) {
            return res.status(404).json({ message: "Không có dự án nào." });
        }

        res.status(200).json({
            message: "Danh sách công việc",
            sortBy: sortOption || "none",
            projects: projects.map(project => ({
                _id: project._id,
                name: project.name,
                description: project.description,
                status: project.status,
                priority: project.priority,
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params

        const project = await Project.findById(id)
        if (!project) {
            res.status(404).json({ message: "Công việc không tồn tại" })
        }
        await Project.findByIdAndDelete(id);
        res.status(200).json({
            message: "Xóa công việc thành công.",
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const paginationProject = async (req, res) => {
    try {
        const { limit = 3, page = 3 } = req.body;

        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const offset = (parsedPage - 1) * parsedLimit;

        const [docs, total] = await Promise.all([
            Project.find().skip(offset).limit(parsedLimit),
            Project.countDocuments()
        ]);

        const pages = Math.ceil(total / parsedLimit);

        res.status(200).json({
            message: "Lấy danh sách dự án phân trang thành công.",
            docs: docs.map(project => ({
                id: project._id,
                name: project.name,
                description: project.description,
                status: project.status,
                priority: project.priority
            }
            )),
            total,
            limit: parsedLimit,
            offset,
            page: parsedPage,
            pages
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const assignProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTeam, deadline } = req.body;

        if (!assignedTeam || !deadline) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc (assignedTeam, deadline)." });
        }

        // Tìm project
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Công việc không tồn tại." });
        }

        // Tìm nhân viên
        const team = await Team.findById(assignedTeam);
        if (!team) {
            return res.status(404).json({ message: "Nhân viên không hợp lệ." });
        }
        const assignedLeader = team.assignedLeader;
        if (!assignedLeader) {
            return res.status(400).json({ message: "Nhóm chưa có trưởng nhóm để thông báo." });
        }


        // Gán thông tin
        project.assignedTeam = assignedTeam;
        project.deadline = deadline;
        project.status = "pending";

        await project.save();

        await notifyProject({ userId: assignedLeader.toString(), project });

        res.status(200).json({
            message: "Gán công việc thành công.",
            project: {
                id: project._id,
                name: project.name,
                assignedTeam: {
                    id: team._id,
                    name: team.name
                },
                deadline: project.deadline,
                status: project.status
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const viewTeamProject = async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findById(id);
        if (!team) {
            return res.status(404).json({ message: "Team không hợp lệ." });
        }

        const project = await Project.find({ assignedTeam: id })
            .populate({
                path: 'assignedTeam',
                select: 'name assignedLeader assignedMembers',
                populate: [
                    { path: 'assignedLeader', select: 'name' },
                    { path: 'assignedMembers', select: 'name' }
                ]
            })
            .populate('assignedLeader', 'name')
            .populate('assignedMembers', 'name');

        res.status(200).json({
            message: `Danh sách công việc của team ${team.name}`,
            project
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
// lấy lại dự án 
const revokeProjectAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Không tìm thấy project." });
        }

        // Nếu project chưa được gán team thì không cần thu hồi
        if (!project.assignedTeam) {
            return res.status(400).json({ message: "Project chưa được gán cho team nào." });
        }

        // Lưu lại thông tin team cũ để gửi thông báo nếu cần
        const oldTeam = await Team.findById(project.assignedTeam);
        const oldLeader = oldTeam?.assignedLeader;

        // Reset project assignment
        project.assignedTeam = null;
        project.deadline = null;
        project.status = "pending";

        await project.save();

        // Gửi thông báo cho leader cũ (nếu có)
        if (oldLeader) {
            await notifyProjectRemoval({
                userId: oldLeader.toString(),
                project: oldTeam
            });
        }

        res.status(200).json({
            message: "Thu hồi dự án thành công.",
            project: {
                id: project._id,
                name: project.name,
                assignedTeam: null,
                deadline: null,
                status: project.status
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
// lấy ra công việc chk giao
const getUnassignedProject = async (req, res) => {
    try {
        const sortOption = req.query.sort;
        let sortCriteria = {};

        // Xác định tiêu chí sắp xếp
        if (sortOption === "name_asc") {
            sortCriteria = { name: 1 };
        } else if (sortOption === "name_desc") {
            sortCriteria = { name: -1 };
        } else if (sortOption === "priority_asc") {
            sortCriteria = { priority: 1 };
        } else if (sortOption === "priority_desc") {
            sortCriteria = { priority: -1 };
        }

        // Tìm project chưa được giao
        const projects = await Project.find({
            $or: [
                { assignedTeam: { $exists: false } },
                { assignedTeam: null }
            ]
        }).sort(sortCriteria).lean();

        res.status(200).json({
            message: "Danh sách công việc chưa được giao.",
            sortBy: sortOption || "none",
            projects
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const paginationUnassignedProject = async (req, res) => {
    try {
        const { limit = 3, page = 1 } = req.body;

        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const offset = (parsedPage - 1) * parsedLimit;

        const filter = {
            $or: [
                { assignedTeam: { $exists: false } },
                { assignedTeam: null }
            ]
        };

        const [docs, total] = await Promise.all([
            Project.find(filter).skip(offset).limit(parsedLimit),
            Project.countDocuments(filter)
        ]);

        const pages = Math.ceil(total / parsedLimit);

        res.status(200).json({
            message: "Phân trang dự án chưa được giao thành công.",
            projects: docs.map(project => ({
                id: project._id,
                name: project.name,
                description: project.description,
                status: project.status,
                priority: project.priority,
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
// lấy ra dự án đã được giao
const getAssignedProjects = async (req, res) => {
    try {
        const sortOption = req.query.sort;
        let sortCriteria = {};

        // Xác định tiêu chí sắp xếp
        if (sortOption === "name_asc") {
            sortCriteria = { name: 1 };
        } else if (sortOption === "name_desc") {
            sortCriteria = { name: -1 };
        } else if (sortOption === "priority_asc") {
            sortCriteria = { priority: 1 };
        } else if (sortOption === "priority_desc") {
            sortCriteria = { priority: -1 };
        }

        const projects = await Project.find({ assignedTeam: { $ne: null } })
            .sort(sortCriteria)
            .populate("assignedTeam", "name");


        res.status(200).json({
            message: "Danh sách dự án đã được giao cho team.",
            sortBy: sortOption || "none",
            projects
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
const paginationAssignedProjects = async (req, res) => {
    try {
        const { limit = 3, page = 1 } = req.body;

        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const offset = (parsedPage - 1) * parsedLimit;

        const filter = {
            assignedTeam: { $ne: null }
        };

        const [docs, total] = await Promise.all([
            Project.find(filter).skip(offset).limit(parsedLimit).populate('assignedTeam', 'name'),
            Project.countDocuments(filter)
        ]);

        const pages = Math.ceil(total / parsedLimit);

        res.status(200).json({
            message: "Phân trang công việc chưa được giao thành công.",
            projects: docs.map(project => ({
                id: project._id,
                name: project.name,
                description: project.description,
                status: project.status,
                priority: project.priority,
                notes: project.notes,
                assignedTeam: project.assignedTeam
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
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    showAllLeaders,
    showAllMember,
    paginationLeader,
    paginationMember,
    viewMember,
    viewLeader,
    createTeam,
    updateTeam,
    showallTeam,
    deleteTeam,
    paginationTeam,
    createProject,
    updateProject,
    showallProject,
    deleteProject,
    paginationProject,
    assignProject,
    viewTeamProject,
    getUnassignedProject,
    paginationUnassignedProject,
    getAssignedProjects,
    paginationAssignedProjects,
    revokeProjectAssignment,
};