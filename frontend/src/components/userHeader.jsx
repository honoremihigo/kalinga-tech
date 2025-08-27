import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaCar, FaUser, FaBook } from "react-icons/fa";
import { useAuth } from "../context/ClientAuthContext";
import { User } from "lucide-react";

const UserHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      const resp = await logout();
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;



  function hasDayPassed(savedDate) {
    const saved = new Date(savedDate);
    const now = new Date();

    // Normalize both dates to midnight for an accurate day comparison
    saved.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return now > saved;
  }

  // Example usage:
  const userLastActive = user?.createdAt; // Example saved date (YYYY-MM-DD)

  return (
    <header className="flex items-center bg-[#283753] text-white justify-between sm:p-2 md:p-2 lg:p-3 xl:p-4 border-b flex-col gap-3 sm:flex-row shadow-sm">
      {/* Logo */}

      {hasDayPassed(userLastActive) ?
      
      <h1 className="text-2xl text-center font-bold">Welcome back, {user?.firstName} {user?.lastName}</h1>
      :
      <h1 className="text-2xl  text-center  font-bold">Welcome to abyride, {user?.firstName} {user?.lastName}</h1>
      
      }

      {/* Navigation */}
      <nav className="flex items-center gap-6 text-white  fill-white  font-medium"> 
        {/* <div className="flex items-center gap-2 cursor-pointer">
          <FaCar className="text-lg" />
          <span>Ride</span>
        </div> */}

        <Link
          to={"/trips"}
          className="flex text-white  items-center gap-2 cursor-pointer"
        >
          <FaBook className="text-lg" />
          <span>Activity</span>
        </Link>

        {/* Profile Icon + Dropdown */}
        <div className="relative">
          <div
            className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {user.profileImg ?  <img  src={`${API_URL}/uploads/profile/${user.profileImg}`} className="rounded-full  h-full w-full object-cover" alt="" /> :<FaUser className="text-gray-600 text-xl" /> }
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden border z-30">
              <ul className="text-sm text-gray-800">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/profile/AccountInfo")}
                >
                  Profile
                </li>
              
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default UserHeader;
