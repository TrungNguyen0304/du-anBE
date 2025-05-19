import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, FileText } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/leader/showallProject",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (Array.isArray(response.data.projects)) {
          const formatted = response.data.projects.map((project, index) => ({
            id: project._id || `project-${index}`,
            name: project.name || "N/A",
            description: project.description || "N/A",
            deadline: project.deadline
              ? new Date(project.deadline).toLocaleDateString("vi-VN")
              : "N/A",
            status: project.status || "N/A",
            teamId: project.teamId || "N/A",
          }));
          setProjects(formatted);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dự án:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(projects.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (projects.length === 0) {
      setCurrentPage(1);
    }
  }, [projects, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(projects.length / PAGE_SIZE)) return;
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleViewReport = (id) => {
    navigate(`/project-report/${id}`);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full mx-auto">
        <p>Đang tải dữ liệu dự án...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Danh Sách Dự Án</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full table-fixed border border-gray-300 text-sm">
          <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
            <tr>
              <th className="w-[5%] px-4 py-2 border text-center">STT</th>
              <th className="w-[25%] px-4 py-2 border text-center">Tên Dự Án</th>
              <th className="w-[25%] px-4 py-2 border text-center">Mô Tả</th>
              <th className="w-[15%] px-4 py-2 border text-center">Deadline</th>
              <th className="w-[10%] px-4 py-2 border text-center">Trạng Thái</th>
              <th className="w-[20%] px-4 py-2 border text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                  Không có dữ liệu dự án.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((project, index) => {
                const globalIndex = (currentPage - 1) * PAGE_SIZE + index + 1;
                return (
                  <tr key={project.id} className="even:bg-gray-100">
                    <td className="px-4 py-2 border text-center">{globalIndex}</td>
                    <td className="px-4 py-2 border">{project.name}</td>
                    <td
                      className="px-4 py-2 border"
                      title={project.description}
                    >
                      {project.description.length > 60
                        ? `${project.description.slice(0, 60)}...`
                        : project.description}
                    </td>
                    <td className="px-4 py-2 border text-center">{project.deadline}</td>
                    <td className="px-4 py-2 border capitalize text-center">
                      {project.status}
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <NavLink
                        to={`/project-detail/${project.id}`}
                        state={{ project, index: globalIndex }}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-800"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </NavLink>

                      <button
                        onClick={() => handleViewReport(project.id)}
                        className="flex items-center px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 text-sm"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Báo cáo
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4 flex-wrap gap-2">
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
    </div>
  );
};

export default Projects;
