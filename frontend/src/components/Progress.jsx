import { motion } from "framer-motion";
import React from "react";

const Progress = (props) => {
  return (
    <div className=" w-full xl:w-full overflow-hidden h-2.5 bg-gray-200 rounded-full ">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${props?.width}` }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={`h-full  transition duration-100 bg-teal-900 rounded-full `}
      ></motion.div>
    </div>
  );
};

export default Progress;
