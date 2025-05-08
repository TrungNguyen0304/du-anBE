import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leader, setLeader] = useState("");
  const [members, setMembers] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    alert("Dự án đã được tạo!");
    navigate("/projects");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Thêm Dự Án Mới</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">
            Tên Dự Án
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label htmlFor="leader" className="block text-gray-700">
            Leader
          </label>
          <input
            type="text"
            id="leader"
            className="w-full p-2 border border-gray-300 rounded"
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="members" className="block text-gray-700">
            Nhân Viên
          </label>
          <input
            type="text"
            id="members"
            className="w-full p-2 border border-gray-300 rounded"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="department" className="block text-gray-700">
            Phòng Ban
          </label>
          <input
            type="text"
            id="department"
            className="w-full p-2 border border-gray-300 rounded"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Hủy
        </button>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Tạo Dự Án
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
