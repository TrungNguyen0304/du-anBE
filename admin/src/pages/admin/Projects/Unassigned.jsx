import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Pencil, Trash2, Plus, UserPlus } from "lucide-react";

const Unassigned = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [assignedTeam, setAssignedTeam] = useState("");
  const [deadline, setDeadline] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(3); // Default limit from API
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
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

        const response = await axios.post(
          "https://du-anbe.onrender.com/api/company/paginationunassigned",
          { limit, page: currentPage },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(response.data.projects || []);
        setTotalPages(response.data.pages || 1);
        setTotalProjects(response.data.total || 0);
      } catch (error) {
        console.error("Lỗi khi tải dự án:", error);
        setError("Không thể tải danh sách dự án.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://du-anbe.onrender.com/api/company/showallTeam",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeams(response.data.teams || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách team:", error);
      }
    };

    fetchProjects();
    fetchTeams();
  }, [navigate, currentPage, limit]);

  const handleAdd = () => {
    navigate("/create-projects");
  };

  const handleEdit = (id) => {
    navigate(`/update-projects/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedProject(id);
    setActionType("delete");
    setShowModal(true);
  };

  const handleAssign = (id) => {
    setSelectedProject(id);
    setActionType("assign");
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      const token = localStorage.getItem("token");

      if (actionType === "delete") {
        await axios.delete(
          `https://du-anbe.onrender.com/api/company/deleteProject/${selectedProject}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(projects.filter((p) => p.id !== selectedProject));
        // Adjust pagination if necessary
        if (projects.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          setTotalProjects(totalProjects - 1);
          setTotalPages(Math.ceil((totalProjects - 1) / limit));
        }
      } else if (actionType === "assign") {
        if (!assignedTeam || !deadline) {
          alert("Vui lòng chọn team và deadline.");
          return;
        }

        await axios.put(
          `https://du-anbe.onrender.com/api/company/assignProject/${selectedProject}`,
          { assignedTeam, deadline },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/project-assigned");
      }

      setShowModal(false);
      setAssignedTeam("");
      setDeadline("");
    } catch (error) {
      console.error("Lỗi khi thực hiện hành động:", error);
      setError("Không thể thực hiện hành động.");
      setShowModal(false);
    }
  };

  const cancelAction = () => {
    setShowModal(false);
    setAssignedTeam("");
    setDeadline("");
  };

  const handleViewProjectDetail = (id) => {
    navigate(`/project-detail/${id}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setLoading(true);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
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
        <>
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                      {project.status === "revoke" && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                          Mới bị thu hồi
                        </span>
                      )}
                    </div>
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
                      onClick={() => handleViewProjectDetail(project.id)}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Xem
                    </button>
                    <button
                      onClick={() => handleEdit(project.id)}
                      className="flex items-center px-3 py-1 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex items-center px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </button>
                    <button
                      onClick={() => handleAssign(project.id)}
                      className="flex items-center gap-1 px-3 py-1 border border-green-500 text-green-600 rounded hover:bg-green-50"
                    >
                      <UserPlus size={16} /> Gán
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <p>
              Hiển thị {projects.length} / {totalProjects} dự án
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {actionType === "assign" ? (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Gán dự án cho nhóm
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Chọn nhóm:
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={assignedTeam}
                    onChange={(e) => setAssignedTeam(e.target.value)}
                  >
                    <option value="">-- Chọn nhóm --</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}{" "}
                        {team.assignedLeader
                          ? `(Trưởng: ${team.assignedLeader.name})`
                          : "(Chưa có trưởng nhóm)"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Deadline:</label>
                  <input
                    type="date"
                    className="w-full mt-1 p-2 border rounded"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  {actionType === "delete"
                    ? "Xác nhận xóa dự án"
                    : "Xác nhận thu hồi dự án"}
                </h3>
                <p>
                  Bạn có chắc chắn muốn{" "}
                  {actionType === "delete" ? "xóa" : "thu hồi"} dự án này không?
                </p>
              </>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelAction}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default Unassigned;