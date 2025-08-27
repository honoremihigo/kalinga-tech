// CaseStudyCard.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";

// eslint-disable-next-line react/prop-types
const CaseStudyCard = ({ SvgIcon, bgImage, h1, category }) => {
  return (
    <div className="group relative h-[400px] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt=""
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top Section - Icon */}
        <div className="flex justify-end">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30">
            <SvgIcon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Bottom Section - Text */}
        <div className="text-white">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-3 border border-white/30">
            {category}
          </span>
          <h3 className="text-xl font-bold mb-4 leading-tight">
            {h1}
          </h3>
          
          {/* Read More Button */}
          <NavLink
            to="/blog"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 group/btn"
          >
            Learn More
            <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </NavLink>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-2xl transition-colors duration-300"></div>
    </div>
  );
};

export default CaseStudyCard;