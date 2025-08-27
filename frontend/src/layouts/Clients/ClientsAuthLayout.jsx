import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";

function ClientsAuthLayout() {
  return (
    <div>
      <DashboardNavbar />
      <Outlet />
    </div>
  );
}

export default ClientsAuthLayout;
