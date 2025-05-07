import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  const [formData, setFormData] = useState({
    name: employee?.name || "",
    dateOfBirth: employee?.dateOfBirth || "",
    gender: employee?.gender || "",
    phoneNumber: employee?.phoneNumber || "",
    email: employee?.email || "",
    address: employee?.address || "",
    department: employee?.department || "",
    position: employee?.position || "",
    job: employee?.job || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi dữ liệu cập nhật tới API hoặc xử lý tại đây
    console.log("Updated Employee:", formData);
    alert("Thông tin đã được cập nhật (chưa kết nối API)");
    navigate(-1);
  };

  if (!employee) {
    return (
      <div className="p-6">
        <p className="text-red-600">Không có dữ liệu nhân viên để cập nhật.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
        Cập Nhật Thông Tin Nhân Viên
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block font-medium mb-1">Họ Tên</label>
          <input
            type="text"
            name="name"
            className="w-full border rounded px-3 py-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Ngày Sinh</label>
          <input
            type="date"
            name="dateOfBirth"
            className="w-full border rounded px-3 py-2"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Giới Tính</label>
          <select
            name="gender"
            className="w-full border rounded px-3 py-2"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">-- Chọn --</option>
            <option value="0">Nam</option>
            <option value="1">Nữ</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Số Điện Thoại</label>
          <input
            type="text"
            name="phoneNumber"
            className="w-full border rounded px-3 py-2"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Địa Chỉ</label>
          <input
            type="text"
            name="address"
            className="w-full border rounded px-3 py-2"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phòng Ban</label>
          <input
            type="text"
            name="department"
            className="w-full border rounded px-3 py-2"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Chức Vụ</label>
          <input
            type="text"
            name="position"
            className="w-full border rounded px-3 py-2"
            value={formData.position}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Công Việc</label>
          <input
            type="text"
            name="job"
            className="w-full border rounded px-3 py-2"
            value={formData.job}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2 flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
