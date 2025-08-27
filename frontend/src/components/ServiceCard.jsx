import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowUpIcon } from "@heroicons/react/16/solid";
// eslint-disable-next-line react/prop-types
const ServiceCard = ({ SvgIcon, num, Img, title, par, link }) => {
  return (
    <div className=" w-[400px] border-[1px] border-gray-400 p-3 rounded-xl pb-10 relative mb-4 mt-8    ">
      {/* container of icon and number */}

      <div className=" flex justify-between p-2">
        <div className=" w-[60px] h-[60px] ">
          <SvgIcon className=" w-full h-full " />
        </div>
        <h1 className=" text-xl ">{num}</h1>
      </div>

      {/* container of image and title and paragraph */}

      <div className=" flex items-center gap-3 justify-center p-2  ">
        <div className=" h-[1px]  bg-gray-400 w-[50%] "></div>
        <img
          className=" w-[80px] h-[80px] rounded-full object-cover "
          src={Img}
          alt=""
        />
      </div>
      {/* container of title and paragraph */}

      <div className=" flex  flex-col gap-2 justify-center p-6 mb-4 ">
        <h1 className=" font-semibold text-xl ">{title}</h1>
        <p className=" text-gray-600  text-sm leading-7 line-clamp-3  ">
          {par}
        </p>
      </div>
      {/* container of link to services page */}

      <NavLink
        to={link}
        className=" border mt-20 h-16 overflow-hidden   border-gray-400 absolute  rounded-[25px] p-2 pt-4 bg-white right-8 bottom-[-30px]  "
      >
        <div className="  w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#293751] p-2 hover:bg-[#293751] transition-all -mt-3 ">
          <ArrowUpIcon className=" w-full h-[25px] rotate-45 fill-white " />
        </div>
      </NavLink>
    </div>
  );
};

export default ServiceCard;
