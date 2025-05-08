import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/company/showallTeam",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Kiểm tra nếu response.data.teams là mảng
        if (Array.isArray(response.data.teams)) {
          setDepartments(response.data.teams); // Lưu mảng teams vào state
        } else {
          console.error(
            "Dữ liệu trả về không phải là mảng teams:",
            response.data
          );
          setDepartments([]); // Nếu không phải mảng, gán mảng rỗng
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleView = (id) => {
    navigate("/department-detail", { state: { departmentId: id } });
  };

  const handleEdit = (id) => {
    navigate("/update-department", { state: { departmentId: id } });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa phòng ban này?");
    if (confirmDelete) {
      alert(`Đã xóa phòng ban ID: ${id}`);
    }
  };

  const handleCreate = () => {
    navigate("/create-department");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <p>Đang tải dữ liệu phòng ban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
        {/* Tiêu đề */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Quản Lý Phòng Ban
            </h2>
            <p className="text-gray-600">
              Danh sách các phòng ban trong công ty
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Thêm Phòng Ban
          </button>
        </div>

        {/* Bảng danh sách phòng ban */}
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full border border-gray-200 text-sm md:text-base">
            <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
              <tr className="text-center">
                <th className="px-4 py-2 border">STT</th>
                <th className="px-4 py-2 border">Tên Phòng Ban</th>
                <th className="px-4 py-2 border">Mô Tả</th>
                <th className="px-4 py-2 border">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Không có phòng ban nào.
                  </td>
                </tr>
              ) : (
                departments.map((dept, index) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-gray-50 text-center even:bg-gray-100"
                  >
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{dept.name}</td>
                    <td className="px-4 py-2 border">{dept.description}</td>
                    <td className="px-4 py-2 border">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleView(dept.id)}
                          className="flex items-center px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </button>
                        <button
                          onClick={() => handleEdit(dept.id)}
                          className="flex items-center px-3 py-1 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
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
      </div>
    </div>
  );
};

export default Departments;
