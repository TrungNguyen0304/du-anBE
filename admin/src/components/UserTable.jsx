import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const UserTable = ({
  title,
  fetchUrl,
  deleteUrl,
  createLink = "/create-user",
  originPage,
}) => {
  const [users, setUsers] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Reset to page 1 if the current page exceeds total pages after users change
    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (users.length === 0) {
      setCurrentPage(1);
    }
  }, [users, currentPage]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(fetchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.leaders || res.data.members || res.data.users || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${deleteUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newUsers = users.filter((user) => user.id !== id);
      setUsers(newUsers);
      // If the current page is empty after deletion, go to the previous page
      const totalPages = Math.ceil(newUsers.length / PAGE_SIZE);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate paginated users
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full max-w-7xl mx-auto relative">
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
        <table className="min-w-full border border-gray-300 rounded-md text-sm">
          <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
            <tr>
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Họ và Tên</th>
              <th className="px-3 py-2 border">Ngày sinh</th>
              <th className="px-3 py-2 border">Giới tính</th>
              <th className="px-3 py-2 border">Email</th>
              <th className="px-3 py-2 border">Vai Trò</th>
              <th className="px-3 py-2 border">Chức Năng</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-3 py-2 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => {
                const formattedDate =
                  user.dateOfBirth && !isNaN(Date.parse(user.dateOfBirth))
                    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                    : "";

                const gender =
                  user.gender === "0" || user.gender === 0
                    ? "Nam"
                    : user.gender === "1" || user.gender === 1
                    ? "Nữ"
                    : user.gender || "";

                // Global index for display (e.g., 11–20 on page 2)
                const globalIndex = (currentPage - 1) * PAGE_SIZE + index + 1;

                return (
                  <tr
                    key={user.id || index}
                    className="even:bg-gray-100 text-center"
                  >
                    <td className="px-3 py-2 border">{globalIndex}</td>
                    <td className="px-3 py-2 border">{user.name || ""}</td>
                    <td className="px-3 py-2 border">{formattedDate}</td>
                    <td className="px-3 py-2 border">{gender}</td>
                    <td className="px-3 py-2 border">{user.email || ""}</td>
                    <td className="px-3 py-2 border">{user.role || ""}</td>
                    <td className="px-3 py-2 border">
                      <div className="flex justify-center gap-4 flex-wrap">
                        <NavLink
                          to="/memberdetail"
                          state={{
                            employee: user,
                            index: globalIndex,
                            originPage,
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Xem
                        </NavLink>
                        <NavLink
                          to="/update-user"
                          state={{
                            employee: user,
                            index: globalIndex,
                            originPage,
                          }}
                          className="text-green-600 hover:underline"
                        >
                          Sửa
                        </NavLink>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="text-red-600 hover:underline"
                        >
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

      {/* Modal xác nhận xóa */}
      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">
              Bạn có chắc chắn muốn xóa người dùng{" "}
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

export default UserTable;