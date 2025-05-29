import React from "react";

const ChatMemberSidebar = ({
  groups,
  setSelectedGroup,
  selectedGroup,
  teamMembers,
  creatingGroup,
  setCreatingGroup,
  newGroupName,
  setNewGroupName,
  newGroupMembers,
  setNewGroupMembers,
  handleCreateGroup,
  createGroupRef,
  error,
  setError,
}) => {
  return (
    <div className="w-80 bg-white border-r rounded-l-xl shadow-md flex flex-col p-6 gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Nhóm của tôi</h2>
        <button
          onClick={() => setCreatingGroup(!creatingGroup)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {creatingGroup ? "" : "Tạo nhóm"}
        </button>
      </div>

      {creatingGroup && (
        <div
          ref={createGroupRef}
          className="space-y-3 rounded-lg shadow-sm p-4 bg-gray-50 border"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder="Tên nhóm"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="max-h-40 overflow-y-auto custom-scrollbar border border-gray-300 rounded-lg p-3 bg-white">
            {teamMembers.map((member) => (
              <label
                key={member._id}
                className="flex items-center justify-between gap-2 py-1 text-sm text-gray-800 hover:bg-gray-100 rounded px-2"
              >
                {member.name}
                <input
                  type="checkbox"
                  checked={newGroupMembers.includes(member._id)}
                  onChange={() => {
                    setNewGroupMembers((prev) =>
                      prev.includes(member._id)
                        ? prev.filter((id) => id !== member._id)
                        : [...prev, member._id]
                    );
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNewGroupName("");
                setNewGroupMembers([]);
                setError(null);
                setCreatingGroup(false);
              }}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
            >
              Hủy
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCreateGroup();
              }}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Tạo nhóm
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3">
        {groups.map((group) => (
          <button
            key={group._id}
            onClick={() => setSelectedGroup(group)}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors ${
              selectedGroup?._id === group._id
                ? "bg-blue-100 font-semibold"
                : "bg-white"
            } shadow-sm`}
          >
            {group.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatMemberSidebar;
