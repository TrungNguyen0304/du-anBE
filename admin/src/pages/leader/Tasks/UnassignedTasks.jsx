import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Trash2, Pencil } from "lucide-react";
import { MdAddTask } from "react-icons/md";
import axios from "axios";

const PAGE_SIZE = 3;

const UnassignedTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get(
          "https://du-anbe.onrender.com/api/leader/unassignedTask",
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
            assignedMember: task.assignedMember || null,
            deadline: task.deadline
              ? new Date(task.deadline).toLocaleDateString("vi-VN")
              : "N/A",
            status: task.status || "N/A",
            priority: task.priority || 0,
          }));
          setTasks(formatted);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải nhiệm vụ:", error);
        alert("Không thể tải danh sách nhiệm vụ.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTasks();
  }, []);

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setIsModalOpen(false);
  };

  const openDeleteModal = (id) => {
    setSelectedTaskId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTaskId(null);
    setIsModalOpen(false);
  };

  const handleView = (id) => {
    navigate(`/task-detail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/update-task/${id}`);
  };

  const handleAssign = (id) => {
    navigate(`/assign-task/${id}`);
  };

  const handleCreateTask = () => {
    navigate("/create-task");
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Nhiệm Vụ Chưa Giao</h2>
          <button
            onClick={handleCreateTask}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <MdAddTask className="w-5 h-5 mr-2" />
            Thêm dự án
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : paginatedTasks.length === 0 ? (
        <p className="text-gray-500">Không có nhiệm vụ nào chưa giao.</p>
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
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleView(task.id)}
                    className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                  </button>
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="flex items-center px-3 py-1 border border-yellow-500 text-yellow-600 rounded hover:bg-yellow-50 text-sm"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Sửa
                  </button>
                  <button
                    onClick={() => openDeleteModal(task.id)}
                    className="flex items-center px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </button>
                  <button
                    onClick={() => handleAssign(task.id)}
                    className="flex items-center px-3 py-1 border border-green-500 text-green-600 rounded hover:bg-green-50 text-sm"
                  >
                    <MdAddTask className="w-4 h-4 mr-1" />
                    Giao nhiệm vụ
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Xác nhận xóa nhiệm vụ?
            </h3>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(selectedTaskId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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

export default UnassignedTasks;
