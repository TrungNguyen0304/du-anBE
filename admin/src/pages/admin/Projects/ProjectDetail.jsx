import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GrLinkPrevious } from "react-icons/gr";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8001/api/company/viewTeamProject/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setProject(data.project);
        } else {
          throw new Error(data.message || "Không thể tải dự án.");
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết dự án:", err);
        setError(err.message);
        alert(err.message || "Dự án không tồn tại!");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-700 animate-pulse">
            Đang tải chi tiết dự án...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-red-200">
          <p className="text-xl font-semibold text-red-600">Lỗi</p>
          <p className="mt-2 text-gray-600">
            Dự án không tồn tại hoặc không thể tải.
          </p>
          <button
            onClick={() => navigate("/projects")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại danh sách dự án
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      revoke: "bg-red-100 text-red-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`inline-block px-3 py-1 text-sm font-medium rounded-full capitalize ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status === "pending"
          ? "Đang chờ"
          : status === "revoke"
          ? "Thu hồi"
          : status === "in_progress"
          ? "Đang thực hiện"
          : status === "completed"
          ? "Hoàn thành"
          : status === "cancelled"
          ? "Đã hủy"
          : status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      1: "bg-red-100 text-red-800",
      2: "bg-blue-100 text-blue-800",
      3: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
          priorityStyles[priority] || "bg-gray-100 text-gray-800"
        }`}
      >
        {priority === 1
          ? "Cao"
          : priority === 2
          ? "Trung bình"
          : priority === 3
          ? "Thấp"
          : priority}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:underline text-lg"
          >
            <GrLinkPrevious className="w-5 h-5 mr-2"/> Quay lại
          </button>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {project.name}
          </h2>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          {/* Left Column: Project Info */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Thông Tin Dự Án
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600">Tên Dự Án</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {project.name}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Mô Tả</h4>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">
                  Trạng Thái
                </h4>
                <p className="mt-1">{getStatusBadge(project.status)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Ưu Tiên</h4>
                <p className="mt-1">{getPriorityBadge(project.priority)}</p>
              </div>
              {project.deadline &&
                !isNaN(new Date(project.deadline).getTime()) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">
                      Hạn Chót
                    </h4>
                    <p className="mt-1 text-gray-700">
                      {new Date(project.deadline).toLocaleString("vi-VN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Right Column: Team Info */}
          {(project.assignedTeam?.assignedLeader?.name ||
            project.assignedTeam?.assignedMembers?.length > 0 ||
            project.assignedTeam?.name) && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Nhóm Phụ Trách
              </h3>
              <div className="space-y-4">
                {project.assignedTeam?.name && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">
                      Phòng Ban
                    </h4>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {project.assignedTeam.name}
                    </p>
                  </div>
                )}
                {project.assignedTeam?.assignedLeader?.name && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">
                      Leader
                    </h4>
                    <p className="mt-1 text-gray-700">
                      {project.assignedTeam.assignedLeader.name}
                    </p>
                  </div>
                )}
                {project.assignedTeam?.assignedMembers?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">
                      Nhân Viên
                    </h4>
                    <p className="mt-1 text-gray-700">
                      {project.assignedTeam.assignedMembers.map((member) => (
                        <span
                          key={member._id}
                          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                        >
                          {member.name}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Danh Sách Công Việc
          </h3>
          {project.tasks?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <h4 className="text-lg font-semibold text-gray-900">
                    {task.taskName}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Trạng thái:</span>{" "}
                    <span className="capitalize">{task.status}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Người thực hiện:</span>{" "}
                    {task.assignee?.name || "Chưa phân công"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base text-gray-500 italic bg-gray-50 p-4 rounded-lg">
              Chưa có công việc nào được thêm.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
