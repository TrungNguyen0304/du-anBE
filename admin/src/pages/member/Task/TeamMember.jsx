import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import axios from "axios";

const PAGE_SIZE = 3;

const TeamMember = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/member/showallTeam",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (Array.isArray(response.data.teams)) {
          const formatted = response.data.teams.map((team, index) => ({
            id: team.id || `team-${index}`,
            name: team.name || "N/A",
            assignedLeader: team.assignedLeader || "Chưa có trưởng nhóm",
            assignedMembers: Array.isArray(team.assignedMembers)
              ? team.assignedMembers.map((member) => member.name)
              : [],
          }));
          setTeams(formatted);
        } else {
          setTeams([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách đội nhóm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const totalPages = Math.ceil(teams.length / PAGE_SIZE);
  const paginatedTeams = teams.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (id) => {
    navigate(`/team-detail/${id}`);
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>
        <h2 className="text-2xl font-bold">Đội Nhóm Dự Án</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : paginatedTeams.length === 0 ? (
        <p className="text-gray-500">Không có đội nhóm nào.</p>
      ) : (
        <div className="space-y-4">
          {paginatedTeams.map((team, index) => (
            <div
              key={team.id}
              className="border rounded-lg p-4 hover:shadow transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <div className="text-sm text-gray-500">
                    #{(currentPage - 1) * PAGE_SIZE + index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">
                    <strong>Tên đội:</strong> {team.name}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Trưởng nhóm:</strong> {team.assignedLeader}
                  </p>
                  <p className="text-gray-600">
                    <strong>Thành viên:</strong>{" "}
                    {team.assignedMembers.length > 0
                      ? team.assignedMembers.join(", ")
                      : "Không có thành viên"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleView(team.id)}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-base"
                  >
                    <Eye className="w-5 h-5 mr-2" />
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

export default TeamMember;
