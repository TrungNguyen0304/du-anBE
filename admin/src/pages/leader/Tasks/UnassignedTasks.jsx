import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { ArrowLeft, Eye, Pencil, Trash2 } from "lucide-react";

// Static data for demonstration
const staticTasks = [
  {
    id: 1,
    name: "Implement Login Page",
    status: "In Progress",
    assignedMember: { id: 1, name: "Alice Smith" },
    teamId: 1,
    description: "Create a responsive login page with authentication",
  },
  {
    id: 2,
    name: "Run Social Media Campaign",
    status: "Completed",
    assignedMember: { id: 1, name: "Irene Taylor" },
    teamId: 2,
    description: "Execute a 2-week social media ad campaign",
  },
  {
    id: 3,
    name: "Database Optimization",
    status: "In Progress",
    assignedMember: { id: 4, name: "Diana Lee" },
    teamId: 1,
    description: "Optimize database queries for performance",
  },
  {
    id: 4,
    name: "Design Landing Page",
    status: "On Hold",
    assignedMember: { id: 1, name: "Noah Lee" },
    teamId: 3,
    description: "Create UI mockups for landing page",
  },
  {
    id: 5,
    name: "Write Documentation",
    status: "Pending",
    assignedMember: null,
    teamId: null,
    description: "Document API endpoints",
  },
  {
    id: 6,
    name: "Test Payment Gateway",
    status: "Pending",
    assignedMember: null,
    teamId: null,
    description: "Test integration with payment provider",
  },
  {
    id: 7,
    name: "Plan Q4 Strategy",
    status: "Pending",
    assignedMember: null,
    teamId: 2,
    description: "Outline marketing strategy for Q4",
  },
  {
    id: 8,
    name: "Update Security Protocols",
    status: "Pending",
    assignedMember: null,
    teamId: 8,
    description: "Review and update security measures",
  },
];

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

const UnassignedTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(staticTasks);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Filter unassigned tasks
  const unassignedTasks = tasks.filter((task) => task.assignedMember === null);

  // Calculate paginated tasks
  const totalPages = Math.ceil(unassignedTasks.length / PAGE_SIZE);
  const paginatedTasks = unassignedTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    // Reset to page 1 if current page exceeds total pages
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (unassignedTasks.length === 0) {
      setCurrentPage(1);
    }
  }, [unassignedTasks, currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    // Adjust pagination if current page is empty
    const totalPagesAfterDelete = Math.ceil(
      newTasks.filter((task) => task.assignedMember === null).length / PAGE_SIZE
    );
    if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
      setCurrentPage(totalPagesAfterDelete);
    }
    setDeleteTarget(null);
  };

  // Get team name by ID
  const getTeamName = (teamId) => {
    const team = staticTeams.find((t) => t.id === teamId);
    return team ? team.name : "N/A";
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Nhiệm Vụ Chưa Giao
          </h2>
          <NavLink
            to="/create-task"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm Nhiệm Vụ
          </NavLink>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
              <tr>
                <th className="w-[5%] px-4 py-2 border text-center">ID</th>
                <th className="w-[20%] px-4 py-2 border text-center">
                  Tên Nhiệm Vụ
                </th>
                <th className="w-[15%] px-4 py-2 border text-center">Nhóm</th>
                <th className="w-[15%] px-4 py-2 border text-center">
                  Trạng Thái
                </th>
                <th className="w-[30%] px-4 py-2 border text-center">Mô Tả</th>
                <th className="w-[15%] px-4 py-2 border text-center">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    Không có nhiệm vụ chưa giao
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task, index) => (
                  <tr
                    key={task.id || index}
                    className="even:bg-gray-50 text-center"
                  >
                    <td className="px-4 py-2 border">{task.id}</td>
                    <td className="px-4 py-2 border">{task.name || "N/A"}</td>
                    <td className="px-4 py-2 border">
                      {getTeamName(task.teamId)}
                    </td>
                    <td className="px-4 py-2 border">{task.status || "N/A"}</td>
                    <td className="px-4 py-2 border">
                      {task.description || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex justify-center gap-2">
                        <NavLink
                          to="/task-detail"
                          state={{ task }}
                          className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-800"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </NavLink>
                        <NavLink
                          to="/update-task"
                          state={{ task }}
                          className="flex items-center px-3 py-1 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Sửa
                        </NavLink>
                        <button
                          onClick={() => setDeleteTarget(task)}
                          className="flex items-center px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Sau
            </button>
          </div>
        )}

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
                  onClick={() => handleDelete(deleteTarget.id)}
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

export default UnassignedTasks;
