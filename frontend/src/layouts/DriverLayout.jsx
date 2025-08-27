import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
function DriverLayout() {
  return (
    <div style={{ padding: "0px" }}>
      <DashboardNavbar />
      <Outlet />
    </div>
  );
}

export default DriverLayout;
