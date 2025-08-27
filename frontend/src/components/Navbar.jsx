import { Bars3Icon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../public/kalinga_logo.png";
import SimpleHeader from "./SimpleHeader";

const Navbar = () => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const NavbarDetails = {
    title: "aby ride",
    center_links: [
      { name: "home", path: "/" },
      { name: "about us", path: "/about" },
      { name: " our services", path: "/services" },
      { name: " product", path: "/product" },
      { name: " our blog", path: "/blog" },
    

    ],
    left_links: [{ name: "contact us", path: "/contact-us" },],
  };

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setIsNavbarVisible(false);
    } else {
      setIsNavbarVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <div className="z-50">
      <SimpleHeader />
      <div className="w-full  sticky top-0  bg-gradient-to-br from-slate-300 via-blue-50 to-cyan-200 px-2 py-2 -mt-4 rounded-xl flex justify-between items-center shadow-md mb-2">
        {/* Logo */}
        <img src={Logo} alt="Logo" className="h-20 ml-12 object-contain  " />

        {/* Center Links - Desktop */}
        <div className="hidden lg:flex justify-center items-center">
          {NavbarDetails.center_links.map((link, key) => (
            <NavLink
              key={key}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "uppercase text-[12px] text-white bg-gradient-to-r from-[#47B2E4] to-[#293751] py-2 px-4 rounded-full font-semibold"
                  : "uppercase text-[14px] py-1 px-4 font-semibold hover:text-[#47B2E4] transition-all"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Left Links - Desktop */}
        <div className="hidden xl:flex justify-center items-center gap-2 mr-10">
          {NavbarDetails.left_links.map((link, key) => (
            <NavLink
              key={key}
              to={link.path}
              className="uppercase font-semibold text-[13px] text-white bg-gradient-to-r from-[#47B2E4] to-[#293751] py-2 px-4 rounded-full hover:from-[#329ad2] hover:to-[#1f2937] transition"
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="bg-white rounded-md cursor-pointer lg:hidden p-2"
          onClick={() => setIsDetailsVisible(true)}
        >
          <Bars3Icon className="w-8 h-8 text-black" />
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ x: "100%" }}
          animate={isDetailsVisible ? { x: 0 } : { x: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 z-30 flex justify-end"
        >
          <div className="w-3/4 sm:w-2/4 md:w-1/3 bg-white p-6">
            <div className="w-full flex justify-end">
              <XMarkIcon
                className="w-8 h-8 text-black cursor-pointer"
                onClick={() => setIsDetailsVisible(false)}
              />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {NavbarDetails.center_links.map((link, key) => (
                <NavLink
                  key={key}
                  to={link.path}
                  onClick={() => setIsDetailsVisible(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "uppercase font-medium text-sm bg-gradient-to-r from-[#47B2E4] to-[#293751] text-white py-2 px-5 rounded-md"
                      : "uppercase font-medium text-lg text-black py-2 px-5 rounded-md hover:bg-gray-200"
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Join Abyride LLC - Mobile */}
              {NavbarDetails.left_links.map((link, key) => (
                <NavLink
                  key={key}
                  to={link.path}
                  onClick={() => setIsDetailsVisible(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "uppercase font-medium text-sm bg-gradient-to-r from-[#47B2E4] to-[#293751] text-white py-2 px-5 rounded-md"
                      : "uppercase font-medium text-lg text-white bg-gradient-to-r from-[#47B2E4] to-[#293751] hover:from-[#329ad2] hover:to-[#1f2937] py-2 px-5 rounded-md text-center"
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;