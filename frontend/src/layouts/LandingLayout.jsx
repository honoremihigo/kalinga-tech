import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function LandingLayout() {
  return (
    <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
      <nav className=" sticky top-0 z-20 bg-white">
        <Navbar />
      </nav>
      <Outlet />
      <Footer />
    </div>
  );
}

export default LandingLayout;
