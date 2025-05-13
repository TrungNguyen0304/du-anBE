import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Pencil, Trash2, UserPlus, X, CheckCircle } from "lucide-react";

const Unassigned = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // {type, id}
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
          "http://localhost:8001/api/company/unassigned",
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

  const handleAction = async () => {
    const { type, id } = confirmAction;
    const token = localStorage.getItem("token");

    try {
      if (type === "delete") {
        await axios.delete(
          `http://localhost:8001/api/company/deleteProject/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(projects.filter((p) => p._id !== id));
      } else if (type === "assign") {
        await axios.post(
          `http://localhost:8001/api/company/assignProject/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(projects.filter((p) => p._id !== id));
      } else if (type === "view") {
        navigate(`/project-detail/${id}`);
      } else if (type === "edit") {
        navigate(`/update-projects/${id}`);
      }
    } catch (err) {
      console.error(`Lỗi khi thực hiện ${type}:`, err);
      setError(`Không thể thực hiện hành động ${type}.`);
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dự Án Chưa Gán</h2>
        <button
          onClick={() => navigate("/create-projects")}
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
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      setConfirmAction({ type: "view", id: project._id })
                    }
                    className="flex items-center gap-1 px-3 py-1 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
                  >
                    <Eye size={16} /> Xem
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({ type: "edit", id: project._id })
                    }
                    className="flex items-center gap-1 px-3 py-1 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50"
                  >
                    <Pencil size={16} /> Sửa
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({ type: "delete", id: project._id })
                    }
                    className="flex items-center gap-1 px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({ type: "assign", id: project._id })
                    }
                    className="flex items-center gap-1 px-3 py-1 border border-green-500 text-green-600 rounded hover:bg-green-50"
                  >
                    <UserPlus size={16} /> Gán
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal xác nhận */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <p className="mb-4 text-lg font-medium">
              Xác nhận hành động{" "}
              <strong className="capitalize">
                {
                  {
                    delete: "xóa",
                    assign: "gán",
                    edit: "sửa",
                    view: "xem chi tiết",
                  }[confirmAction.type]
                }
              </strong>{" "}
              cho dự án này?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-100"
              >
                <X size={16} /> Hủy
              </button>
              <button
                onClick={handleAction}
                className={`flex items-center gap-1 px-4 py-2 text-white rounded ${
                  confirmAction.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction.type === "assign"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <CheckCircle size={16} /> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Unassigned;
