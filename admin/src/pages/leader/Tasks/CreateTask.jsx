import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const CreateTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "pending",
    projectId: "",
    priority: 2,
    progress: 0,
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [projects, setProjects] = useState([]); // To store available projects

  // Fetch projects for projectId selection
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "https://du-anbe.onrender.com/api/leader/showallProject",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (Array.isArray(response.data.projects)) {
          setProjects(response.data.projects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách dự án:", error);
        setErrors({ general: "Không thể tải danh sách dự án." });
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên nhiệm vụ là bắt buộc";
    if (!formData.projectId) newErrors.projectId = "Dự án là bắt buộc";
    if (formData.progress < 0 || formData.progress > 100)
      newErrors.progress = "Tiến độ phải từ 0 đến 100";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "https://du-anbe.onrender.com/api/leader/createTask",
        {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          projectId: formData.projectId,
          priority: parseInt(formData.priority),
          progress: parseInt(formData.progress),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSubmitSuccess(true);
      setSubmitError("");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setSubmitSuccess(false);
      setSubmitError(
        error.response?.data?.message ||
          "Lỗi khi tạo nhiệm vụ, vui lòng thử lại."
      );
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-full mx-auto bg-white shadow-md rounded-2xl p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Thêm Nhiệm Vụ Mới
          </h2>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="flex items-center p-4 bg-green-100 text-green-800 rounded-lg">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Nhiệm vụ đã được tạo thành công!
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="flex items-center p-4 bg-red-100 text-red-800 rounded-lg">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {submitError}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Tên Nhiệm Vụ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Nhiệm Vụ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên nhiệm vụ"
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Dự Án */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dự Án <span className="text-red-500">*</span>
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.projectId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Chọn dự án</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-sm text-red-600 mt-1">{errors.projectId}</p>
            )}
          </div>

          {/* Trạng Thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng Thái <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="pending">Chưa giao</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Hủy</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">{errors.status}</p>
            )}
          </div>

          {/* Độ Ưu Tiên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ Ưu Tiên
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={1}>Thấp</option>
              <option value={2}>Trung bình</option>
              <option value={3}>Cao</option>
            </select>
          </div>

          {/* Tiến Độ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiến Độ (%)
            </label>
            <input
              type="number"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              placeholder="Nhập tiến độ (0-100)"
              min="0"
              max="100"
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.progress ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.progress && (
              <p className="text-sm text-red-600 mt-1">{errors.progress}</p>
            )}
          </div>

          {/* Mô Tả */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô Tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả nhiệm vụ"
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </form>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Thêm Nhiệm Vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
