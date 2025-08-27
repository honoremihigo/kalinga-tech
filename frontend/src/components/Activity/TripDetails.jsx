/* eslint-disable react/prop-types */
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TripDetails = ({ trip }) => {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg flex flex-col gap-2 border border-gray-300">
      <button
        onClick={() => navigate("/trips")}
        className="flex items-center text-[#293751] mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <h2 className="text-xl font-bold mb-4">Trip Details</h2>
      <p className="text-gray-700">
        <strong>Reference:</strong> {trip.ref}
      </p>
      <p className="text-gray-700">
        <strong>Date:</strong> {trip.date}
      </p>
      <p className="text-gray-700">
        <strong>From:</strong> {trip.from}
      </p>
      <p className="text-gray-700">
        <strong>To:</strong> {trip.to}
      </p>
      <p className="text-gray-700">
        <strong>Vehicle:</strong> {trip.vehicle}
      </p>
      <p className="text-gray-700">
        <strong>Price:</strong> {trip.price}
      </p>
      <p className={"text-gray-700 "}>
        <strong>Status:</strong>{" "}
        <span
          className={`py-1 text-sm px-2 rounded-2xl  text-white ${trip.status === "Completed" ? "bg-green-600" : "bg-red-500"}`}
        >
          {trip.status}
        </span>
      </p>
      <p className="text-gray-700 mt-4 border-t pt-2">
        <strong>Details:</strong> {trip.details}
      </p>
    </div>
  );
};

export default TripDetails;
