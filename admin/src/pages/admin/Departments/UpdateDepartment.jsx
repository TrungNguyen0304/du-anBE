import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateDepartment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const departmentId = location.state?.departmentId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedLeader, setAssignedLeader] = useState("");
  const [assignedLeaderName, setAssignedLeaderName] = useState(""); // Thêm state cho tên trưởng phòng
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [assignedMembersNames, setAssignedMembersNames] = useState([]); // Thêm state cho tên thành viên
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!departmentId) {
      alert("Không tìm thấy ID phòng ban!");
      navigate("/departments");
      return;
    }

    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/api/company/showallTeam`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const department = response.data.teams.find(
          (team) => team._id === departmentId
        );

        if (!department) {
          throw new Error("Phòng ban không tồn tại!");
        }

        setName(department.name || "");
        setDescription(department.description || "");
        setAssignedLeader(department.assignedLeader?._id || "");
        setAssignedLeaderName(department.assignedLeader?.name || "");
        setAssignedMembers(
          department.assignedMembers.map((member) => member._id) || []
        );
        setAssignedMembersNames(
          department.assignedMembers.map((member) => member.name) || []
        );
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu phòng ban:", err);
        setError(err.message || "Lỗi khi tải dữ liệu phòng ban.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [departmentId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const updateData = {
        name,
        description,
        assignedLeader,
        assignedMembers,
      };

      const response = await axios.put(
        `http://localhost:8001/api/company/updateTeam/${departmentId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Cập nhật phòng ban thành công!");
      navigate("/departments");
    } catch (err) {
      console.error("Lỗi khi cập nhật phòng ban:", err);
      setError(err.response?.data?.message || "Lỗi khi cập nhật phòng ban.");
    }
  };

  const handleCancel = () => {
    navigate("/departments");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <p>Đang tải dữ liệu phòng ban...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Chỉnh Sửa Phòng Ban
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Tên Phòng Ban
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700">
              Mô Tả
            </label>
            <textarea
              id="description"
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="assignedLeader" className="block text-gray-700">
              Trưởng Phòng
            </label>
            <input
              type="text"
              id="assignedLeader"
              className="w-full p-2 border border-gray-300 rounded"
              value={assignedLeaderName} // Hiển thị tên trưởng phòng
              onChange={(e) => setAssignedLeader(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="assignedMembers" className="block text-gray-700">
              Thành Viên
            </label>
            <input
              type="text"
              id="assignedMembers"
              className="w-full p-2 border border-gray-300 rounded"
              value={assignedMembersNames.join(",")} // Hiển thị tên thành viên
              onChange={(e) =>
                setAssignedMembers(
                  e.target.value.split(",").map((id) => id.trim())
                )
              }
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDepartment;
