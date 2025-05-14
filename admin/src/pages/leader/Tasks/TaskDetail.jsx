import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

// Static teams for team name lookup
const staticTeams = [
  { id: 1, name: "Development Team" },
  { id: 2, name: "Marketing Team" },
  { id: 3, name: "Design Team" },
  { id: 4, name: "Sales Team" },
  { id: 5, name: "HR Team" },
  { id: 6, name: "Support Team" },
  { id: 7, name: "QA Team" },
  { id: 8, name: "DevOps Team" },
  { id: 9, name: "Finance Team" },
  { id: 10, name: "Product Team" },
  { id: 11, name: "Research Team" },
];

const TaskDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { task } = location.state || {};
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    setDeleteTarget(null);
    navigate(-1); // Navigate back after deletion
  };

  if (!task) {
    return (
      <div className="min-h-screen p-4">
        <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6">
          <p className="text-red-600 text-center">
            Không tìm thấy thông tin nhiệm vụ.
          </p>
        </div>
      </div>
    );
  }

  const getTeamName = (teamId) => {
    const team = staticTeams.find((t) => t.id === teamId);
    return team ? team.name : "N/A";
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Chi Tiết Nhiệm Vụ #{task.id}
          </h2>
        </div>

        {/* Task Information */}
        <div className="space-y-4">
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">
              Tên Nhiệm Vụ:
            </span>
            <span className="w-2/3 text-gray-900">{task.name || "N/A"}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Mô Tả:</span>
            <span className="w-2/3 text-gray-900">
              {task.description || "N/A"}
            </span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Trạng Thái:</span>
            <span className="w-2/3 text-gray-900">{task.status || "N/A"}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">
              Thành Viên Được Giao:
            </span>
            <span className="w-2/3 text-gray-900">
              {task.assignedMember?.name || "Chưa giao"}
            </span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Nhóm:</span>
            <span className="w-2/3 text-gray-900">
              {getTeamName(task.teamId)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(task)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa Nhiệm Vụ
          </button>
          <button
            onClick={() => navigate("/update-task", { state: { task } })}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Sửa Nhiệm Vụ
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
              <h3 className="text-lg font-semibold mb-4">
                Bạn có chắc chắn muốn xóa nhiệm vụ{" "}
                <span className="text-red-600">{deleteTarget.name}</span>?
              </h3>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
