import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Projects = () => {
  const [projects, setProjects] = useState(dummyProjects);
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/create-projects");
  };

  const handleEdit = (id) => {
    navigate(`/update-projects/${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa dự án này?");
    if (confirmDelete) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleViewProjectDetail = (id) => {
    navigate(`/project-detail/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản Lý Dự Án</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Thêm Dự Án
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">Chưa có dự án nào.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <p className="text-gray-600">{project.description}</p>
                  <p className="text-gray-600">
                    <strong>Leader:</strong> {project.leader}
                  </p>
                  <p className="text-gray-600">
                    <strong>Nhân viên:</strong> {project.members.join(", ")}
                  </p>
                  <p className="text-gray-600">
                    <strong>Phòng ban:</strong> {project.department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewProjectDetail(project.id)}
                    className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => handleEdit(project.id)}
                    className="flex items-center px-3 py-1 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
