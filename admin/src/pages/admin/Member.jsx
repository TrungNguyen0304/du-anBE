import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Member = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:8001/api/company/showallLeaders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(res.data.leaders);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách leader:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Quản Lý Nhân Viên</h2>
        <NavLink
          to="/create-user"
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
            {employees.map((emp, index) => {
              const formattedDate =
                emp.dateOfBirth && !isNaN(Date.parse(emp.dateOfBirth))
                  ? new Date(emp.dateOfBirth).toLocaleDateString("vi-VN")
                  : "";

              const gender =
                emp.gender === "0" || emp.gender === 0
                  ? "Nam"
                  : emp.gender === "1" || emp.gender === 1
                  ? "Nữ"
                  : emp.gender || "";

              return (
                <tr
                  key={emp.id || index}
                  className="even:bg-gray-100 text-center"
                >
                  <td className="px-3 py-2 border">{index + 1}</td>
                  <td className="px-3 py-2 border">{emp.name || ""}</td>
                  <td className="px-3 py-2 border">{formattedDate}</td>
                  <td className="px-3 py-2 border">{gender}</td>
                  <td className="px-3 py-2 border">{emp.email || ""}</td>
                  <td className="px-3 py-2 border">{emp.role || ""}</td>
                  <td className="px-3 py-2 border">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <NavLink
                        to="/memberdetail"
                        state={{ employee: emp, index: index + 1 }}
                        className="text-blue-600 hover:underline"
                      >
                        Xem
                      </NavLink>
                      <button className="text-green-600 hover:underline">
                        Sửa
                      </button>
                      <button className="text-red-600 hover:underline">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Member;
