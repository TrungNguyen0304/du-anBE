import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  X,
  UserPlus,
  Users,
  Send,
  Trash2,
  ChevronDown,
  Video,
} from "lucide-react";
import ChatMemberHomeOut from "./ChatMemberHomeOut";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:8001/api/group";
const TEAM_API_URL = "http://localhost:8001/api/member/showallTeam";
const SOCKET_URL = "http://localhost:8001";

const ChatMember = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const addMemberRef = useRef(null);
  const createGroupRef = useRef(null);
  const socketRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    _id: "",
    name: "Guest",
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [hasLeftGroup, setHasLeftGroup] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState([]);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Connect socket and emit user-online
  useEffect(() => {
    socketRef.current.connect();
    if (currentUser._id) {
      socketRef.current.emit("user-online", currentUser._id);
      setOnlineUsers((prev) => new Set(prev).add(currentUser._id));
    }

    socketRef.current.on("user-online", (userId) => {
      console.log("User online:", userId);
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socketRef.current.on("user-offline", (userId) => {
      console.log("User offline:", userId);
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      if (currentUser._id) {
        socketRef.current.emit("user-offline", currentUser._id);
      }
      socketRef.current.disconnect();
    };
  }, [currentUser._id]);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedGroups = res.data.map((group) => ({
          ...group,
          members: group.members || [],
        }));
        setGroups(fetchedGroups);
        if (fetchedGroups.length > 0 && !selectedGroup) {
          setSelectedGroup(fetchedGroups[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể lấy danh sách nhóm");
      }
    };
    fetchGroups();
  }, []);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(TEAM_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const members = res.data.teams.reduce((acc, team) => {
          return [
            ...acc,
            ...team.assignedMembers.map((member) => ({
              _id: member._id,
              name: member.name,
            })),
          ];
        }, []);
        setTeamMembers(members);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể lấy danh sách thành viên team"
        );
      }
    };
    fetchTeamMembers();
  }, []);

  // Fetch messages and join group room
  useEffect(() => {
    if (!selectedGroup?._id) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/${selectedGroup._id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(
          res.data.map((msg) => ({
            _id: msg._id,
            senderId: msg.senderId,
            senderName: msg.senderName || "System",
            text: msg.message,
            timestamp: msg.timestamp,
            system: msg.senderId === "System",
          }))
        );
        socketRef.current.emit("join-group", {
          userId: currentUser._id,
          groupId: selectedGroup._id,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Không thể lấy tin nhắn");
      }
    };

    fetchMessages();
  }, [selectedGroup, currentUser._id]);

  // Handle real-time messages and member updates
  useEffect(() => {
    if (!selectedGroup?._id) return;

    const handleReceiveMessage = (msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => [
        ...prev,
        {
          _id: msg._id || Date.now(),
          senderId: msg.senderId,
          senderName: msg.senderName || "System",
          text: msg.message,
          timestamp: msg.timestamp,
          system: msg.senderId === "System",
        },
      ]);
    };

    const handleNewMember = ({ groupId, memberName, isLeaving }) => {
      if (groupId === selectedGroup?._id) {
        const systemMessage = {
          _id: Date.now(),
          senderId: "System",
          senderName: "System",
          text: isLeaving
            ? `Người dùng ${memberName} đã rời nhóm`
            : `Người dùng ${memberName} đã tham gia nhóm`,
          timestamp: new Date().toISOString(),
          system: true,
        };
        setMessages((prev) => [...prev, systemMessage]);
        const fetchGroupData = async () => {
          try {
            const token = localStorage.getItem("token");
            const res = await axios.get(API_URL, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const updatedGroup = res.data.find((g) => g._id === groupId);
            if (updatedGroup) {
              setSelectedGroup({ ...updatedGroup, members: updatedGroup.members || [] });
            }
          } catch (err) {
            setError("Không thể cập nhật thông tin nhóm");
          }
        };
        fetchGroupData();
      }
    };

    socketRef.current.on("group-message", handleReceiveMessage);
    socketRef.current.on("new-member", handleNewMember);

    return () => {
      socketRef.current.off("group-message", handleReceiveMessage);
      socketRef.current.off("new-member", handleNewMember);
    };
  }, [selectedGroup]);

  // Handle typing events
  useEffect(() => {
    const handleTyping = ({ userId }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
      setTimeout(() => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }, 3000);
    };

    socketRef.current.on("typing", handleTyping);

    return () => {
      socketRef.current.off("typing", handleTyping);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle click outside to close add member or create group
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addMemberRef.current && !addMemberRef.current.contains(e.target)) {
        setAddingMember(false);
      }
      if (createGroupRef.current && !createGroupRef.current.contains(e.target)) {
        setCreatingGroup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Send typing event
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (selectedGroup?._id) {
      socketRef.current.emit("typing", {
        userId: currentUser._id,
        groupId: selectedGroup._id,
      });
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedGroup?._id) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/${selectedGroup._id}/messages`,
        { message: inputText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInputText("");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi gửi tin nhắn");
    }
  };

  // Add member
  const handleConfirmAdd = async () => {
    if (!newMemberId || !selectedGroup?._id) {
      setError("Vui lòng chọn thành viên để thêm");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/${selectedGroup._id}/members`,
        { userId: newMemberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedGroup({ ...res.data.group, members: res.data.group.members || [] });
      setNewMemberId("");
      setAddingMember(false);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi thêm thành viên");
    }
  };

  // Remove member
  const handleRemoveMember = async (index) => {
    const member = selectedGroup.members[index];
    if (!member) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${selectedGroup._id}/members/${member._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedGroup((prev) => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== index),
      }));
      setSelectedMemberIndex(null);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi xóa thành viên");
    }
  };

  // Leave group
  const handleLeaveGroup = async () => {
    if (!selectedGroup?._id) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
        return;
      }
      await axios.delete(`${API_URL}/${selectedGroup._id}/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups((prev) => prev.filter((group) => group._id !== selectedGroup._id));
      setSelectedGroup(null);
      setHasLeftGroup(true);
      socketRef.current.emit("leave-group", {
        userId: currentUser._id,
        groupId: selectedGroup._id,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi rời nhóm");
      if (err.response?.status === 401) {
        setError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
        // Optionally redirect to login page
        // navigate("/login");
      }
    }
  };

  // Create group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || newGroupMembers.length === 0) {
      setError("Tên nhóm và danh sách thành viên là bắt buộc");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/create`,
        { name: newGroupName, members: newGroupMembers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newGroup = { ...res.data.group, members: res.data.group.members || [] };
      setGroups((prev) => [...prev, newGroup]);
      setSelectedGroup(newGroup);
      setMessages([
        {
          _id: Date.now(),
          senderId: "System",
          senderName: "System",
          text: `Nhóm "${newGroup.name}" đã được tạo.`,
          timestamp: new Date().toISOString(),
          system: true,
        },
      ]);
      setNewGroupName("");
      setNewGroupMembers([]);
      setCreatingGroup(false);
      socketRef.current.emit("join-group", {
        userId: currentUser._id,
        groupId: newGroup._id,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo nhóm");
    }
  };

  if (hasLeftGroup) {
    return <ChatMemberHomeOut onBackToChat={() => setHasLeftGroup(false)} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r rounded-l-xl shadow-md flex flex-col p-6 gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Nhóm của tôi</h2>
          <button
            onClick={() => setCreatingGroup(!creatingGroup)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {creatingGroup ? "Hủy" : "Tạo nhóm"}
          </button>
        </div>

        {creatingGroup && (
          <div ref={createGroupRef} className="space-y-3 rounded-lg shadow-sm">
          <div className="space-y-3 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Tên nhóm"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              multiple
              value={newGroupMembers}
              onChange={(e) =>
                setNewGroupMembers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Chọn thành viên
              </option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
            <button 얍
              onClick={handleCreateGroup}
            <textarea
              rows={2}
              placeholder="Thành viên (ngăn cách bởi dấu phẩy)"
              value={newGroupMembers}
              onChange={(e) => setNewGroupMembers(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                if (!newGroupName.trim()) return;
                const members = newGroupMembers
                  .split(",")
                  .map((m) => m.trim())
                  .filter((m) => m);
                setJoinedGroups((prev) => [
                  ...prev,
                  {
                    id: newGroupName.toLowerCase().replace(/\s+/g, "-"),
                    name: newGroupName,
                  },
                ]);
                setRoom({
                  id: newGroupName.toLowerCase().replace(/\s+/g, "-"),
                  name: newGroupName,
                  members: [currentUser, ...members],
                });
                setMessages([
                  {
                    sender: "System",
                    text: `Nhóm "${newGroupName}" đã được tạo.`,
                    system: true,
                  },
                ]);
                setCreatingGroup(false);
                setNewGroupName("");
                setNewGroupMembers("");
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Tạo nhóm
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3">
          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors ${selectedGroup?._id === group._id ? "bg-blue-100 font-semibold" : "bg-white"
                } shadow-sm`}
              className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors ${
                selectedGroup?._id === group._id ? "bg-blue-100 font-semibold" : "bg-white"
        {/* List of joined groups */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {joinedGroups.map((group, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRoom((prev) => ({
                  ...prev,
                  id: group.id,
                  name: group.name,
                }));
                setMessages([
                  {
                    sender: "System",
                    text: `Bạn đang ở nhóm "${group.name}".`,
                    system: true,
                  },
                ]);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors ${
                room.id === group.id ? "bg-blue-100 font-semibold" : "bg-white"
              } shadow-sm`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>


      {selectedGroup && (
        <div className="relative flex flex-col h-screen bg-white shadow-lg rounded-r-xl overflow-hidden w-full mx-auto">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">{selectedGroup.name}</h2>
              <p className="text-sm text-gray-600">
                {selectedGroup.members.length} thành viên
                {typingUsers.size > 0 && (
                  <span className="ml-2 text-blue-500 animate-pulse">
                    {[...typingUsers].length} người đang nhập...
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/chat/video-call")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Bắt đầu cuộc gọi video"
              >
                <Video size={20} className="text-blue-600" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={20} className="text-blue-600" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          {sidebarOpen && (
            <div className="absolute top-0 right-0 h-full w-72 bg-white border-l shadow-xl z-10 flex flex-col">
              <div className="flex items-center justify-between px-4 py-4 border-b bg-gray-50">
                <div>
                  <h1 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    {currentUser.name}
                    {onlineUsers.has(currentUser._id) && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </h1>
                  <p className="text-xs text-gray-600">Bạn đang online</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="hover:bg-gray-100 rounded p-1 transition-colors"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-4 flex-1">
                <button
                  onClick={() => setShowMembers(!showMembers)}
                  className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2 text-gray-800">
                    <Users size={16} /> Thành viên ({selectedGroup.members.length})
                  </span>
                  <ChevronDown
                    size={16}
                    className={`${showMembers ? "rotate-180" : ""} transition-transform text-gray-600`}
                  />
                </button>

                {showMembers && (
                  <div className="bg-gray-50 p-3 rounded-lg border space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                    {selectedGroup.members.map((member, index) => (
                      <div
                        key={member._id}
                        className="flex justify-between items-center text-sm text-gray-800"
                      >
                        <span className="flex items-center gap-2">
                          {member.name}
                          {onlineUsers.has(member._id) && (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                        </span>
                        {member._id !== currentUser._id && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setSelectedMemberIndex((prev) =>
                                  prev === index ? null : index
                                )
                              }
                              className="hover:bg-gray-100 rounded p-1 transition-colors"
                            >
                              <MoreVertical size={16} className="text-gray-600" />
                            </button>
                            {selectedMemberIndex === index && (
                              <div className="absolute right-0 top-6 bg-white border rounded-lg shadow z-10">
                                <button
                                  onClick={() => handleRemoveMember(index)}
                                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-sm"
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

                <div ref={addMemberRef}>
                  <button
                    onClick={() => setAddingMember(!addingMember)}
                    className="flex items-center gap-2 text-base bg-gray-50 border rounded-lg hover:bg-gray-100 px-4 py-2 w-full transition-colors"
                  >
                    <UserPlus size={16} className="text-blue-600" /> Thêm thành viên
                  </button>
                  {addingMember && (
                    <div className="flex gap-3 mt-3 items-center">
                      <select
                        value={newMemberId}
                        onChange={(e) => setNewMemberId(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn thành viên</option>
                        {teamMembers
                          .filter(
                            (m) =>
                              !selectedGroup.members.some((member) => member._id === m._id)
                          )
                          .map((member) => (
                            <option key={member._id} value={member._id}>
                              {member.name}
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={handleConfirmAdd}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Thêm
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLeaveGroup}
                  className="mt-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Rời nhóm
                </button>
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-50">
            {error && (
              <div className="text-red-500 text-center bg-red-50 px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}
            {messages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUser._id;
              if (msg.system) {
                return (
                  <div
                    key={msg._id || msg.timestamp}
                    className="text-center text-xs italic text-gray-500 mb-3"
                  >
                   
                  </div>
                );
              }
              return (
                <div
                  key={msg._id || msg.timestamp}
                  className={`mb-4 flex flex-col ${isCurrentUser ? "items-end" : "items-start"
                    }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${isCurrentUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-gray-300 rounded-bl-none"
                      } shadow`}
                  >
                    {!isCurrentUser && (
                      <div className="text-xs font-semibold mb-1 text-gray-600">
                        {msg.senderName}
                      </div>
                    )}
                    <div>{msg.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input to send message */}
          <div className="border-t px-6 py-4 bg-white flex items-center gap-4">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              title="Gửi tin nhắn"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="relative flex flex-col h-screen bg-white shadow-lg rounded-r-xl overflow-hidden w-full mx-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">{room.name}</h2>
            <p className="text-sm text-gray-600">
              {room.members.length} thành viên
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/chat/video-call")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Bắt đầu cuộc gọi video"
            >
              <Video size={20} className="text-blue-600" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical size={20} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="absolute top-0 right-0 h-full w-72 bg-white border-l shadow-xl z-10 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b bg-gray-50">
              <div>
                <h1 className="font-bold text-gray-800 text-lg">
                  {currentUser}
                </h1>
                <p className="text-xs text-gray-600">Bạn đang online</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-gray-100 rounded p-1 transition-colors"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1">
              {/* Toggle Member List */}
              <button
                onClick={() => setShowMembers(!showMembers)}
                className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2 text-gray-800">
                  <Users size={16} /> Thành viên ({room.members.length})
                </span>
                <ChevronDown
                  size={16}
                  className={`${
                    showMembers ? "rotate-180" : ""
                  } transition-transform text-gray-600`}
                />
              </button>

              {showMembers && (
                <div className="bg-gray-50 p-3 rounded-lg border space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {room.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm text-gray-800"
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
                            className="hover:bg-gray-100 rounded p-1 transition-colors"
                          >
                            <MoreVertical size={16} className="text-gray-600" />
                          </button>
                          {selectedMemberIndex === index && (
                            <div className="absolute right-0 top-6 bg-white border rounded-lg shadow z-10">
                              <button
                                onClick={() => handleRemoveMember(index)}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-sm"
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

              {/* Add member */}
              <div ref={addMemberRef}>
                <button
                  onClick={() => setAddingMember(!addingMember)}
                  className="flex items-center gap-2 text-base bg-gray-50 border rounded-lg hover:bg-gray-100 px-4 py-2 w-full transition-colors"
                >
                  <UserPlus size={16} className="text-blue-600" /> Thêm thành
                  viên
                </button>
                {addingMember && (
                  <div className="flex gap-3 mt-3 items-center">
                    <input
                      type="text"
                      placeholder="Tên thành viên"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleConfirmAdd()}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleConfirmAdd}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>

              {/* Leave group */}
              <button
                onClick={handleLeaveGroup}
                className="mt-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Rời nhóm
              </button>
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-50">
          {messages.map((msg, i) => {
            const isCurrentUser = msg.sender === currentUser;
            if (msg.system) {
              return (
                <div
                  key={i}
                  className="text-center text-xs italic text-gray-500 mb-3"
                >
                  {msg.text}
                </div>
              );
            }
            return (
              <div
                key={i}
                className={`mb-4 flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-300 rounded-bl-none"
                  } shadow`}
                >
                  {!isCurrentUser && (
                    <div className="text-xs font-semibold mb-1 text-gray-600">
                      {msg.sender}
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input to send message */}
        <div className="border-t px-6 py-4 bg-white flex items-center gap-4">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            title="Gửi tin nhắn"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatMember;