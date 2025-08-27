/* eslint-disable react/prop-types */
import React from "react";
import placefrombottle from "../assets/static/header.jpg";
import { HomeIcon } from "@heroicons/react/24/solid";

const Header = (props) => {
  return (
    <div className="relative w-full h-52 sm:h-60 md:h-72 flex rounded-md mb-4">
      {/* react toastify container her */}
      {/* Right Section (Image Background) */}
      <div
        className="absolute top-0 right-0 w-full h-full bg-cover rounded-lg  bg-no-repeat bg-center z-100"
        style={{
          backgroundImage: `url(${placefrombottle})`,
          backgroundPosition: "right",
          backgroundSize: "cover",
        }}
      >
        {/* Overlay for Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#293751] to-transparent rounded-lg"></div>
      </div>

      {/* Left Section (Text) */}
      <div className="relative w-full flex flex-col justify-center gap-4 p-10 text-white z-10 rounded-lg">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl capitalize font-bold ml-6 mb-4">
          {props?.title}
        </h1>
        <div className="flex items-center gap-4 w-full sm:w-auto ml-6">
          <div className="bg-white p-2 rounded-md">
            <HomeIcon className="w-5 h-5 fill-black" />
          </div>
          <p className="uppercase font-medium  xl:text-xl md:text-xl sm:text-1xl">
            home / {props?.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
