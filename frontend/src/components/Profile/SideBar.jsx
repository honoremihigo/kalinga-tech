import { ArrowLeftCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start w-full md:max-w-[16rem] md:p-4 p-2 border-r-0 md:border-r-[1px] md:border-gray-100 shadow-md md:shadow-none overflow-x-auto md:overflow-hidden">
      <div className="flex justify-center items-center gap-1">
        <ArrowLeftCircle
          className="w-10 h-10 cursor-pointer"
          onClick={() => navigate("/booking")}
        />

        <h1 className="text-lg py-3 md:py-0 font-semibold md:mb-4 mb-0 hidden md:block">
          Abyride Account
        </h1>
      </div>
      <ul className="md:space-y-2 space-y-0 flex items-start md:flex-col  md:w-full ">
        <li className=" cursor-pointer md:w-full">
          <NavLink
            className={({ isActive }) =>
              `block px-2 py-3 transition hover:bg-gray-100 ${
                isActive
                  ? " border-b-2 md:border-l-4 md:border-b-0 border-black md:bg-gray-50 font-bold"
                  : ""
              }`
            }
            to={"/profile/AccountInfo"}
          >
            Account Info
          </NavLink>
        </li>

        <li className=" cursor-pointer md:w-full">
          <NavLink
            className={({ isActive }) =>
              `block px-2 py-3 transition hover:bg-gray-100 ${
                isActive
                  ? " border-b-2 md:border-l-4 md:border-b-0 border-black md:bg-gray-50 font-bold"
                  : ""
              }`
            }
            to={"/profile/security"}
          >
            Security
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
export default SideBar;
