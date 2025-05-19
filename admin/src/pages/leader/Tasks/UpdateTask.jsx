import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const UpdateTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    priority: 1,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Lấy dữ liệu nhiệm vụ theo ID
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `https://du-anbe.onrender.com/api/leader/getTaskById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const task = response.data.task;
        setFormData({
          name: task.name || "",
          description: task.description || "",
          status: task.status || "",
          priority: task.priority || 1,
        });
      } catch (error) {
        console.error("Lỗi khi tải thông tin nhiệm vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên nhiệm vụ là bắt buộc";
    if (!formData.status.trim()) newErrors.status = "Trạng thái là bắt buộc";
    if (!formData.priority || isNaN(formData.priority)) {
      newErrors.priority = "Độ ưu tiên phải là số hợp lệ";
    }
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
      await axios.put(
        `https://du-anbe.onrender.com/api/leader/updateTask/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate(-1); // Quay lại trang trước (AssignedTasks)
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi cập nhật nhiệm vụ:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) return <p className="p-4">Đang tải thông tin nhiệm vụ...</p>;

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-2xl shadow">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại
      </button>

      <h2 className="text-2xl font-bold mb-4">Cập Nhật Nhiệm Vụ</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên nhiệm vụ */}
        <div>
          <label className="block font-medium mb-1">Tên nhiệm vụ</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows="4"
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block font-medium mb-1">Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn trạng thái --</option>
            <option value="pending">Chưa bắt đầu</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          {errors.status && (
            <p className="text-red-600 text-sm mt-1">{errors.status}</p>
          )}
        </div>

        {/* Độ ưu tiên */}
        <div>
          <label className="block font-medium mb-1">Độ ưu tiên</label>
          <input
            type="number"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            min="1"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.priority && (
            <p className="text-red-600 text-sm mt-1">{errors.priority}</p>
          )}
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </div>

        {/* Thông báo thành công */}
        {submitSuccess && (
          <p className="text-green-600 font-medium mb-4">
            Cập nhật nhiệm vụ thành công! Đang quay lại...
          </p>
        )}
      </form>
    </div>
  );
};

export default UpdateTask;
