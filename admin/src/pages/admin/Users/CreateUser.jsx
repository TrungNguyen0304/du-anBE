import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEmployee = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      alert("Vui lòng nhập đầy đủ các thông tin bắt buộc!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8001/api/company/createUser",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender:
            formData.gender === "Nam"
              ? "0"
              : formData.gender === "Nữ"
              ? "1"
              : "",
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thêm nhân viên thành công!");
      setFormData({
        name: "",
        email: "",
        password: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        phoneNumber: "",
        role: "",
      });
      navigate("/member");
    } catch (err) {
      console.error("Lỗi khi thêm nhân viên:", err);
      alert("Đã xảy ra lỗi khi thêm nhân viên!");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4">Thêm Nhân Viên</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border p-4 rounded-lg bg-gray-50">
        <div className="flex flex-col items-center md:col-span-1">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-2 text-sm text-gray-600">
            Chưa có avatar
          </div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Upload
          </button>
        </div>

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
              name="dateOfBirth"
              value={formData.dateOfBirth}
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
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="border px-2 py-1 rounded w-full"
              placeholder="Số Điện Thoại"
            />
          </div>

          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="">Chức Vụ</option>
              <option value="leader">Leader</option>
              <option value="member">Nhân viên</option>
            </select>
          </div>

          <div className="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end gap-4 mt-4">
            <button
              onClick={() => navigate("/member")}
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
    </div>
  );
};

export default CreateUser;
