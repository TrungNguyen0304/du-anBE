import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";

const TeamDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { team, index, originPage } = location.state || {};

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
          <p className="text-red-600 text-center">
            Không tìm thấy thông tin nhóm.
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
            Thông Tin Chi Tiết
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Tên Nhóm:</span>
            <span className="w-2/3 text-gray-900">{team.name}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">
              Trưởng Nhóm:
            </span>
            <span className="w-2/3 text-gray-900">{team.leader}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">
              Số Thành Viên:
            </span>
            <span className="w-2/3 text-gray-900">{team.memberCount}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Danh Sách Thành Viên
          </h3>
          {team.members && team.members.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full table-fixed border border-gray-300 text-sm">
                <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
                  <tr>
                    <th className="w-[10%] px-4 py-2 border text-center">
                      STT
                    </th>
                    <th className="w-[70%] px-4 py-2 border text-center">
                      Tên Thành Viên
                    </th>
                    <th className="w-[20%] px-4 py-2 border text-center">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((member, idx) => (
                    <tr
                      key={member.id}
                      className="even:bg-gray-100 text-center"
                    >
                      <td className="px-4 py-2 border">{idx + 1}</td>
                      <td className="px-4 py-2 border">{member.name}</td>
                      <td className="px-4 py-2 border">
                        <NavLink
                          to="/member-detail"
                          state={{ member, team, index }}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-800"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem chi tiết
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Không có thành viên nào trong nhóm.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
