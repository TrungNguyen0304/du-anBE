import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
        }

        const response = await axios.get(
          `http://localhost:8001/api/company/viewTeamProject/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const projectData = response.data.project[0];
        if (!projectData) {
          throw new Error("Dự án không tồn tại.");
        }

        setProject(projectData);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết dự án:", err);
        setError(err.message || "Không thể tải chi tiết dự án.");
        alert(err.message || "Dự án không tồn tại!");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Đang tải dữ liệu...</div>;
  }

  if (error || !project) {
    return (
      <div className="text-center mt-10 text-red-600">Dự án không tồn tại.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Chi Tiết Dự Án</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Tên Dự Án</h3>
            <p className="text-gray-600">{project.name}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Mô Tả</h3>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Trạng Thái</h3>
            <p className="text-gray-600 capitalize">{project.status}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Ưu Tiên</h3>
            <p className="text-gray-600">{project.priority}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Hạn Chót</h3>
            <p className="text-gray-600">
              {new Date(project.deadline).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Team Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Người Phụ Trách</h3>
            <p className="text-gray-600">
              <strong>Leader:</strong> {project.assignedTeam.assignedLeader.name}
            </p>
            <p className="text-gray-600">
              <strong>Nhân viên:</strong>{" "}
              {project.assignedTeam.assignedMembers
                .map((member) => member.name)
                .join(", ")}
            </p>
            <p className="text-gray-600">
              <strong>Đội:</strong> {project.assignedTeam.name}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Thời Gian</h3>
            <p className="text-gray-600">
              <strong>Tạo lúc:</strong>{" "}
              {new Date(project.createdAt).toLocaleString("vi-VN")}
            </p>
            <p className="text-gray-600">
              <strong>Cập nhật lúc:</strong>{" "}
              {new Date(project.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Danh Sách Công Việc</h3>
        {project.tasks && project.tasks.length > 0 ? (
          <div className="space-y-4">
            {project.tasks.map((task) => (
              <div
                key={task._id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <h4 className="text-lg font-medium">{task.taskName}</h4>
                <p className="text-gray-600">
                  <strong>Trạng thái:</strong> {task.status}
                </p>
                <p className="text-gray-600">
                  <strong>Người thực hiện:</strong> {task.assignee?.name || "Chưa phân công"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Chưa có công việc nào.</p>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default ProjectDetail;