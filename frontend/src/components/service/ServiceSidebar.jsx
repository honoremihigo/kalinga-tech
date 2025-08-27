import React from "react";
import { NavLink } from "react-router-dom";
import avatar1 from "../../assets/images/avatar/avatar1.jpg";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import {
  ArrowDownCircleIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/20/solid";

const ServiceSidebar = () => {
  const links = [
    { name: "portfolio manage", to: "portfolio-management" },
    { name: "Team Leadership", to: "team-leadership" },
    { name: "Market Research", to: "market-research" },
    { name: "Executive Search", to: "executive-search" },
    { name: "Strategic Planning", to: "strategic-planning" },
  ];

  return (
    <div className="flex flex-col w-full  sm:w-3/4  lg:w-2/4 xl:w-1/4 gap-10">
      <div className="flex flex-col rounded-2xl  gap-4 w-full bg-gray-200 p-8">
        {links.map((link, key) => (
          <NavLink
            to={"/services/" + link.to}
            key={key}
            className={({ isActive }) =>
              isActive
                ? "bg-teal-800 text-base w-full font-normal text-left text-white p-4 rounded-lg uppercase "
                : " font-normal text-base bg-white  p-4 rounded-lg uppercase text-left w-full text-black"
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-col text-white justify-center items-center rounded-xl gap-4 w-full bg-teal-800 p-7 py-12">
        <img
          src={avatar1}
          className="rounded-full h-40 w-40 object-cover"
          alt=""
        />
        <h1 className="capitalize font-semibold text-3xl">how can we help ?</h1>

        <NavLink
          to={"/contact-us"}
          className="uppercase font-medium text-md text-white bg-amber-400 py-3 px-8 rounded-full"
          style={{ color: "white" }}
        >
          contact us
        </NavLink>
      </div>

      <div className="flex gap-4 flex-col">
        <div className="p-4 bg-gray-200 cursor-pointer flex items-center justify-between  rounded-lg">
          <div className="flex gap-2 items-center">
            <DocumentArrowDownIcon className="w-8 h-8 fill-white  stroke-primary" />
            <p className="text-base font-medium uppercase">service Brochure</p>
          </div>
          <ArrowDownCircleIcon className="w-9 h-9 cursor-pointer hover:fill-primary transition-all" />
        </div>
        <div className="p-4 bg-gray-200 cursor-pointer flex items-center justify-between  rounded-lg">
          <div className="flex gap-2 items-center">
            <DocumentArrowDownIcon className="w-8 h-8 fill-white  stroke-primary" />
            <p className="text-base font-medium uppercase">service Brochure</p>
          </div>
          <ArrowDownCircleIcon className="w-9 h-9 cursor-pointer hover:fill-primary transition-all" />
        </div>
      </div>
    </div>
  );
};

export default ServiceSidebar;
