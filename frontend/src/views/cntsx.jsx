import React, { useState, useEffect, useRef } from "react";
import {
  useLoadScript,
  GoogleMap,
  DirectionsRenderer,
  Autocomplete,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import carimage from "../assets/abyride x.png";
import { IoTimeSharp } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { IoIosPerson } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import { BiSolidChevronDownSquare } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import ConfirmBookingModal from "./confimBooking";
import { IoIosCar } from "react-icons/io";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { SavePaymentMethod } from "../Services/Landing/paymentServices";
import { BookRide } from "../Services/Landing/requestRideService";
import { data, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaDotCircle } from "react-icons/fa";
import RequestRideService, {
  convertTimeToDateTime,
} from "../Services/ClientProcess/requestRide/RequestRideService";

const libraries = ["places"];

const RideBooking = () => {
  // Load Google Maps API with useLoadScript
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_PLACES_API || "YOUR_API_KEY_HERE", // Replace with your API key
    libraries: libraries,
  });

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    pickLong: "",
    pickLat: "",
    dropLong: "",
    dropLat: "",
    pickTime: "",
    pickPerson: "Me",
  });
  const [isConfirmed, setIsConfirmed] = useState(null);

  const [showSwitchRider, setShowSwitchRider] = useState(false);
  const [selectedRider, setSelectedRider] = useState("Me");
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [availableDriver, setAvailableDriver] = useState([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [valid, setValid] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [geocoder, setGeocoder] = useState(null);

  const [finalSelection, setFinalSelection] = useState("Pick Time");

  // Refs for autocomplete inputs
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);

  // Add this state to track if we should show the current location marker
  const [showCurrentLocationMarker, setShowCurrentLocationMarker] =
    useState(false);

  // Get current location using geolocation
  const isFormFilled = formData.pickup.trim() !== "";

  // Initialize geocoder when maps API is loaded
  useEffect(() => {
    if (isLoaded && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [isLoaded, geocoder]);

  // Get current location and set as pickup
  useEffect(() => {
    if (!geocoder) return; // Wait until geocoder is available

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentCoords = { lat: latitude, lng: longitude };
          setCurrentLocation(currentCoords);
          setPickupCoords(currentCoords);

          // Set this to true to show the marker on the map
          setShowCurrentLocationMarker(true);

          // Update form data with coordinates
          setFormData((prev) => ({
            ...prev,
            pickLat: latitude,
            pickLong: longitude,
          }));

          // Use reverse geocoding to get address
          geocoder.geocode({ location: currentCoords }, (results, status) => {
            if (status === "OK" && results[0]) {
              const address = results[0].formatted_address;
              setFormData((prev) => ({
                ...prev,
                pickup: address,
              }));
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation({ lat: 37.7749, lng: -122.4194 }); // San Francisco
        },
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setCurrentLocation({ lat: 37.7749, lng: -122.4194 }); // San Francisco
    }
  }, [geocoder]);

  // Calculate route whenever pickup or dropoff coordinates change
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      calculateRoute();
    }
  }, [pickupCoords, dropoffCoords]);

  const handlePlaceSelect = (type) => {
    let place = null;

    if (type === "pickup" && pickupRef.current) {
      place = pickupRef.current.getPlace();
    } else if (type === "dropoff" && dropoffRef.current) {
      place = dropoffRef.current.getPlace();
    }

    if (place && place.geometry) {
      const { lat, lng } = place.geometry.location;
      if (type === "pickup") {
        setPickupCoords({ lat: lat(), lng: lng() });
        setFormData((prev) => ({
          ...prev,
          pickLat: lat(),
          pickLong: lng(),
          pickup: place.formatted_address || place.name,
        }));
      } else {
        setDropoffCoords({ lat: lat(), lng: lng() });
        setFormData((prev) => ({
          ...prev,
          dropLat: lat(),
          dropLong: lng(),
          dropoff: place.formatted_address || place.name,
        }));
      }
    }
  };

  // Calculate route between pickup and dropoff
  const calculateRoute = async () => {
    if (!pickupCoords || !dropoffCoords || !isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin: pickupCoords,
        destination: dropoffCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error("Direction service failed:", error);
      toast.error("Could not calculate route");
    }
  };

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle rider change
  const handleRiderChange = (rider) => {
    setSelectedRider(rider);
    setFormData((prev) => ({ ...prev, pickPerson: rider }));
    setShowSwitchRider(false);
  };

  const handleConfirmSelection = (e) => {
    e.stopPropagation(); // Prevents modal from closing unexpectedly

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Get current time in HH:MM format
    const currentDate = now.toISOString(); // Get current date in YYYY-MM-DD format

    let selectedValue = "";

    if (selectedOption === "Today") {
      // Validate time: must be current or future time
      if (selectedTime < currentTime) {
        toast.error("Time must be the current time or a future time!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }
      selectedValue = `Today at ${selectedTime}`;
    } else {
      // Validate date: must be today or a future date
      if (selectedDate < currentDate) {
        toast.error("Date must be today or a future date!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }
      selectedValue = `For Later on ${selectedDate}`;
    }

    // Update state properly
    setFinalSelection(selectedValue);
    setFormData((prev) => ({
      ...prev,
      pickTime:
        selectedOption == "Today"
          ? convertTimeToDateTime(selectedTime)
          : selectedDate,
    }));

    setShowTimeModal(false);
  };

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setSelectedTime(`${hours}:${minutes + 1}`);
  }, []);

  // Handle form submission
  const handleSubmitPhaseOne = async (e) => {
    e.preventDefault();

    console.log(formData);

    if (!formData.pickup || !formData.dropoff) {
      toast.error("Please enter both pickup and dropoff locations");
      return;
    }

    if (!formData.pickTime || formData.pickTime === "Pick Time") {
      toast.error("Please select a pickup time");
      return;
    }

    setValid((pre) => ({ ...pre, 1: true }));

    try {
      const response = await RequestRideService.requestRide(formData);

      if (response.data) {
        setAvailableDriver((pre) => [...response.data.nearbyDrivers]);
        nextStep();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // element for time model
  const elementForTimeModel = () => {
    const minTime = `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowTimeModal(false);
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
          <h2 className="text-lg font-semibold mb-4">
            When do you want to be picked up?
          </h2>

          <div className="space-y-3">
            {/* Select Today / Later */}
            <div className="border rounded-lg p-3 bg-gray-100">
              <select
                className="bg-transparent focus:outline-none w-full text-gray-600"
                onChange={(e) => setSelectedOption(e.target.value)}
                value={selectedOption}
              >
                <option value="Today">Today</option>
                <option value="For Later">For Later</option>
              </select>
            </div>

            {/* Show Time Input if "Today" is selected */}
            {selectedOption === "Today" && (
              <div className="border rounded-lg p-3 bg-gray-100">
                <input
                  type="time"
                  className="bg-transparent focus:outline-none w-full text-gray-600"
                  onChange={(e) => setSelectedTime(e.target.value)}
                  value={selectedTime}
                  min={minTime}
                />
              </div>
            )}

            {/* Show Date Input if "For Later" is selected */}
            {selectedOption === "For Later" && (
              <div className="border rounded-lg p-3 bg-gray-100">
                <input
                  type="datetime-local"
                  className="bg-transparent focus:outline-none w-full text-gray-600"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  value={selectedDate}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <button
            className="mt-6 w-full bg-black text-white font-medium py-2 rounded-lg focus:outline-none"
            onClick={handleConfirmSelection}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  };

  // for switching
  const elementForSwitchRiders = () => {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowSwitchRider(false);
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
          <h2 className="text-lg font-semibold mb-4">Switch rider</h2>
          <div className="space-y-3">
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedRider === "Me" ? "bg-gray-100" : ""
              }`}
              onClick={() => handleRiderChange("Me")}
            >
              <IoIosPerson className="text-gray-600 mr-3" />
              Me
              {selectedRider === "Me" && (
                <span className="ml-auto text-black">●</span>
              )}
            </div>
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedRider === "someone else" ? "bg-gray-100" : ""
              }`}
              onClick={() => handleRiderChange("someone else")}
            >
              <IoPersonAdd className="text-gray-600 mr-3" />
              Order ride for someone else
              {selectedRider === "someone else" && (
                <span className="ml-auto text-black">●</span>
              )}
            </div>
          </div>
          <button
            className="mt-6 w-full bg-black text-white font-medium py-2 rounded-lg focus:outline-none"
            onClick={() => setShowSwitchRider(false)}
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  //  the Phase 1 :  request ride
  const ElementForFormOFRequestingRide = () => {
    return (
      <div className="p-2 justify-center flex lg:w-1/2 xl:w-1/3  ">
        {/* REQUEST RIDE FORM */}
        <form
          onSubmit={handleSubmitPhaseOne}
          className="p-3 w-full md:w-8/12 lg:w-full rounded"
        >
          <h2 className="flex font-bold text-[3rem] md:text-[2.5rem] md:text-center">
            Go anywhere with Abyride
          </h2>

          <div className="flex flex-col gap-2.5 mt-10">
            {/* Pickup Location */}
            <div className="inline-flex items-center w-full rounded-lg p-3 bg-[#e9e9e9]">
              <span className="w-4 h-4 mr-3">
                <FaDotCircle size={16} />
              </span>
              <Autocomplete
                onLoad={(ref) => (pickupRef.current = ref)}
                onPlaceChanged={() => handlePlaceSelect("pickup")}
                className="w-full"
              >
                <input
                  name="pickup"
                  id="pickup"
                  type="text"
                  placeholder="Pickup location"
                  className="bg-transparent focus:outline-none w-full text-black placeholder-black"
                  onChange={handleChange}
                  value={formData.pickup}
                />
              </Autocomplete>
            </div>

            {/* Dropoff Location */}
            <div className="flex items-center w-full rounded-lg p-3 bg-[#e9e9e9]">
              <span className="w-4 h-4 mr-3">
                <FaDotCircle size={16} />
              </span>
              <Autocomplete
                onLoad={(ref) => (dropoffRef.current = ref)}
                onPlaceChanged={() => handlePlaceSelect("dropoff")}
                className="w-full"
              >
                <input
                  name="dropoff"
                  type="text"
                  placeholder="Dropoff location"
                  className="bg-transparent focus:outline-none w-full text-black placeholder-black"
                  onChange={handleChange}
                  value={formData.dropoff}
                />
              </Autocomplete>
            </div>
          </div>

          <div className="flex gap-2 mt-2.5">
            {/* Pickup Time */}
            <div
              className="flex items-center rounded-lg p-3 gap-1 w-full bg-[#e9e9e9] cursor-pointer"
              onClick={() => setShowTimeModal(true)}
            >
              <IoTimeSharp className="text-gray-900 size-6" />
              <div
                className="bg-transparent focus:outline-none w-full text-gray-900"
                name="pickTime"
                readOnly
                disabled
                value={finalSelection}
              >
                <p value={finalSelection}>{finalSelection}</p>
              </div>
            </div>
            {/* For Me */}
            <div
              className="flex items-center rounded-lg p-2 w-full gap-1 bg-[#e9e9e9] cursor-pointer"
              onClick={() => setShowSwitchRider(true)}
            >
              <span className="material-icons text-gray-900">
                <IoPerson className="size-4" />{" "}
              </span>
              <div
                className="bg-transparent focus:outline-none w-full text-black"
                name="pickPerson"
                value={formData.pickPerson}
                readOnly
              >
                <p value={formData.pickPerson}>{formData.pickPerson}</p>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className={`mt-4 w-full p-2.5 font-medium rounded-lg focus:outline-none ${
              isFormFilled ? "bg-black text-white" : "bg-[#293751] text-white"
            }`}
          >
            Search
          </button>

          {/* Show route info if available */}
          {distance && duration && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p>
                <strong>Distance:</strong> {distance}
              </p>
              <p>
                <strong>Duration:</strong> {duration}
              </p>
            </div>
          )}
        </form>
      </div>
    );
  };

  // the phase 2 : choose avalaibale driver

  const ChooseAvailableDriver = () => {
    return (
      <div className="p-2  flex-col max-h-[60vh] gap-3 rounded-md  border border-gray-200 flex lg:w-1/2 xl:w-1/3 break-all  ">
        <div className="p-2  flex-col w-full gap-3 h-[70%] rounded-md flex  break-all  ">
          <h1 className="text-2xl lg:text-3xl">Choose your Driver :</h1>

          {availableDriver.length > 0 ? (
            <>
              <div className="flex gap-3 p-2 border bg-white min-h-[20vh] border-neutral-100  overflow-y-auto flex-col">
                {availableDriver.map((driver, key) => (
                  <div
                    className={`flex border justify-between bg-white ${isConfirmed == driver.id ? "border-black" : "border-gray-50"} cursor-pointer rounded-md p-4`}
                    key={key}
                    onClick={() => setIsConfirmed(driver.id)}
                  >
                    <img
                      src={carimage}
                      className="w-20 h-10 object-cover"
                      alt=""
                    />
                    <div className="flex flex-col  justify-center ">
                      <h1>{driver.carname}</h1>
                      <h2>{driver.carmodel}</h2>
                    </div>

                    <h1>{driver.price}</h1>
                  </div>
                ))}
              </div>

              <button
                className="disabled:opacity-70 p-2 capitalize disabled:cursor-default cursor-pointer text-white w-full bg-black"
                disabled={!isConfirmed}
              >
                confirm ride
              </button>
            </>
          ) : (
            <div className="flex flex-col justify-evenly h-full  items-center">
              <h1 className="text-red-400">there is no avalaibale drivers</h1>
              <button
                className="disabled:opacity-70 p-2 capitalize disabled:cursor-default cursor-pointer text-white w-1/3 bg-black"
                onClick={prevStep}
              >
                go back
              </button>
            </div>
          )}
        </div>

        {distance && duration && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p>
              <strong>Distance:</strong> {distance}
            </p>
            <p>
              <strong>Duration:</strong> {duration}
            </p>
          </div>
        )}
      </div>
    );
  };

  const nextStep = () => {
    // Add validation before moving to next step
    if (validateCurrentStep()) {
      setCurrentStep((prevStep) => prevStep + 1);
      console.log(`working`);
    }
    console.log(`validation failed`);
  };

  // Move to previous step
  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return valid["1"];
      case 2:
        return valid["2"];
      case 3:
        return valid["3"];
      case 4:
        return valid["4"];
      default:
        return true;
    }
  };

  const TrafficManagerOfElement = () => {
    switch (currentStep) {
      case 1:
        return ElementForFormOFRequestingRide();
      case 2:
        return ChooseAvailableDriver();

      default:
        null;
    }
  };

  // Return loading state while Google Maps script is loading
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Google Maps...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-5 sm:p-3 lg:p-4">
      <div className="flex flex-col h-full lg:flex-row w-full md:justify-center p-8 gap-16 rounded-lg relative md:p-5 md:gap-12 sm:gap-1 overflow-hidden xl:w-[4/7]">
        {/* Form Panel */}

        {TrafficManagerOfElement()}

        {/* container for set Time for Ride */}
        {showTimeModal && currentStep == 1 && elementForTimeModel()}

        {/* container for switch for Ride Type */}
        {showSwitchRider && currentStep == 1 && elementForSwitchRiders()}

        {/* Map Display */}
        <div className=" w-full lg:w-1/2 xl:w-2/3">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "500px",
                borderRadius: "12px",
              }}
              center={currentLocation}
              zoom={17}
            >
              {/* Show marker at current location */}
              {showCurrentLocationMarker && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                  title="Your current location"
                />
              )}

              {/* Display the route */}
              {directionsResponse && (
                <DirectionsRenderer
                  directions={directionsResponse}
                  options={{
                    polylineOptions: {
                      strokeColor: "black",
                      strokeWeight: 5,
                    },
                  }}
                />
              )}
            </GoogleMap>
          )}
        </div>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default RideBooking;
