import { Outlet } from "react-router-dom";
import SideBar from "../components/Profile/SideBar";

const ProfileLayout = () => (
  <div className="flex min-h-screen bg-white flex-col md:flex-row">
    <SideBar />
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

export default ProfileLayout;
