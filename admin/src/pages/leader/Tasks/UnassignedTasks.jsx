import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Trash2, Pencil } from "lucide-react";
import { MdAddTask } from "react-icons/md";
import axios from "axios";

const PAGE_SIZE = 5;

const UnassignedTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedDeadline, setSelectedDeadline] = useState("");
  const [assignError, setAssignError] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://du-anbe.onrender.com/api/leader/unassignedTask",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const formatted = response.data.tasks?.map((task, i) => ({
          id: task._id,
          name: task.name || "N/A",
          description: task.description || "N/A",
          status: task.status || "Chưa rõ",
          priority: task.priority ?? 0,
          deadline: task.deadline
            ? new Date(task.deadline).toLocaleDateString("vi-VN")
            : "Chưa đặt",
        }));
        setTasks(formatted || []);
      } catch (error) {
        alert("Không thể tải danh sách nhiệm vụ.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Fetch members from showallTeam API when opening assign modal
  const openAssignModal = async (taskId) => {
    setSelectedTaskId(taskId);
    setIsAssignModalOpen(true);
    setAssignError("");
    setSelectedMemberId("");
    setSelectedDeadline("");
    try {
      const res = await axios.get(
        "http://localhost:8001/api/leader/showallTeam",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Extract assignedMembers from all teams and flatten into a single array
      const allMembers = res.data.teams.flatMap((team) => team.assignedMembers);
      setMembers(allMembers || []);
    } catch (error) {
      setAssignError("Không thể tải danh sách thành viên.");
    }
  };

  const handleAssign = async () => {
    if (!selectedMemberId) {
      setAssignError("Vui lòng chọn một thành viên.");
      return;
    }
    if (!selectedDeadline) {
      setAssignError("Vui lòng chọn ngày hết hạn.");
      return;
    }

    setIsAssigning(true);
    try {
      const response = await axios.post(
        `http://localhost:8001/api/leader/assignTask/${selectedTaskId}`,
        {
          memberId: selectedMemberId,
          deadline: selectedDeadline,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks((prev) => prev.filter((t) => t.id !== selectedTaskId));
      setIsAssignModalOpen(false);
      setSelectedMemberId("");
      setSelectedDeadline("");
      alert(response.data.message || "Gán nhiệm vụ thành công!");
    } catch (error) {
      setAssignError(
        error.response?.data?.message || "Không thể giao nhiệm vụ."
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `https://du-anbe.onrender.com/api/leader/deleteTask/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      setDeleteError("Không thể xóa nhiệm vụ.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex-1">
            Danh sách nhiệm vụ chưa giao
          </h2>
          <button
            onClick={() => navigate("/create-task")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow transition"
          >
            <MdAddTask className="mr-2 text-xl" />
            Thêm nhiệm vụ
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-100 text-blue-700 text-base">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Tên</th>
                <th className="px-4 py-3 text-left font-semibold">Mô tả</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left font-semibold">Ưu tiên</th>
                <th className="px-4 py-3 text-left font-semibold">Deadline</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-lg text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginatedTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-gray-400 text-lg"
                  >
                    Không có nhiệm vụ chưa giao.
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task, idx) => (
                  <tr
                    key={task.id}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">{task.name}</td>
                    <td className="px-4 py-3">{task.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          task.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          task.priority === 3
                            ? "bg-red-100 text-red-700"
                            : task.priority === 2
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority === 3
                          ? "Cao"
                          : task.priority === 2
                          ? "Trung bình"
                          : "Thấp"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{task.deadline}</td>

                    <td className="px-4 py-3 flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/task-detail/${task.id}`)}
                        title="Xem chi tiết"
                        className="p-2 rounded hover:bg-blue-100 group"
                      >
                        <Eye className="w-5 h-5 text-blue-500" />
                      </button>
                      <button
                        onClick={() => navigate(`/update-task/${task.id}`)}
                        title="Sửa"
                        className="p-2 rounded hover:bg-yellow-100 group"
                      >
                        <Pencil className="w-5 h-5 text-yellow-500" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsModalOpen(true);
                        }}
                        title="Xóa"
                        className="p-2 rounded hover:bg-red-100 group"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                      <button
                        onClick={() => openAssignModal(task.id)}
                        title="Giao nhiệm vụ"
                        className="p-2 rounded hover:bg-green-100 group"
                      >
                        <MdAddTask className="w-5 h-5 text-green-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-4 py-2 rounded-lg border font-medium ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 max-w-full">
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
                Xác nhận xóa nhiệm vụ
              </h3>
              {deleteError && (
                <p className="text-sm text-red-500 mb-3 text-center">
                  {deleteError}
                </p>
              )}
              <p className="text-center text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa nhiệm vụ này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(selectedTaskId)}
                  disabled={isDeleting}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  {isDeleting ? "Đang xóa..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] max-w-full">
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
                Giao nhiệm vụ
              </h3>
              {assignError && (
                <p className="text-sm text-red-500 text-center mb-2">
                  {assignError}
                </p>
              )}
              <select
                className="w-full border p-2 rounded mb-4"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                <option value="">-- Chọn thành viên --</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="deadline"
                id="deadline"
                className="w-full border p-2 rounded mb-4"
                value={selectedDeadline}
                onChange={(e) => setSelectedDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-5 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAssign}
                  disabled={isAssigning}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {isAssigning ? "Đang giao..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnassignedTasks;
