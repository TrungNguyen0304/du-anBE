import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Static teams for team selection
const staticTeams = [
  { id: 1, name: "Development Team" },
  { id: 2, name: "Marketing Team" },
  { id: 3, name: "Design Team" },
  { id: 4, name: "Sales Team" },
  { id: 5, name: "HR Team" },
  { id: 6, name: "Support Team" },
  { id: 7, name: "QA Team" },
  { id: 8, name: "DevOps Team" },
  { id: 9, name: "Finance Team" },
  { id: 10, name: "Product Team" },
  { id: 11, name: "Research Team" },
];

const CreateTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Pending",
    assignedMember: "",
    teamId: "",
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên nhiệm vụ là bắt buộc";
    if (!formData.status) newErrors.status = "Trạng thái là bắt buộc";
    if (formData.assignedMember.trim() && !formData.teamId) {
      newErrors.teamId = "Vui lòng chọn nhóm nếu có thành viên được giao";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitSuccess(true);
    setTimeout(() => {
      navigate(-1);
    }, 2000);
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
              <option value="Pending">Chưa giao</option>
              <option value="In Progress">Đang thực hiện</option>
              <option value="Completed">Hoàn thành</option>
              <option value="On Hold">Tạm hoãn</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">{errors.status}</p>
            )}
          </div>

          {/* Thành Viên Được Giao */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thành Viên Được Giao
            </label>
            <input
              type="text"
              name="assignedMember"
              value={formData.assignedMember}
              onChange={handleChange}
              placeholder="Nhập tên thành viên (nếu có)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Nhóm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhóm
            </label>
            <select
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.teamId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Không có nhóm</option>
              {staticTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.teamId && (
              <p className="text-sm text-red-600 mt-1">{errors.teamId}</p>
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
