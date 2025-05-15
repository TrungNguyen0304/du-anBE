import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MemberDetailLeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { member, team, index } = location.state || {};

  if (!member || !team) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
          <p className="text-red-600 text-center">
            Không tìm thấy thông tin thành viên hoặc nhóm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 transition-all duration-300">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Chi Tiết Thành Viên: {member.name}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Tên:</span>
            <span className="w-2/3 text-gray-900">{member.name}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">
              ID Thành Viên:
            </span>
            <span className="w-2/3 text-gray-900">{member.id}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Nhóm:</span>
            <span className="w-2/3 text-gray-900">
              {team.name} (ID: {index})
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Danh Sách Dự Án
          </h3>
          <p className="text-sm text-gray-500">
            Không có dữ liệu dự án cho thành viên này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailLeader;