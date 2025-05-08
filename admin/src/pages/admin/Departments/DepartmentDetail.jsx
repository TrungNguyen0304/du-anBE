import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const DepartmentDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { departmentId } = location.state || {};

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!departmentId) return;

    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/api/company/showTeam/${departmentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDepartment(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng ban:", error);
        alert("Không thể tải dữ liệu phòng ban.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [departmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Đang tải thông tin phòng ban...</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Không tìm thấy thông tin phòng ban.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Thông Tin Chi Tiết Phòng Ban
        </h2>

        <div className="space-y-4 text-gray-700">
          <div>
            <span className="font-semibold">Tên Phòng Ban:</span>{" "}
            {department.name}
          </div>
          <div>
            <span className="font-semibold">Mô Tả:</span>{" "}
            {department.description}
          </div>
          <div>
            <span className="font-semibold">Leader:</span>{" "}
            {department.assignedLeader?.name || "Chưa có"}
          </div>
          <div>
            <span className="font-semibold">Danh Sách Nhân Viên:</span>
            {department.assignedMembers?.length > 0 ? (
              <ul className="list-disc list-inside ml-4 mt-1">
                {department.assignedMembers.map((member) => (
                  <li key={member._id}>{member.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 ml-4">Không có nhân viên nào.</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate("/departments")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Quay Lại Danh Sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
