import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, RotateCcw, Trash2, Pencil } from "lucide-react";
import axios from "axios";

const AssignedTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3;

  const [confirmAction, setConfirmAction] = useState(null); // "delete" | "revoke"
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get(
          "https://du-anbe.onrender.com/api/leader/getAssignedTask",
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
            progress: task.progress || 0,
          }));
          setTasks(formatted);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải nhiệm vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTasks();
  }, []);

  const assignedTasks = tasks.filter((task) => task.assignedMember !== null);
  const totalPages = Math.ceil(assignedTasks.length / PAGE_SIZE);
  const paginatedTasks = assignedTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (assignedTasks.length === 0) {
      setCurrentPage(1);
    }
  }, [assignedTasks, currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://du-anbe.onrender.com/api/leader/deleteTask/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa nhiệm vụ:", error);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await axios.put(
        `https://du-anbe.onrender.com/api/leader/revokeTask/${id}/revoke`, // endpoint đúng
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, assignedMember: null } : task
        )
      );
      alert("Đã thu hồi nhiệm vụ thành công.");
    } catch (error) {
      console.error("Lỗi thu hồi:", error);
      alert("Thu hồi nhiệm vụ thất bại.");
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/task-detail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/update-task/${id}`);
  };

  const openConfirmModal = (actionType, taskId) => {
    setSelectedTaskId(taskId);
    setConfirmAction(actionType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction === "delete") {
      handleDelete(selectedTaskId);
    } else if (confirmAction === "revoke") {
      handleRevoke(selectedTaskId);
    }
    closeModal();
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>
        <h2 className="text-2xl font-bold">Nhiệm Vụ Đã Giao</h2>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu nhiệm vụ...</p>
      ) : paginatedTasks.length === 0 ? (
        <p className="text-gray-500">Chưa có nhiệm vụ nào được giao.</p>
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
                    <strong>Giao cho:</strong>{" "}
                    {task.assignedMember?.name || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Deadline:</strong> {task.deadline}
                  </p>
                  <p className="text-gray-600">
                    <strong>Trạng thái:</strong> {task.status}
                  </p>
                  <p className="text-gray-600">
                    <strong>Tiến độ:</strong> {task.progress}%
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleViewDetail(task.id)}
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
                    onClick={() => openConfirmModal("delete", task.id)}
                    className="flex items-center px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </button>
                  <button
                    onClick={() => openConfirmModal("revoke", task.id)}
                    className="flex items-center px-3 py-1 border border-purple-500 text-purple-600 rounded hover:bg-purple-50 text-sm"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6 space-x-2 flex-wrap">
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => handlePageChange(page + 1)}
              className={`px-3 py-1 mb-2 border rounded ${
                currentPage === page + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {page + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal xác nhận */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {confirmAction === "delete"
                ? "Xác nhận xóa nhiệm vụ?"
                : "Xác nhận thu hồi nhiệm vụ?"}
            </h3>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
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

export default AssignedTasks;
