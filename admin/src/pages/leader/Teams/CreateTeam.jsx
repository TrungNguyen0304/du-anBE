import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus } from "lucide-react";

const CreateTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    leader: "",
    memberCount: 0,
    status: "Active",
    createdDate: "",
    members: [],
  });
  const [newMemberName, setNewMemberName] = useState("");
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      setErrors({ ...errors, newMember: "Tên thành viên không được để trống" });
      return;
    }
    const newMember = {
      id: formData.members.length + 1,
      name: newMemberName.trim(),
    };
    setFormData({
      ...formData,
      members: [...formData.members, newMember],
      memberCount: formData.members.length + 1,
    });
    setNewMemberName("");
    setErrors({ ...errors, newMember: "" });
  };

  const handleRemoveMember = (id) => {
    const updatedMembers = formData.members.filter(
      (member) => member.id !== id
    );
    setFormData({
      ...formData,
      members: updatedMembers,
      memberCount: updatedMembers.length,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên nhóm là bắt buộc";
    if (!formData.leader.trim()) newErrors.leader = "Trưởng nhóm là bắt buộc";
    if (formData.memberCount < 0)
      newErrors.memberCount = "Số thành viên phải lớn hơn hoặc bằng 0";
    if (!formData.createdDate) newErrors.createdDate = "Ngày tạo là bắt buộc";
    if (formData.memberCount !== formData.members.length)
      newErrors.memberCount =
        "Số thành viên không khớp với danh sách thành viên";
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
            Thêm Nhóm Mới
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
            Nhóm đã được tạo thành công!
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Tên nhóm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Nhóm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên nhóm"
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Trưởng nhóm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trưởng Nhóm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="leader"
              value={formData.leader}
              onChange={handleChange}
              placeholder="Nhập tên trưởng nhóm"
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.leader ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.leader && (
              <p className="text-sm text-red-600 mt-1">{errors.leader}</p>
            )}
          </div>

          {/* Ngày tạo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày Tạo <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="createdDate"
              value={formData.createdDate}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.createdDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.createdDate && (
              <p className="text-sm text-red-600 mt-1">{errors.createdDate}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng Thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Active">Đang hoạt động</option>
              <option value="Inactive">Ngưng hoạt động</option>
            </select>
          </div>

          {/* Thành viên */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thành Viên
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Nhập tên thành viên"
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.newMember ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.newMember && (
              <p className="text-sm text-red-600 mb-2">{errors.newMember}</p>
            )}
            {formData.members.length > 0 ? (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Danh sách thành viên ({formData.memberCount})
                </h3>
                <ul className="space-y-2">
                  {formData.members.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{member.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa có thành viên nào</p>
            )}
            {errors.memberCount && (
              <p className="text-sm text-red-600 mt-1">{errors.memberCount}</p>
            )}
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
            Thêm Nhóm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
