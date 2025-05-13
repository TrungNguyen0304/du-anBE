import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Pencil, Trash2, RotateCcw, Plus } from "lucide-react";

const ProjectAssigned = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token không tồn tại. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8001/api/company/getassigned",
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
    setSelectedProject(id);
    setActionType("delete");
    setShowModal(true);
  };

  const handleRevoke = async (id) => {
    setSelectedProject(id);
    setActionType("revoke");
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      const token = localStorage.getItem("token");
      if (actionType === "delete") {
        await axios.delete(
          `http://localhost:8001/api/company/deleteProject/${selectedProject}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(projects.filter((p) => p._id !== selectedProject));
      } else if (actionType === "revoke") {
        console.log("Thu hồi dự án với ID:", selectedProject);
        // Thêm xử lý thu hồi tại đây nếu cần
      }
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi thực hiện hành động:", error);
      setError("Không thể thực hiện hành động.");
      setShowModal(false);
    }
  };

  const cancelAction = () => {
    setShowModal(false);
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
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
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
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                  </button>
                  <button
                    onClick={() => handleEdit(project._id)}
                    className="flex items-center px-3 py-1 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex items-center px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </button>
                  <button
                    onClick={() => handleRevoke(project._id)}
                    className="flex items-center px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Thu hồi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              {actionType === "delete"
                ? "Xác nhận xóa dự án"
                : "Xác nhận thu hồi dự án"}
            </h3>
            <p>
              Bạn có chắc chắn muốn{" "}
              {actionType === "delete" ? "xóa" : "thu hồi"} dự án này không?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelAction}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAssigned;
