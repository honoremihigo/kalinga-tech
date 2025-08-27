import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import avatar1 from "../assets/static/service7.jpg";

const ServiceLayout = () => {
  const [title, setTitle] = useState("choose product category on the side");

  // it way of get the url and other things related to url so easy in react
  const Location = useLocation();

  // the links that navigate to the different product categories
  const links = [
    { name: "Computers selling ", to: "" },
    { name: "PlayStation Devices", to: "playstation-devices" },
  ];

  // each time the url or path change it changes the header name
  useEffect(() => {
    if (Location.pathname.includes("products")) {
      if (Location.pathname == "/products") {
        setTitle("choose product category on the side");
        return;
      }
      links.some((link) => {
        if (Location.pathname.includes(link.to)) {
          setTitle(link.name);
        }
      });
    }

    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, [Location.pathname]);

  return (
    <div className="flex justify-center gap-24 flex-col w-full mb-4">
      <div className="flex items-center lg:items-start flex-col-reverse lg:flex-row justify-between md:w-13/12 gap-10">
        <div className="flex flex-col w-full sm:w-3/4 lg:w-2/4 xl:w-1/4 gap-10">
          <div className="flex flex-col rounded-2xl gap-4 w-full bg-gray-200 p-8">
            {links.map((link, key) => (
              <NavLink
                to={link.to}
                end
                key={key}
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#293751] text-base w-full font-semibold text-left text-white p-4 rounded-lg uppercase "
                    : "font-semibold text-base bg-white p-4 rounded-lg uppercase text-left w-full text-black"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-col text-white justify-center items-center rounded-xl gap-4 w-full bg-[#293751] p-7 py-12">
            <img
              src={avatar1}
              className="rounded-full h-40 w-40 object-cover"
              alt=""
            />
            <h1 className="capitalize font-semibold text-3xl">
              Need help finding the right product?
            </h1>

            <NavLink
              to={"/contact-us"}
              className="uppercase font-medium text-md text-white bg-[#47B2E4] py-3 px-14 rounded-md"
            >
              contact us
            </NavLink>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default ServiceLayout;