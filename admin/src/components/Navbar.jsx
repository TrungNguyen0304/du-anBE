import React, { useState, useRef, useEffect } from "react";
import imgUser from "../assets/images/lequythien.png";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { TbLogout } from "react-icons/tb";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md px-4 sm:px-6 py-3 flex items-center justify-end">
      <div
        className="flex items-center gap-2 sm:gap-4 relative"
        ref={dropdownRef}
      >
        <p className="text-gray-700 text-sm sm:text-base hidden sm:block">
          Xin chào! <span className="font-semibold">Lê Quý Thiện</span>
        </p>

        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <img
            src={imgUser}
            alt="User"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300"
          />
          <MdOutlineArrowDropDown className="text-xl sm:text-2xl text-gray-600" />
        </div>

        {isDropdownOpen && (
          <div className="absolute top-12 sm:top-14 right-0 bg-white border rounded shadow-md w-36 sm:w-40 z-50 animate-fade-in">
            <ul className="py-2">
              <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 text-sm sm:text-base">
                <TbLogout className="mr-2" />
                Đăng xuất
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
