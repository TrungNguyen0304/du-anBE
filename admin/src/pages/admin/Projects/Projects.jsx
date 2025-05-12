import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token không tồn tại. Vui lòng đăng nhập lại.");
          navigate("/login"); // Redirect to login if no token
          return;
        }

        const response = await axios.get(
          "http://localhost:8001/api/company/showallProject",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Lỗi khi tải dự án:", error);
        setError("Không thể tải danh sách dự án.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleAdd = () => {
    navigate("/create-projects");
  };

  const handleEdit = (id) => {
    navigate(`/update-projects/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa dự án này?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:8001/api/company/deleteProject/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(projects.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa dự án:", error);
        setError("Không thể xóa dự án.");
      }
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

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">Chưa có dự án nào.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="border rounded-lg p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <p className="text-gray-600">
                    <span className="font-semibold text-black">Mô tả:</span>{" "}
                    {project.description}
                  </p>
                  <p className="text-gray-600">
                    <strong>Trạng thái:</strong> {project.status}
                  </p>
                  <p className="text-gray-600">
                    <strong>Ưu tiên:</strong> {project.priority}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewProjectDetail(project._id)}
                    className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => handleEdit(project._id)}
                    className="flex items-center px-3 py-1 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
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