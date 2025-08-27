/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({ options, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center text-sm px-3 py-2 border rounded-2xl shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
        <FaChevronDown className="ml-2 w-2 h-2" />
      </button>
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-2 text-sm ${selected.toLowerCase() === option.toLowerCase() ? "font-bold" : ""} whitespace-nowrap line-clamp-1 capitalize hover:bg-gray-100 cursor-pointer`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
