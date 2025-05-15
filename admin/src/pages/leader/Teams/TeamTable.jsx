import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Eye } from "lucide-react";
import axios from "axios";

const TeamTable = ({ title = "Danh Sách Nhóm", originPage = "team" }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/leader/showallTeam",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (Array.isArray(response.data.teams)) {
          const formattedTeams = response.data.teams.map((team, index) => ({
            id: team.id || `team-${index}`,
            name: team.name || "N/A",
            leader: team.assignedLeader || "N/A",
            memberCount: team.assignedMembers ? team.assignedMembers.length : 0,
            members: team.assignedMembers
              ? team.assignedMembers.map((memberName, idx) => ({
                  id: `member-${index}-${idx}`, // Tạo ID tạm thời vì API không cung cấp
                  name: memberName || "N/A",
                }))
              : [],
          }));
          setTeams(formattedTeams);
        } else {
          setTeams([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Lỗi khi lấy dữ liệu nhóm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(teams.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (teams.length === 0) {
      setCurrentPage(1);
    }
  }, [teams, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(teams.length / PAGE_SIZE);
  const paginatedTeams = teams.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full mx-auto">
        <p>Đang tải dữ liệu nhóm...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full table-fixed border border-gray-300 text-sm">
          <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
            <tr>
              <th className="w-[10%] px-4 py-2 border text-center">STT</th>
              <th className="w-[25%] px-4 py-2 border text-center">Tên Nhóm</th>
              <th className="w-[25%] px-4 py-2 border text-center">
                Trưởng Nhóm
              </th>
              <th className="w-[20%] px-4 py-2 border text-center">
                Số Thành Viên
              </th>
              <th className="w-[20%] px-4 py-2 border text-center">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTeams.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                  Không có dữ liệu nhóm.
                </td>
              </tr>
            ) : (
              paginatedTeams.map((team, index) => {
                const globalIndex = (currentPage - 1) * PAGE_SIZE + index + 1;
                return (
                  <tr key={team.id} className="even:bg-gray-100 text-center">
                    <td className="px-4 py-2 border">{globalIndex}</td>
                    <td className="px-4 py-2 border">{team.name}</td>
                    <td className="px-4 py-2 border">{team.leader}</td>
                    <td className="px-4 py-2 border">{team.memberCount}</td>
                    <td className="px-4 py-2 border">
                      <NavLink
                        to="/team-detail"
                        state={{ team, index: globalIndex, originPage }}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-800"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </NavLink>
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

export default TeamTable;
