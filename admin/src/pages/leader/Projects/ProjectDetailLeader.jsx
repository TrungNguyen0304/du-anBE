import { useLocation, useNavigate } from "react-router-dom";

const ProjectDetailLeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project, index } = location.state || {};

  if (!project) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <p className="text-red-500">Không tìm thấy thông tin dự án.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-[#183d5d]">
        Thông Tin Chi Tiết Dự Án
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
        <div>
          <strong>STT:</strong> {index}
        </div>
        <div>
          <strong>Tên Dự Án:</strong> {project.name}
        </div>
        <div>
          <strong>Mô Tả:</strong> {project.description}
        </div>
        <div>
          <strong>Deadline:</strong> {project.deadline}
        </div>
        <div>
          <strong>Trạng Thái:</strong>{" "}
          <span className="capitalize">{project.status}</span>
        </div>
        <div>
          <strong>ID Team:</strong> {project.teamId}
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Quay lại danh sách
      </button>
    </div>
  );
};

export default ProjectDetailLeader;
