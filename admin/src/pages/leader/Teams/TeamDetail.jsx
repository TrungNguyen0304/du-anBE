import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { ArrowLeft, Pencil, Eye } from "lucide-react";

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

  const formattedDate =
    team.createdDate && !isNaN(Date.parse(team.createdDate))
      ? new Date(team.createdDate).toLocaleDateString("vi-VN")
      : "N/A";

  return (
    <div className="min-h-screen p-4">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Chi Tiết Nhóm #{index}
          </h2>
        </div>

        {/* Team Information */}
        <div className="space-y-4">
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Tên Nhóm:</span>
            <span className="w-2/3 text-gray-900">{team.name || "N/A"}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">
              Trưởng Nhóm:
            </span>
            <span className="w-2/3 text-gray-900">{team.leader || "N/A"}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">
              Số Thành Viên:
            </span>
            <span className="w-2/3 text-gray-900">{team.memberCount || 0}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Trạng Thái:</span>
            <span className="w-2/3 text-gray-900">{team.status || "N/A"}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <span className="w-1/3 font-medium text-gray-700">Ngày Tạo:</span>
            <span className="w-2/3 text-gray-900">{formattedDate}</span>
          </div>
        </div>

        {/* Members List */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Danh Sách Thành Viên
          </h3>
          {team.members && team.members.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-[10%] px-4 py-2 border text-center">ID</th>
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
                      key={member.id || idx}
                      className="even:bg-gray-50 text-center"
                    >
                      <td className="px-4 py-2 border">{member.id}</td>
                      <td className="px-4 py-2 border">{member.name}</td>
                      <td className="px-4 py-2 border">
                        <NavLink
                          to="/member-detail"
                          state={{ member, team, index }}
                          className="flex items-center justify-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-800"
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

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() =>
              navigate("/update-team", { state: { team, index, originPage } })
            }
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Sửa Nhóm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
