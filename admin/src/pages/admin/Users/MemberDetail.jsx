import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import imgUser from "../../../assets/images/lequythien.png";

const MemberDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;
  const employeeIndex = location.state?.index;

  if (!employee) {
    return (
      <div className="p-6">
        <p className="text-red-600">Không có dữ liệu nhân viên.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const gender =
    employee.gender === "0" || employee.gender === 0
      ? "Nam"
      : employee.gender === "1" || employee.gender === 1
      ? "Nữ"
      : employee.gender || "";

  const formattedDate =
    employee.dateOfBirth && !isNaN(Date.parse(employee.dateOfBirth))
      ? new Date(employee.dateOfBirth).toLocaleDateString("vi-VN")
      : "N/A";

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
      <div className="flex gap-8">
        {/* Cột ảnh và tiêu đề */}
        <div className="flex flex-col items-center">
          <img src={imgUser} alt="user" className="w-40 h-40 object-cover" />
          <div className="bg-blue-100 px-4 py-2 rounded-md mt-4 text-blue-900 font-semibold text-lg">
            Thông tin chi tiết
          </div>
        </div>

        {/* Thông tin chia 2 cột */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <ul className="space-y-4">
            <li>
              <strong>• ID Nhân Viên:</strong> {employeeIndex || "N/A"}
            </li>
            <li>
              <strong>• Họ Tên Nhân Viên:</strong> {employee.name}
            </li>
            <li>
              <strong>• Ngày Sinh:</strong> {formattedDate}
            </li>
            <li>
              <strong>• Giới Tính:</strong> {gender}
            </li>
            <li>
              <strong>• Số Điện Thoại:</strong> {employee.phoneNumber}
            </li>
            <li>
              <strong>• Mail:</strong> {employee.email}
            </li>
            <li>
              <strong>• Địa Chỉ:</strong> {employee.address || "N/A"}
            </li>
          </ul>

          <ul className="space-y-4">
            <li>
              <strong>• Phòng Ban:</strong> {employee.department || "N/A"}
            </li>
            <li>
              <strong>• Chức Vụ:</strong> {employee.position || "N/A"}
            </li>
            <li>
              <strong>• Công Việc:</strong> {employee.job || "N/A"}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default MemberDetail;
