import { ChartBarSquareIcon } from "@heroicons/react/16/solid";
import React from "react";

import avatar1 from "../../assets/images/avatar/avatar1.jpg";
import avatar2 from "../../assets/images/avatar/avatar2.jpg";
import avatar3 from "../../assets/images/avatar/avatar3.jpg";
import { motion } from "framer-motion";
import { UserIcon } from "@heroicons/react/16/solid";
import { ChartBarIcon } from "@heroicons/react/16/solid";
import DonutChart from "./charts/DonutChart";

const SideBar = () => {
  const avatars = [avatar1, avatar2, avatar3];

  return (
    <div className="flex flex-col lg:w-10/12 w-full  xl:w-3/12 justify-start items-start h-full gap-3  xl:gap-6">
      {/* business growth card */}

      <div className=" flex w-full justify-center flex-col bg-gray-200 py-7 xl:h-[280px] px-6 rounded-lg">
        <h1 className="capitalize font-medium text-2xl w-3/4 pt-2 pb-4">
          Improve your business grow rate through our services
        </h1>
        <div className="flex w-full border-2 border-b-stone-300 pb-4 ">
          {avatars.map((avatar, key) => (
            <motion.img
              initial={{ x: 0 }}
              animate={{ x: -20 * key }}
              src={avatar}
              key={key}
              className={`h-14 w-14 rounded-full object-cover z[${avatar.length - key}]`}
              alt=""
            ></motion.img>
          ))}
        </div>
      </div>

      {/* card of donut chart */}
      <div className=" flex w-full justify-center flex-col bg-[#293751] text-white  xl:h-1/2  py-10 px-6 rounded-lg">
        <h1 className="w-full font-semibold text-2xl capitalize text-center">
          Customer increase level
        </h1>
        {/*the donut chart  */}
        <DonutChart />
      </div>
    </div>
  );
};

export default SideBar;
