import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import {  
  useLoadScript,
  GoogleMap,
  DirectionsRenderer,
  Autocomplete,
  Marker,
  Polyline, 
} from '@react-google-maps/api';
import { FaDotCircle } from 'react-icons/fa';
import { IoTimeSharp } from 'react-icons/io5';

const GuestRideBooking = () => {
  // Form state
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    pickLat: null,
    pickLong: null,
    dropoffLat: null,
    dropoffLong: null,
    time: "",
    email: "",
    name: "",
    phone: "",
  });

  // Map and directions state
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.7749,
    lng: -122.4194 // Default to San Francisco
  });
  const [finalSelection, setFinalSelection] = useState("Pick Time");
  const [showTimeModal, setShowTimeModal] = useState(false);

  // References for autocomplete inputs
  const pickupRef = useRef();
  const dropoffRef = useRef();

  // Check if form is sufficiently filled to submit
  const isFormFilled = formData.pickup.trim() !== "" && formData.dropoff.trim() !== "";

  // Load Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.GOOGLE_PLACES_API || "AIzaSyDBaDarG-S951BPfZoUCScMSe_T_v8M0pE",
    libraries: ["places"]
  });

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location if geolocation fails
        }
      );
    }
  }, []);

  // Handle place selection from autocomplete
  const handlePlaceSelect = (type) => {
    if (type === "pickup" && pickupRef.current) {
      const place = pickupRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        setFormData({
          ...formData,
          pickup: place.formatted_address || place.name,
          pickLat: place.geometry.location.lat(),
          pickLong: place.geometry.location.lng()
        });
      }
    } else if (type === "dropoff" && dropoffRef.current) {
      const place = dropoffRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        setFormData({
          ...formData,
          dropoff: place.formatted_address || place.name,
          dropoffLat: place.geometry.location.lat(),
          dropoffLong: place.geometry.location.lng()
        });
      }
    }
    // Calculate route after both locations are set
    if (formData.pickup && formData.dropoff) {
      calculateRoute();
    }
  };

  // Calculate and display route on map
  const calculateRoute = async () => {
    if (!formData.pickup || !formData.dropoff || !map) {
      return; // Don't calculate if addresses are not provided or map isn't loaded
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const results = await directionsService.route({
        origin: formData.pickup,
        destination: formData.dropoff,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);

      // Adjust map to fit the route
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(results.routes[0].legs[0].start_location);
      bounds.extend(results.routes[0].legs[0].end_location);
      map.fitBounds(bounds);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle time selection confirmation
  const handleConfirmSelection = (e) => {
    setFinalSelection(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormFilled) {
      return; // Don't submit if form isn't properly filled
    }
    
    // Here you would typically send the booking data to your backend
    console.log("Submitting booking:", {
      ...formData,
      distance,
      duration
    });
    
    // Add your API call or other submission logic here
    // For example:
    // const response = await fetch('your-api-endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
  };

  // If Google Maps API isn't loaded yet, show loading message
  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <Header title='Quick Ride Booking' />
      <div className="flex flex-col lg:flex-row items-center justify-center p-5 sm:p-3 lg:p-4">
        <div className="flex flex-col h-full lg:flex-row w-full md:justify-center p-8 gap-16 rounded-lg relative md:p-5 md:gap-12 sm:gap-1 overflow-hidden xl:w-[4/7]">
          <div className="p-2 justify-center flex w-full lg:w-200">
            <form
              onSubmit={handleSubmit}
              className="p-3 w-full md:w-8/12 lg:w-full rounded"
            >
              <h2 className="flex font-bold text-[3rem] md:text-[2.5rem] md:text-center">
                Quick Ride with Abyride
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

              {/* Ride details display */}
              {distance && duration && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <p className="text-sm">Distance: {distance} • Duration: {duration}</p>
                </div>
              )}

              <div className="flex gap-2 mt-2.5">
                {/* Pickup Time */}
                <div
                  className="flex items-center rounded-lg p-3 w-full bg-[#e9e9e9] cursor-pointer"
                  onClick={() => setShowTimeModal(true)}
                >
                  <IoTimeSharp className="text-gray-900 size-6" />
                  <select
                    className="bg-transparent focus:outline-none w-full text-gray-900"
                    name="pickTime"
                    onChange={handleConfirmSelection}
                    value={finalSelection}
                  >
                    <option value="Pick Time">Pick Time</option>
                    <option value="Now">Now</option>
                    <option value="In 15 minutes">In 15 minutes</option>
                    <option value="In 30 minutes">In 30 minutes</option>
                    <option value="In 1 hour">In 1 hour</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className={`mt-4 w-full p-2.5 font-medium rounded-lg focus:outline-none ${
                  isFormFilled
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-[#a5b1c8] text-white cursor-not-allowed"
                }`}
                disabled={!isFormFilled}
              >
                Quick Ride Book
              </button>
            </form>
          </div>
          <div className="w-full h-[300px] sm:h-[400px] lg:h-auto lg:w-full relative">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={currentLocation}
              zoom={10}
              onLoad={(map) => setMap(map)}
            >
              {/* Current location marker */}
              <Marker 
                position={currentLocation}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE,
                  scale: 7,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#FFFFFF"
                }}
              />
              
              {/* Route display */}
              {directionsResponse && (
                <DirectionsRenderer 
                  directions={directionsResponse}
                  options={{
                    polylineOptions: {
                      strokeColor: "#FF5733",
                      strokeOpacity: 0.8,
                      strokeWeight: 5,
                    },
                    suppressMarkers: false,
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
      
      {/* Time Selection Modal - You can build this out further as needed */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Select Pickup Time</h3>
            <div className="flex flex-col gap-2">
              {["Now", "In 15 minutes", "In 30 minutes", "In 1 hour"].map((time) => (
                <button
                  key={time}
                  className="p-3 border rounded hover:bg-gray-100"
                  onClick={() => {
                    setFinalSelection(time);
                    setShowTimeModal(false);
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
            <button 
              className="mt-4 w-full p-2 bg-gray-200 rounded"
              onClick={() => setShowTimeModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestRideBooking;