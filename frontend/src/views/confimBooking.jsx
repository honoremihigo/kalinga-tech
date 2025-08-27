import React, { useEffect, useState } from "react";
import { BookRide } from "../Services/Landing/requestRideService";
import { FaUser } from "react-icons/fa";

const ConfirmBookingModal = ({
  isOpen,
  onClose,
  formData,
  distance,
  duration,
  CarDriver,
  handleBooking,
}) => {
  const [carData, setCarData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch car by ID

  // Fetch car by ID

  useEffect(() => {
    if (!CarDriver) return;

    console.log("Fetching car for driver:", CarDriver);

    const fetchCarData = async () => {
      setLoading(true);
      try {
        const data = await BookRide.FetchCarByDriver(CarDriver);

        console.log(data);
        setCarData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [CarDriver]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Your Booking</h2>

        <div className="space-y-2">
          <p>
            <strong>Pickup:</strong> {formData.pickup}
          </p>
          <p>
            <strong>Dropoff:</strong> {formData.dropoff}
          </p>
          <p>
            <strong>Distance:</strong> {distance}
          </p>
          <p>
            <strong>Estimated Time:</strong> {duration}
          </p>

          {CarDriver && (
            <div className="border-t pt-3 flex flex-col items-center">
              <img src="abyride x.png" alt="car" className="w-25 h-15" />

              <div className="flex mt-10 ">
                <div className="flex flex-col mr-20">
                  <div className="flex items-center space-x-1">
                    <p className="font-bold"> {`Abyride XL`}</p>
                    <FaUser className="text-gray-700" /> {/* Person icon */}
                    <span>{[`6`]}</span> {/* Number of people */}
                  </div>
                  <p className="font-semibold text-xs">Enjoy Ride with us</p>
                </div>

                <div className="flex flex-col ml-auto">
                  <p>
                    <strong></strong> $ {`16.7`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-between">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-black  text-white rounded"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingModal;
