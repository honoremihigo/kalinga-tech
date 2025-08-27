import React from "react";

const QualityCard = ({ SvgIcon, title, des }) => {
  return (
    <div className=" w-full xl:w-12/12 lg:6/12  md:flex   items-center gap-3   lg:flex-row xl:flex-row ">
      <div className=" w-[70px] h-[70px]  md:w-[80px] md:h-[80px] bg-[#293751] p-4 rounded-full flex justify-center items-center">
        <SvgIcon className=" w-[40px] h-[40px]  fill-white " />
      </div>
      <div className=" flex flex-col gap-2 ">
        <h1 className=" text-2xl font-bold ">{title}</h1>
        <p className=" text-sm font-light ">{des}</p>
      </div>
    </div>
  );
};

export default QualityCard;
