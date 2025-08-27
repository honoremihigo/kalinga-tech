/* eslint-disable react/prop-types */
import React from "react";
import { FaCar, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/trips?ref=${trip.ref}`)}
      className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-4 w-full"
    >
      <div className="flex justify-between text-gray-600 text-sm mb-2">
        <span>Ref: {trip.ref}</span>
        <span className="flex items-center gap-1">
          <FaClock /> {trip.date}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
        <div>
          <p className="text-gray-800 font-semibold text-[16px] sm:mb-2 line-clamp-2">
            {trip.from}
          </p>
          <p className="text-gray-600 text-xs whitespace-nowrap">{trip.to}</p>
        </div>
        <div className="bg-[#293751] text-white rounded-md p-3 flex flex-col items-center">
          <FaCar className="text-2xl" />
          <p className="font-semibold">{trip.vehicle}</p>
          <p className="text-lg font-bold">{trip.price}</p>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs mt-1">
            {trip.status}
          </span>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button className="border border-[#293751] text-blue-900 px-4 py-2 rounded-md hover:bg-[#293751] hover:text-white">
          Rebook Now
        </button>
        <button
          onClick={() => navigate(`/trips?ref=${trip.ref}`)}
          className="border border-gray-400 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Show Details
        </button>
      </div>
    </div>
  );
};

export default TripCard;
