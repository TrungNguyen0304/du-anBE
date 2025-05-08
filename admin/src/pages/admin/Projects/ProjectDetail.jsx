import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Đây là dữ liệu mẫu. Trong thực tế sẽ lấy dữ liệu từ server.
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

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = dummyProjects.find((p) => p.id === parseInt(id));

  useEffect(() => {
    if (!project) {
      alert("Dự án không tồn tại!");
      navigate("/projects");
    }
  }, [project, navigate]);

  if (!project) {
    return (
      <div className="text-center mt-10 text-red-600">Dự án không tồn tại.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Chi Tiết Dự Án</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Tên Dự Án</h3>
          <p className="text-gray-600">{project.name}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Mô Tả</h3>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Người Phụ Trách</h3>
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
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default ProjectDetail;
