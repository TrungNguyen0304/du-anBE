import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Dữ liệu mẫu
const sampleDepartments = [
  {
    id: 1,
    name: "Phòng Kế Toán",
    description: "Quản lý tài chính và chi tiêu",
  },
  {
    id: 2,
    name: "Phòng Nhân Sự",
    description: "Tuyển dụng và đào tạo nhân viên",
  },
  {
    id: 3,
    name: "Phòng Kỹ Thuật",
    description: "Phát triển và bảo trì hệ thống",
  },
];

const UpdateDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const department = sampleDepartments.find((dept) => dept.id === parseInt(id));

  const [name, setName] = useState(department?.name || "");
  const [description, setDescription] = useState(department?.description || "");

  useEffect(() => {
    if (!department) {
      alert("Phòng ban không tồn tại!");
      navigate("/departments");
    }
  }, [department, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    // Xử lý cập nhật phòng ban ở đây (gửi đến API hoặc cập nhật state)
    alert("Phòng ban đã được cập nhật!");
    navigate("/departments"); // Điều hướng về danh sách phòng ban
  };

  const handleCancel = () => {
    navigate("/departments"); // Hủy và quay lại danh sách phòng ban
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Chỉnh Sửa Phòng Ban
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Tên Phòng Ban
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700">
              Mô Tả
            </label>
            <textarea
              id="description"
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDepartment;
