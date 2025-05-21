import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  X,
  UserPlus,
  Users,
  Send,
  Trash2,
  ChevronDown,
} from "lucide-react";
import ChatHomeOut from "./ChatHomeOut";

const Chat = () => {
  const currentUser = "Lê Quý Thiện (Leader)";
  const chatEndRef = useRef(null);
  const addMemberRef = useRef(null);

  const [room, setRoom] = useState({
    id: "vanphong",
    name: "Văn Phòng Test",
    members: [
      "Lê Quý Thiện (Leader)",
      "Trần Thị B",
      "Phạm Văn C",
      "Nguyễn Thị D",
      "Võ Văn E",
    ],
  });

  const [messages, setMessages] = useState([
    { sender: "Nguyễn Văn A", text: "Chào cả nhà!" },
    { sender: "Lê Quý Thiện (Leader)", text: "Chào mọi người!" },
  ]);

  const [inputText, setInputText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [hasLeftGroup, setHasLeftGroup] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: currentUser, text: inputText.trim() },
    ]);
    setInputText("");
  };

  const handleConfirmAdd = () => {
    if (!newMemberName.trim()) return;
    const addedName = newMemberName.trim();
    setRoom((prev) => ({
      ...prev,
      members: [...prev.members, addedName],
    }));
    setMessages((prev) => [
      ...prev,
      {
        sender: "System",
        text: `${
          currentUser === "Lê Quý Thiện (Leader)" ? "Bạn" : currentUser
        } đã thêm ${addedName} vào nhóm.`,
        system: true,
      },
    ]);
    setNewMemberName("");
    setAddingMember(false);
  };

  const [joinRequests, setJoinRequests] = useState([
    { name: "Nguyễn Văn M", approved: false },
  ]);

  const handleRemoveMember = (index) => {
    const removedMember = room.members[index];
    setRoom((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
    setMessages((prev) => [
      ...prev,
      {
        sender: "System",
        text: `${
          currentUser === "Lê Quý Thiện (Leader)" ? "Bạn" : currentUser
        } đã xóa ${removedMember} khỏi nhóm.`,
        system: true,
      },
    ]);
    setSelectedMemberIndex(null);
  };

  const handleLeaveGroup = () => {
    setRoom((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== currentUser),
    }));
    setMessages((prev) => [
      ...prev,
      {
        sender: "System",
        text: `${currentUser} đã rời nhóm.`,
        system: true,
      },
    ]);
    setSidebarOpen(false);
    setHasLeftGroup(true);
  };

  const handleClickOutside = (e) => {
    if (addMemberRef.current && !addMemberRef.current.contains(e.target)) {
      setAddingMember(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (hasLeftGroup) {
    return <ChatHomeOut onBackToChat={() => setHasLeftGroup(false)} />;
  }

  return (
    <div className="relative flex flex-col h-screen bg-white shadow-lg rounded-xl overflow-hidden w-full mx-auto">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-700">{room.name}</h2>
          <p className="text-sm text-gray-500">
            {room.members.length} thành viên
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="absolute top-0 right-0 h-full w-72 bg-gray-50 border-l shadow-xl z-10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b bg-white">
            <div>
              <h1 className="font-bold text-gray-700 text-lg">{currentUser}</h1>
              <p className="text-xs text-gray-500">Bạn đang online</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="hover:bg-gray-200 rounded p-1"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-3 flex-1">
            {/* Toggle Member List */}
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="flex items-center justify-between w-full px-3 py-2 bg-white border rounded hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                <Users size={16} /> Thành viên ({room.members.length})
              </span>
              <ChevronDown
                size={16}
                className={`${
                  showMembers ? "rotate-180" : ""
                } transition-transform`}
              />
            </button>

            {showMembers && (
              <div className="bg-white p-3 rounded border space-y-2 max-h-60 overflow-y-auto flex-1 custom-scrollbar">
                {room.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm text-gray-700"
                  >
                    <span>{member}</span>
                    {member !== currentUser && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setSelectedMemberIndex((prev) =>
                              prev === index ? null : index
                            )
                          }
                          className="hover:bg-gray-200 rounded p-1"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {selectedMemberIndex === index && (
                          <div className="absolute right-0 top-6 bg-white border rounded shadow z-10">
                            <button
                              onClick={() => handleRemoveMember(index)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                            >
                              <Trash2 size={14} /> Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate("/chat/requests")}
              className="flex items-center gap-2 text-base bg-white border rounded hover:bg-gray-100 px-3 py-2 w-full"
            >
              <Users size={16} /> Yêu cầu tham gia
            </button>

            {/* Add member */}
            <div ref={addMemberRef}>
              <button
                onClick={() => setAddingMember(!addingMember)}
                className="flex items-center gap-2 text-base bg-white border rounded hover:bg-gray-100 px-3 py-2 w-full"
              >
                <UserPlus size={16} /> Thêm thành viên
              </button>
              {addingMember && (
                <div className="flex gap-2 mt-2 items-center">
                  <input
                    type="text"
                    placeholder="Tên thành viên"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleConfirmAdd()}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <button
                    onClick={handleConfirmAdd}
                    className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                  >
                    Thêm
                  </button>
                </div>
              )}
            </div>

            {/* Leave group */}
            <button
              onClick={handleLeaveGroup}
              className="mt-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Rời nhóm
            </button>
          </div>
        </div>
      )}

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
        {messages.map((msg, index) =>
          msg.system ? (
            <div key={index} className="flex justify-center my-2">
              <span className="text-xs italic text-gray-500 bg-gray-100 px-3 py-1 rounded">
                {msg.text}
              </span>
            </div>
          ) : (
            <div
              key={index}
              className={`flex flex-col ${
                msg.sender === currentUser ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`text-sm mb-1 font-semibold ${
                  msg.sender === currentUser
                    ? "text-green-700"
                    : "text-blue-700"
                }`}
              >
                {msg.sender}
              </span>
              <div
                className={`px-4 py-2 rounded-xl shadow-md max-w-[80%] text-base ${
                  msg.sender === currentUser
                    ? "bg-green-100 text-gray-800"
                    : "bg-white text-gray-800 border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 px-4 py-3 border-t bg-white rounded-b-xl">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-base"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
