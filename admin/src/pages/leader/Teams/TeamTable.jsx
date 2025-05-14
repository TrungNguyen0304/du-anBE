import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

// Static data for demonstration
const staticTeams = [
  {
    id: 1,
    name: "Development Team",
    leader: "John Doe",
    memberCount: 8,
    status: "Active",
    createdDate: "2024-01-15",
    members: [
      {
        id: 1,
        name: "Alice Smith",
        projects: [
          {
            id: 1,
            name: "Website Redesign",
            description: "Revamp company website UI",
          },
          {
            id: 2,
            name: "API Integration",
            description: "Integrate third-party APIs",
          },
        ],
      },
      {
        id: 2,
        name: "Bob Johnson",
        projects: [
          {
            id: 3,
            name: "Mobile App",
            description: "Develop mobile application",
          },
        ],
      },
      { id: 3, name: "Charlie Brown", projects: [] },
      {
        id: 4,
        name: "Diana Lee",
        projects: [
          {
            id: 4,
            name: "Database Migration",
            description: "Migrate to new DB system",
          },
        ],
      },
      { id: 5, name: "Evan Davis", projects: [] },
      { id: 6, name: "Fiona Clark", projects: [] },
      { id: 7, name: "George Wilson", projects: [] },
      { id: 8, name: "Hannah Adams", projects: [] },
    ],
  },
  {
    id: 2,
    name: "Marketing Team",
    leader: "Jane Smith",
    memberCount: 5,
    status: "Active",
    createdDate: "2024-03-22",
    members: [
      {
        id: 1,
        name: "Irene Taylor",
        projects: [
          {
            id: 5,
            name: "Ad Campaign",
            description: "Launch social media ads",
          },
        ],
      },
      { id: 2, name: "Jack White", projects: [] },
      { id: 3, name: "Kelly Green", projects: [] },
      { id: 4, name: "Liam Brown", projects: [] },
      { id: 5, name: "Mia Harris", projects: [] },
    ],
  },
  {
    id: 3,
    name: "Design Team",
    leader: "Alice Johnson",
    memberCount: 6,
    status: "Inactive",
    createdDate: "2024-02-10",
    members: [
      { id: 1, name: "Noah Lee", projects: [] },
      { id: 2, name: "Olivia Clark", projects: [] },
      { id: 3, name: "Peter Davis", projects: [] },
      { id: 4, name: "Quinn Wilson", projects: [] },
      { id: 5, name: "Rachel Adams", projects: [] },
      { id: 6, name: "Sam Taylor", projects: [] },
    ],
  },
  {
    id: 4,
    name: "Sales Team",
    leader: "Bob Wilson",
    memberCount: 10,
    status: "Active",
    createdDate: "2024-04-05",
    members: [
      { id: 1, name: "Tom Harris", projects: [] },
      { id: 2, name: "Uma Lee", projects: [] },
      { id: 3, name: "Vince Brown", projects: [] },
      { id: 4, name: "Wendy Clark", projects: [] },
      { id: 5, name: "Xander Davis", projects: [] },
      { id: 6, name: "Yara Wilson", projects: [] },
      { id: 7, name: "Zoe Adams", projects: [] },
      { id: 8, name: "Aaron Taylor", projects: [] },
      { id: 9, name: "Bella Green", projects: [] },
      { id: 10, name: "Cody White", projects: [] },
    ],
  },
  {
    id: 5,
    name: "HR Team",
    leader: "Emma Brown",
    memberCount: 4,
    status: "Active",
    createdDate: "2024-01-30",
    members: [
      { id: 1, name: "Dylan Smith", projects: [] },
      { id: 2, name: "Ella Johnson", projects: [] },
      { id: 3, name: "Finn Lee", projects: [] },
      { id: 4, name: "Gina Clark", projects: [] },
    ],
  },
  {
    id: 6,
    name: "Support Team",
    leader: "Mike Davis",
    memberCount: 7,
    status: "Inactive",
    createdDate: "2024-05-12",
    members: [
      { id: 1, name: "Henry Wilson", projects: [] },
      { id: 2, name: "Isla Adams", projects: [] },
      { id: 3, name: "Jake Taylor", projects: [] },
      { id: 4, name: "Kara Green", projects: [] },
      { id: 5, name: "Leo White", projects: [] },
      { id: 6, name: "Mila Harris", projects: [] },
      { id: 7, name: "Nate Brown", projects: [] },
    ],
  },
  {
    id: 7,
    name: "QA Team",
    leader: "Sarah Lee",
    memberCount: 6,
    status: "Active",
    createdDate: "2024-03-18",
    members: [
      { id: 1, name: "Oliver Clark", projects: [] },
      { id: 2, name: "Penny Davis", projects: [] },
      { id: 3, name: "Quincy Wilson", projects: [] },
      { id: 4, name: "Rita Adams", projects: [] },
      { id: 5, name: "Steve Taylor", projects: [] },
      { id: 6, name: "Tina Green", projects: [] },
    ],
  },
  {
    id: 8,
    name: "DevOps Team",
    leader: "Tom Clark",
    memberCount: 5,
    status: "Active",
    createdDate: "2024-02-25",
    members: [
      { id: 1, name: "Uma White", projects: [] },
      { id: 2, name: "Vince Harris", projects: [] },
      { id: 3, name: "Wendy Brown", projects: [] },
      { id: 4, name: "Xander Lee", projects: [] },
      { id: 5, name: "Yara Smith", projects: [] },
    ],
  },
  {
    id: 9,
    name: "Finance Team",
    leader: "Laura Adams",
    memberCount: 3,
    status: "Active",
    createdDate: "2024-04-20",
    members: [
      { id: 1, name: "Zoe Johnson", projects: [] },
      { id: 2, name: "Aaron Clark", projects: [] },
      { id: 3, name: "Bella Davis", projects: [] },
    ],
  },
  {
    id: 10,
    name: "Product Team",
    leader: "Chris Evans",
    memberCount: 9,
    status: "Active",
    createdDate: "2024-01-08",
    members: [
      { id: 1, name: "Cody Wilson", projects: [] },
      { id: 2, name: "Dylan Adams", projects: [] },
      { id: 3, name: "Ella Taylor", projects: [] },
      { id: 4, name: "Finn Green", projects: [] },
      { id: 5, name: "Gina White", projects: [] },
      { id: 6, name: "Henry Harris", projects: [] },
      { id: 7, name: "Isla Brown", projects: [] },
      { id: 8, name: "Jake Lee", projects: [] },
      { id: 9, name: "Kara Smith", projects: [] },
    ],
  },
  {
    id: 11,
    name: "Research Team",
    leader: "Olivia Green",
    memberCount: 4,
    status: "Inactive",
    createdDate: "2024-05-01",
    members: [
      { id: 1, name: "Leo Johnson", projects: [] },
      { id: 2, name: "Mila Clark", projects: [] },
      { id: 3, name: "Nate Davis", projects: [] },
      { id: 4, name: "Penny Wilson", projects: [] },
    ],
  },
];

const TeamTable = ({
  title = "Danh Sách Nhóm",
  createLink = "/create-team",
  originPage = "team",
}) => {
  const [teams, setTeams] = useState(staticTeams);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    // Reset to page 1 if the current page exceeds total pages after teams change
    const totalPages = Math.ceil(teams.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (teams.length === 0) {
      setCurrentPage(1);
    }
  }, [teams, currentPage]);

  const handleDelete = (id) => {
    const newTeams = teams.filter((team) => team.id !== id);
    setTeams(newTeams);
    // If the current page is empty after deletion, go to the previous page
    const totalPages = Math.ceil(newTeams.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
    setDeleteTarget(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate paginated teams
  const totalPages = Math.ceil(teams.length / PAGE_SIZE);
  const paginatedTeams = teams.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <NavLink
          to={createLink}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm
        </NavLink>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full table-fixed border border-gray-300 text-sm">
          <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
            <tr>
              <th className="w-[5%] px-4 py-2 border text-center">ID</th>
              <th className="w-[20%] px-4 py-2 border text-center">Tên Nhóm</th>
              <th className="w-[15%] px-4 py-2 border text-center">
                Trưởng Nhóm
              </th>
              <th className="w-[10%] px-4 py-2 border text-center">
                Số Thành Viên
              </th>
              <th className="w-[10%] px-4 py-2 border text-center">
                Trạng Thái
              </th>
              <th className="w-[15%] px-4 py-2 border text-center">Ngày Tạo</th>
              <th className="w-[25%] px-4 py-2 border text-center">
                Chức Năng
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTeams.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedTeams.map((team, index) => {
                const formattedDate =
                  team.createdDate && !isNaN(Date.parse(team.createdDate))
                    ? new Date(team.createdDate).toLocaleDateString("vi-VN")
                    : "";

                const globalIndex = (currentPage - 1) * PAGE_SIZE + index + 1;

                return (
                  <tr
                    key={team.id || index}
                    className="even:bg-gray-100 text-center"
                  >
                    <td className="px-4 py-2 border">{globalIndex}</td>
                    <td className="px-4 py-2 border">{team.name || ""}</td>
                    <td className="px-4 py-2 border">{team.leader || ""}</td>
                    <td className="px-4 py-2 border">
                      {team.memberCount || 0}
                    </td>
                    <td className="px-4 py-2 border">{team.status || ""}</td>
                    <td className="px-4 py-2 border">{formattedDate}</td>
                    <td className="px-4 py-2 border">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <NavLink
                          to="/team-detail"
                          state={{
                            team: team,
                            index: globalIndex,
                            originPage,
                          }}
                          className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-800"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </NavLink>
                        <NavLink
                          to="/update-team"
                          state={{
                            team: team,
                            index: globalIndex,
                            originPage,
                          }}
                          className="flex items-center px-3 py-1 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Sửa
                        </NavLink>
                        <button
                          onClick={() => setDeleteTarget(team)}
                          className="flex items-center px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
              Bạn có chắc chắn muốn xóa nhóm{" "}
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
  );
};

export default TeamTable;
