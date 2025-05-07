import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaThLarge,
  FaUser,
  FaBuilding,
  FaProjectDiagram,
  FaBriefcase,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { GiProgression } from "react-icons/gi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`sm:hidden fixed top-3 z-50 transition-all duration-300 ${
          isOpen ? "right-4" : "left-4"
        }`}
      >
        <button
          className="text-white bg-[#183d5d] p-2 rounded-md shadow-md transition-transform duration-300 transform active:scale-90"
          onClick={toggleSidebar}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      <aside
        className={`fixed sm:static w-64 h-screen bg-gradient-to-b from-[#183d5d] to-[#1d557a] text-white p-4 sm:p-5 flex flex-col shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 z-40`}
      >
        <h1 className="text-lg sm:text-xl font-bold text-center mb-3">
          QUẢN LÝ NHÂN SỰ
        </h1>
        <hr className="border-gray-400 mb-4 sm:mb-6" />

        <div className="mb-4">
          <p className="text-xs sm:text-sm text-gray-300 font-semibold mb-2">
            MAIN
          </p>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 px-3 rounded cursor-pointer hover:bg-white/10 ${
                isActive ? "bg-white/20" : ""
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaThLarge />
            <span>Trang Chủ</span>
          </NavLink>
        </div>

        <div className="flex-1">
          <p className="text-xs sm:text-sm text-gray-300 font-semibold mb-2">
            MENU
          </p>
          <div className="flex flex-col gap-1">
            <SidebarItem
              icon={<FaUser />}
              label="Nhân Viên"
              to="/member"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              icon={<FaBuilding />}
              label="Phòng Ban"
              contributes
              to="/departments"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              icon={<FaProjectDiagram />}
              label="Dự Án"
              to="/projects"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              icon={<FaBriefcase />}
              label="Công Việc"
              to="/jobs"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              icon={<GiProgression />}
              label="Tiến độ dự án"
              to="/projectprogress"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>

        <hr className="mt-4 sm:mt-6 border-gray-400" />
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 sm:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

const SidebarItem = ({ icon, label, to, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 py-2 px-3 rounded cursor-pointer hover:bg-white/10 ${
        isActive ? "bg-white/20" : ""
      }`
    }
    onClick={onClick}
  >
    <div className="text-base sm:text-lg">{icon}</div>
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
