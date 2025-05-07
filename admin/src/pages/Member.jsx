import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const initialData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    department: "Phòng ban A",
    dateofbirth: "2000-01-01",
    position: "Chức vụ 1",
    job: "Công việc 1",
    joinDate: "2020-01-01",
    salary: "10,000,000",
  },
  {
    id: 2,
    name: "Nguyễn Văn B",
    department: "Phòng ban B",
    dateofbirth: "1999-01-01",
    position: "Chức vụ 2",
    job: "Công việc 2",
    joinDate: "2021-03-15",
    salary: "12,000,000",
  },
];

const Member = () => {
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState(initialData);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    address: "",
    phone: "",
    position: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEmployee = () => {
    if (!formData.name || !formData.position) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newEmployee = {
      id: employees.length + 1,
      name: formData.name,
      department: "Chưa cập nhật",
      dateofbirth: formData.dob,
      position: formData.position,
      job: "Đang cập nhật",
      joinDate: new Date().toISOString().split("T")[0],
      salary: "0",
    };

    setEmployees((prev) => [...prev, newEmployee]);
    setFormData({
      name: "",
      email: "",
      password: "",
      gender: "",
      dob: "",
      address: "",
      phone: "",
      position: "",
    });
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Quản Lý Nhân Viên</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Đóng" : "Thêm"}
        </button>
      </div>

      {showForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border p-4 rounded-lg bg-gray-50">
          {/* Avatar */}
          <div className="flex flex-col items-center md:col-span-1">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-2 text-sm text-gray-600">
              Chưa có avatar
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Upload
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm md:col-span-2">
            <div>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
                placeholder="Họ và Tên"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
                placeholder="Email"
              />
            </div>

            <div>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="flex items-center space-x-4 col-span-1 sm:col-span-2 md:col-span-3">
              <span>Giới Tính:</span>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={formData.gender === "Nam"}
                  onChange={handleInputChange}
                  className="mr-1"
                />{" "}
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={formData.gender === "Nữ"}
                  onChange={handleInputChange}
                  className="mr-1"
                />{" "}
                Nữ
              </label>
            </div>

            <div>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
              />
            </div>

            <div>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
                placeholder="Địa Chỉ"
              />
            </div>
            <div>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
                placeholder="Số Điện Thoại"
              />
            </div>

            <div>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
              >
                <option value="">Chức Vụ</option>
                <option value="Leader">Leader</option>
                <option value="Nhân viên">Nhân viên</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleAddEmployee}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách nhân viên */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md text-sm">
          <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
            <tr>
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Họ và Tên</th>
              <th className="px-3 py-2 border">Ngày sinh</th>
              <th className="px-3 py-2 border">Phòng Ban</th>
              <th className="px-3 py-2 border">Chức Vụ</th>
              <th className="px-3 py-2 border">Chức Năng</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="even:bg-gray-100 text-center">
                <td className="px-3 py-2 border">{emp.id}</td>
                <td className="px-3 py-2 border">{emp.name}</td>
                <td className="px-3 py-2 border">{emp.dateofbirth}</td>
                <td className="px-3 py-2 border">{emp.department}</td>
                <td className="px-3 py-2 border">{emp.position}</td>
                <td className="px-3 py-2 border">
                  <div className="flex justify-center gap-2 flex-wrap">
                    <NavLink
                      to="/memberdetail"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Member;
