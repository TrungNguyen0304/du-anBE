import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import axios from "axios";

const PAGE_SIZE = 3;

const TaskMember = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://du-anbe.onrender.com/api/member/showallTask",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (Array.isArray(response.data.tasks)) {
          const formatted = response.data.tasks.map((task, index) => ({
            id: task._id || `task-${index}`,
            name: task.name || "N/A",
            description: task.description || "N/A",
            status: task.status || "N/A",
            priority: task.priority || 0,
            deadline: task.deadline
              ? new Date(task.deadline).toLocaleDateString("vi-VN")
              : "N/A",
            projectId: task.projectId || "N/A",
          }));
          setTasks(formatted);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhiệm vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (id) => {
    navigate(`/task-detail/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>
        <h2 className="text-2xl font-bold">Nhiệm Vụ Thành Viên</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : paginatedTasks.length === 0 ? (
        <p className="text-gray-500">Không có nhiệm vụ nào.</p>
      ) : (
        <div className="space-y-4">
          {paginatedTasks.map((task, index) => (
            <div
              key={task.id}
              className="border rounded-lg p-4 hover:shadow transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <div className="text-sm text-gray-500">
                    #{(currentPage - 1) * PAGE_SIZE + index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">
                    <strong>Nhiệm vụ:</strong> {task.name}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Mô tả:</strong> {task.description}
                  </p>
                  <p className="text-gray-600">
                    <strong>Trạng thái:</strong> {task.status}
                  </p>
                  <p className="text-gray-600">
                    <strong>Độ ưu tiên:</strong> {task.priority}
                  </p>
                  <p className="text-gray-600">
                    <strong>Hạn chót:</strong> {task.deadline}
                  </p>
                  <p className="text-gray-600">
                    <strong>Mã dự án:</strong> {task.projectId}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleView(task.id)}
                    className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end mt-6 space-x-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-3 py-1 mb-2 border rounded ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskMember;
