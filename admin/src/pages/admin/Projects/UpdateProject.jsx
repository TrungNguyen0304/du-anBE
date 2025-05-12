import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const dummyProjects = [
  {
    id: 1,
    name: "Dự án Quản lý Website",
    description: "Xây dựng hệ thống website công ty.",
    leader: "Nguyễn Văn A",
    members: ["Trần Thị B", "Lê Văn C"],
    department: "Phòng Kỹ Thuật",
  },
  {
    id: 2,
    name: "Ứng dụng Mobile ABC",
    description: "Phát triển ứng dụng mobile cho khách hàng.",
    leader: "Phạm Thị D",
    members: ["Nguyễn Văn B", "Trần Thị E"],
    department: "Phòng Phát Triển",
  },
];

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = dummyProjects.find((p) => p.id === parseInt(id));

  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [leader, setLeader] = useState(project?.leader || "");
  const [members, setMembers] = useState(project?.members.join(", ") || "");
  const [department, setDepartment] = useState(project?.department || "");

  useEffect(() => {
    if (!project) {
      alert("Dự án không tồn tại!");
      navigate("/projects");
    }
  }, [project, navigate]);

  const handleUpdate = () => {
    alert("Dự án đã được cập nhật!");
    navigate("/projects");
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Dự Án</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">
            Tên Dự Án
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700">
            Mô Tả
          </label>
          <textarea
            id="description"
            className="w-full p-2 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="leader" className="block text-gray-700">
            Leader
          </label>
          <input
            type="text"
            id="leader"
            className="w-full p-2 border border-gray-300 rounded"
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="members" className="block text-gray-700">
            Nhân Viên
          </label>
          <input
            type="text"
            id="members"
            className="w-full p-2 border border-gray-300 rounded"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="department" className="block text-gray-700">
            Phòng Ban
          </label>
          <input
            type="text"
            id="department"
            className="w-full p-2 border border-gray-300 rounded"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Hủy
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Cập Nhật
        </button>
      </div>
    </div>
  );
};

export default UpdateProject;
