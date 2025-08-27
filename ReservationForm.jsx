import { useEffect, useRef, useState } from 'react';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';


import { FaUser, FaEnvelope, FaPhone, FaTimes, FaUsers } from 'react-icons/fa';

import { X, Calendar, Clock } from 'lucide-react';



import {
  useLoadScript,
  GoogleMap,
  DirectionsRenderer,
  Autocomplete,
  Marker,
  Polyline,
} from '@react-google-maps/api';
import { FaDotCircle, FaLocationArrow, FaMapMarkerAlt } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import DashboardNavbar from '../../components/DashboardNavbar';
import Loader from '../../components/Loading';
import { darkMapStyle, lightMapStyle } from "../../Utils/mapStyles";
import { calculateCustomRoute } from "../../Utils/calculateCustomRoute";
import { createRideReservation } from "../../Services/RequestRide/reservationService";
import { getCurrentLocationWithAddress, formatAddressForDisplay } from "../../Utils/locationUtils";
import PointImage from '../../assets/pin.png';
import FeeManagementService from '../../Services/Dispatch/FeeManagement';

const ReservationFormPageTets = () => {
  // Form state management with updated structure
  const [reservationData, setReservationData] = useState({
    firstName: "",
    lastName: "",
    customerEmail: "",
    customerPhone: "",
    pickupAddress: "",
    dropoffAddress: "",
    scheduledDateTime: "",
    numberOfPassengers: 1,
    carCategory: "",
    paymentMethod: "",
    riderType: "me"
  });

  const navigate = useNavigate();

  // Map and route state
  const [mapInstance, setMapInstance] = useState(null);
  const [routeDistance, setRouteDistance] = useState("");
  const [routeDuration, setRouteDuration] = useState("");
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [polylineRoutePath, setPolylineRoutePath] = useState([]);

  // Current location state
  const [currentLocationAddress, setCurrentLocationAddress] = useState("");
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

  // UI state
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(true);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // New state for additional functionality
  const [showOtherRiderModal, setShowOtherRiderModal] = useState(false);
  const [carCategories, setCarCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);


  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [otherRiderData, setOtherRiderData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [timeOption, setTimeOption] = useState("now"); // "now" or "today"

  // Refs for autocomplete inputs
  const pickupLocationRef = useRef();
  const dropoffLocationRef = useRef();

  // Google Maps API configuration
  const { isLoaded: isGoogleMapsLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.GOOGLE_PLACES_API || "AIzaSyDBaDarG-S951BPfZoUCScMSe_T_v8M0pE",
    libraries: ["places"]
  });



  // API service mock (replace with your actual API service)


  // Check if required form fields are filled
  const isRequiredFieldsFilled = reservationData.pickupAddress &&
    reservationData.dropoffAddress &&
    reservationData.customerEmail &&
    reservationData.customerPhone && reservationData.customerPhone.toString().length >= 10 &&

    reservationData.carCategory &&
    reservationData.paymentMethod;


  // Load car categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categories = await FeeManagementService.getCategories();
        setCarCategories(categories);
      } catch (error) {
        console.error("Error loading car categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);



  // Handle time option change
  useEffect(() => {
    if (timeOption === "now") {
      setReservationData(prev => ({
        ...prev,
        scheduledDateTime: new Date()
      }));
    } else {
      setReservationData(prev => ({
        ...prev,
        scheduledDateTime: ""
      }));
    }
  }, [timeOption]);

  // Apply map theme based on dark mode setting
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setOptions({
        styles: isDarkModeEnabled ? darkMapStyle : lightMapStyle,
      });
    }
  }, [mapInstance, isDarkModeEnabled]);

  // Get user's current location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoadingCurrentLocation(true);

        // First get basic location for map centering
        navigator.geolocation?.getCurrentPosition(
          async (position) => {
            const basicLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            // Set current location immediately for map display
            setCurrentUserLocation(basicLocation);

            // Then get address if Google Maps is loaded
            if (isGoogleMapsLoaded) {
              try {
                const locationData = await getCurrentLocationWithAddress();
                setCurrentLocationAddress(locationData.address);

                // Set as default pickup address
                setReservationData(prev => ({
                  ...prev,
                  pickupAddress: formatAddressForDisplay(locationData.address),
                  pickupLatitude: locationData.lat,
                  pickupLongitude: locationData.lng,
                }));
              } catch (error) {
                console.error("Error getting address:", error);
              }
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Set default location if geolocation fails
            const defaultLocation = { lat: 40.7128, lng: -74.0060 };
            setCurrentUserLocation(defaultLocation);
          }
        );
      } catch (error) {
        console.error("Error initializing location:", error);
        const defaultLocation = { lat: 40.7128, lng: -74.0060 };
        setCurrentUserLocation(defaultLocation);
      } finally {
        setIsLoadingCurrentLocation(false);
      }
    };

    initializeLocation();
  }, [isGoogleMapsLoaded]);

  /**
   * Handle rider type change
   */
  const handleRiderTypeChange = (type) => {
    setReservationData(prev => ({ ...prev, riderType: type }));

    if (type === "other") {
      setShowOtherRiderModal(true);
    }
  };

  /**
   * Handle other rider modal save
   */


  /**
   * Use current location as pickup address
   */
  const useCurrentLocationAsPickup = async () => {
    if (!currentUserLocation) return;

    try {
      setIsLoadingCurrentLocation(true);
      const locationData = await getCurrentLocationWithAddress();

      setReservationData(prev => ({
        ...prev,
        pickupAddress: formatAddressForDisplay(locationData.address),
        pickupLatitude: locationData.lat,
        pickupLongitude: locationData.lng,
      }));

      // Calculate route if dropoff is already selected
      if (reservationData.dropoffLatitude && reservationData.dropoffLongitude) {
        const updatedData = {
          ...reservationData,
          pickupLatitude: locationData.lat,
          pickupLongitude: locationData.lng,
        };
        await calculateRouteInformation(updatedData);
      }
    } catch (error) {
      console.error("Error using current location:", error);
      alert("Unable to get current location. Please enter manually.");
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  };

  /**
   * Handle place selection for pickup or dropoff locations
   * @param {string} locationType - Either "pickup" or "dropoff"
   */
  const handleLocationSelection = async (locationType) => {
    const autocompleteRef = locationType === "pickup"
      ? pickupLocationRef.current
      : dropoffLocationRef.current;

    const selectedPlace = autocompleteRef.getPlace();

    if (!selectedPlace.geometry || !selectedPlace.geometry.location) {
      console.warn("Selected place has no geometry information");
      return;
    }

    const selectedLatitude = selectedPlace.geometry.location.lat();
    const selectedLongitude = selectedPlace.geometry.location.lng();

    const updatedReservationData = {
      ...reservationData,
      [`${locationType}Address`]: selectedPlace.formatted_address || selectedPlace.name,
      [`${locationType}Latitude`]: selectedLatitude,
      [`${locationType}Longitude`]: selectedLongitude,
    };

    setReservationData(updatedReservationData);

    // Calculate route if both pickup and dropoff are selected
    if (
      updatedReservationData.pickupLatitude &&
      updatedReservationData.pickupLongitude &&
      updatedReservationData.dropoffLatitude &&
      updatedReservationData.dropoffLongitude
    ) {
      await calculateRouteInformation(updatedReservationData);
    }
  };

  // Add this function after the handleRiderTypeChange function

  /**
   * Handle other rider modal save
   */
  const handleOtherRiderSave = () => {
    // Validate required fields
    if (!otherRiderData.firstName || !otherRiderData.lastName || !otherRiderData.email || !otherRiderData.phone) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all rider information fields",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(otherRiderData.email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
      return;
    }

    // Validate phone number (minimum 10 digits)
    if (otherRiderData.phone.length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone",
        text: "Please enter a valid phone number",
      });
      return;
    }

    // Update reservation data with other rider info
    setReservationData(prev => ({
      ...prev,
      firstName: otherRiderData.firstName,
      lastName: otherRiderData.lastName,
      customerEmail: otherRiderData.email,
      customerPhone: otherRiderData.phone,
      riderType: "someoneElse"
    }));

    // Close modal
    setShowOtherRiderModal(false);

    // Show success message

  };

  // Also add a function to handle modal cancellation
  const handleOtherRiderCancel = () => {
    // Reset rider type to "me" if cancelling
    setReservationData(prev => ({ ...prev, riderType: "me" }));

    // Reset other rider data
    setOtherRiderData({
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    });

    // Close modal
    setShowOtherRiderModal(false);
  };

  /**
   * Calculate and display route information between pickup and dropoff
   * @param {Object} locationData - Contains pickup and dropoff coordinates
   */
  const calculateRouteInformation = async (locationData) => {
    try {
      await calculateCustomRoute({
        map: mapInstance,
        pickup: {
          lat: locationData.pickupLatitude,
          lng: locationData.pickupLongitude
        },
        dropoff: {
          lat: locationData.dropoffLatitude,
          lng: locationData.dropoffLongitude
        },
        setPolylinePath: setPolylineRoutePath,
        setDistance: setRouteDistance,
        setDuration: setRouteDuration,
      });
    } catch (error) {
      console.error("Route calculation error:", error);
    }
  };

  /**
   * Handle form input changes
   * @param {Event} event - Input change event
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReservationData(previousData => ({
      ...previousData,
      [name]: value
    }));
  };

  /**
   * Handle phone number change from PhoneInput component
   * @param {string} phoneNumber - Selected phone number
   */
  const handlePhoneNumberChange = (phoneNumber) => {
    setReservationData(previousData => ({
      ...previousData,
      customerPhone: phoneNumber
    }));
  };



  /**
   * Submit reservation form
   * @param {Event} event - Form submit event
   */
  const handleReservationSubmit = async (event) => {
    event.preventDefault();

    if (!isRequiredFieldsFilled) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmittingForm(true);

    try {
      const reservationPayload = {
        ...reservationData,
        otherRiderData: reservationData.riderType === "someoneElse" ? otherRiderData : null,
        routeDistance,
        routeDuration,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      // ✅ Log the data being sent
      console.log("Submitting reservation payload:", reservationPayload);

      const response = await createRideReservation(reservationPayload);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Ride scheduled successfully!",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        resetReservationFormPageTets();


        // ✅ Redirect to reservation-pending page
        navigate('/reservation-pending');
      } else {
        throw new Error(response.message || "Failed to create reservation");
      }
    } catch (error) {
      console.error("Reservation submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to book ride. Please try again.",
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetReservationFormPageTets = () => {
    setReservationData({
      firstName: "",
      lastName: "",
      customerEmail: "",
      customerPhone: "",
      pickupAddress: "",
      dropoffAddress: "",
      pickupLatitude: null,
      pickupLongitude: null,
      dropoffLatitude: null,
      dropoffLongitude: null,
      scheduledDateTime: "",
      numberOfPassengers: 1,
      carCategory: "",
      paymentMethod: "",
      riderType: "me"
    });
    setPolylineRoutePath([]);
    setRouteDistance("");
    setRouteDuration("");
    setOtherRiderData({
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    });
    setTimeOption("now");
  };


  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");


  const handleScheduleClick = () => {
    setTimeOption("scheduled");
    setShowCalendar(true);
  };

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTime) {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      setReservationData({ ...reservationData, scheduledDateTime: dateTime });
      setShowCalendar(false);
    }
  };

  const handleCancel = () => {
    setShowCalendar(false);
    setTimeOption("now");
    setSelectedDate("");
    setSelectedTime("");
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Generate time options (every 30 minutes)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        times.push({ value: time, display: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];





  // Show loader while Google Maps is loading or location is being fetched
  if (!isGoogleMapsLoaded || !currentUserLocation) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className='h-[100vh] '>
      <DashboardNavbar />




      {/* Other Rider Modal */}
      {showOtherRiderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border-2 border-blue-500 p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-black">Other Rider Information</h3>
              <button
                onClick={() => setShowOtherRiderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative w-full">
                  <FaUser className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={otherRiderData.firstName}
                    onChange={(e) => setOtherRiderData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full pl-8 pr-2 py-2 bg-gray-100 text-black rounded text-sm placeholder:text-xs border-2 border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="relative w-full">
                  <FaUser className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={otherRiderData.lastName}
                    onChange={(e) => setOtherRiderData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full pl-8 pr-2 py-2 bg-gray-100 text-black rounded text-sm placeholder:text-xs border-2 border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative w-full">
                  <FaEnvelope className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={otherRiderData.email}
                    onChange={(e) => setOtherRiderData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-8 pr-2 py-2 bg-gray-100 text-black rounded text-sm placeholder:text-xs border-2 border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="relative w-full">
                  <PhoneInput
                    country={'us'}
                    value={otherRiderData.phone}
                    onChange={(phone) => setOtherRiderData(prev => ({ ...prev, phone }))}
                    inputClass="!w-full !bg-gray-100 !text-black !py-2 !pl-8 !pr-2 !rounded !outline-none !border-2 !border-transparent focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200"
                    containerClass="!w-full"
                    buttonClass="!bg-gray-100 !border-none !rounded-l"
                    enableSearch
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowOtherRiderModal(false)}
                  className="w-full px-2 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 text-sm border-2 border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOtherRiderSave}
                  className="w-full px-2 py-2 bg-[#293751] text-white rounded hover:bg-gray-700 text-sm border-2 border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}







      <div className="flex flex-col lg:flex-row items-center justify-center  border border-gray-200 ">
        {/* Reservation Form Section */}
        <div className="p-3 w-full lg:w-[43%] m-2">
          <form onSubmit={handleReservationSubmit} className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-3xl capitalize w-[90%] md:w-[90%] leading-tight font-bold">
              Get ready for your first trip
            </h2>
            {/* Rider Type Selection */}
            <div className="space-y-2 w-full p-1 rounded-md">
              <label className="text-sm font-medium">Who is this ride for?</label>
              {/* Radio Button Options */}
              <div className="flex gap-4 w-full">
                {/* Option 1: For Me */}
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="riderType"
                    value="me"
                    checked={reservationData.riderType === "me"}
                    onChange={(e) => handleRiderTypeChange(e.target.value)}
                    className="hidden"
                  />
                  <div className={`flex items-center justify-center w-full px-2 py-3 rounded-lg  text-sm border-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200 ${reservationData.riderType === "me" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                    <FaUser className="h-4 w-4 mr-1" />
                    For Me
                  </div>
                </label>

                {/* Option 2: For Someone Else */}
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="riderType"
                    value="other"
                    checked={reservationData.riderType === "other"}
                    onChange={(e) => handleRiderTypeChange(e.target.value)}
                    className="hidden"
                  />
                  <div className={`flex items-center justify-center w-full px-2 py-3 rounded-lg border text-sm border-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200 ${reservationData.riderType === "other" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                    <FaUsers className="h-4 w-4 mr-1" />
                    For Someone Else
                  </div>
                </label>
              </div>
            </div>



            {/* Customer Information Row (only show if "me" is selected) */}
            {reservationData.riderType === "me" && (
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  name="firstName"
                  placeholder="First Name"
                  className="w-full px-2 py-3 rounded-lg  text-sm border-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200 placeholder:text-xs"
                  onChange={handleInputChange}
                  value={reservationData.firstName}
                  required
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full px-2 py-3 rounded-lg  text-sm border-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200"
                  onChange={handleInputChange}
                  value={reservationData.lastName}
                  required
                />
              </div>
            )}



            {/* Email and Phone (only show if "me" is selected) */}
            {reservationData.riderType === "me" && (

              <>
                <div className="flex gap-2">
                  <input
                    name="customerEmail"
                    placeholder="Email Address"
                    type="email"
                    className="w-full px-2 py-3 rounded-lg  text-sm border-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200placeholder:text-xs"
                    onChange={handleInputChange}
                    value={reservationData.customerEmail}
                    required
                  />

                  <PhoneInput
                    country={'us'}
                    value={reservationData.customerPhone}
                    onChange={handlePhoneNumberChange}
                    inputClass="!w-full !bg-gray-200 !text-black p-6 !rounded !outline-none !border-none"
                    containerClass="!w-full"
                    buttonClass="!bg-gray-100 !border-none"
                    enableSearch
                    placeholder="Phone number"
                    required
                  />
                </div>
              </>
            )}

            {/* Location Selection Row */}
            <div className="flex flex-col md:flex-row gap-2">
              {/* Pickup Location */}
              <div className="w-full md:w-1/2 relative">
                <Autocomplete
                  onLoad={ref => pickupLocationRef.current = ref}
                  onPlaceChanged={() => handleLocationSelection("pickup")}
                >
                  <div className="flex items-center px-2 py-3 rounded-lg  text-sm border-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200 w-full">
                    <FaDotCircle className="mr-1 text-sm" />
                    <input
                      name="pickupAddress"
                      placeholder="Pickup Location"
                      className="w-full bg-transparent outline-none text-black  text-sm placeholder:text-xs"
                      value={reservationData.pickupAddress}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={useCurrentLocationAsPickup}
                      disabled={isLoadingCurrentLocation}
                      className="ml-1 p-0.5 hover:bg-gray-200 rounded transition-colors"
                      title="Use current location"
                    >
                      {isLoadingCurrentLocation ? (
                        <div className="animate-spin w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                      ) : (
                        <FaLocationArrow className="w-3 h-3 text-blue-600" />
                      )}
                    </button>
                  </div>
                </Autocomplete>
              </div>

              {/* Dropoff Location */}
              <div className="w-full md:w-1/2">
                <Autocomplete
                  onLoad={ref => dropoffLocationRef.current = ref}
                  onPlaceChanged={() => handleLocationSelection("dropoff")}
                >
                  <div className="flex items-center px-2 py-3  text-sm border-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200 rounded w-full">
                    <FaDotCircle className="mr-1 text-sm" />
                    <input
                      name="dropoffAddress"
                      placeholder="Dropoff Location"
                      className="w-full bg-transparent outline-none text-black text-sm placeholder:text-xs"
                      value={reservationData.dropoffAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </Autocomplete>
              </div>
            </div>


            <div className=" mx-auto  bg-white">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">When do you need the ride?</label>

                <div className="flex gap-2">
                  {/* Now Option */}
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="timeOption"
                      value="now"
                      checked={timeOption === "now"}
                      onChange={(e) => setTimeOption(e.target.value)}
                      className="hidden"
                    />
                    <div className={`flex items-center justify-center gap-1 p-3 rounded-md border text-xs ${timeOption === "now" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                      <Clock className="h-3 w-3" />
                      <span>Now</span>
                    </div>
                  </label>

                  {/* Scheduled Option */}
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="timeOption"
                      value="scheduled"
                      checked={timeOption === "scheduled"}
                      onChange={handleScheduleClick}
                      className="hidden"
                    />
                    <div className={`flex items-center justify-center gap-1 p-3 rounded-md border text-xs ${timeOption === "scheduled" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                      <Calendar className="h-3 w-3" />
                      <span>Schedule</span>
                    </div>
                  </label>
                </div>

                {/* Display Selected DateTime */}
                {timeOption === "scheduled" && reservationData.scheduledDateTime && (
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <div className="text-sm text-gray-600">Scheduled for:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {formatDateTime(reservationData.scheduledDateTime)}
                    </div>
                    <button
                      onClick={() => setShowCalendar(true)}
                      className="text-xs text-[#293751] hover:text-[#293751] mt-1"
                    >
                      Change date/time
                    </button>
                  </div>
                )}
              </div>

              {/* Calendar Popup Modal */}
              {showCalendar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl p-6 m-4 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Schedule Your Ride</h3>
                      <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Date Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          min={today}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-3 px-2 py-3 rounded-lg  text-sm border-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200"
                        />
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Time
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Choose a time</option>
                          {timeOptions.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.display}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Preview */}
                      {selectedDate && selectedTime && (
                        <div className="p-3 bg-[#293751] rounded-md border border-[#293751]">
                          <div className="text-sm text-white">
                            <strong>Selected:</strong> {formatDateTime(new Date(`${selectedDate}T${selectedTime}`))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDateTimeConfirm}
                        disabled={!selectedDate || !selectedTime}
                        className="flex-1 px-4 py-2 bg-[#293751] text-white rounded-md hover:bg-blue-70
                0 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>










            {/* Car Category and Passengers Row */}
            <div className="flex flex-col md:flex-row gap-2">
              <select
                name="carCategory"
                value={reservationData.carCategory}
                onChange={handleInputChange}
                className="w-full px-2 py-3 bg-gray-100 text-black rounded text-sm"
                required
              >
                <option value="">Select Car Category</option>
                {carCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                name="numberOfPassengers"
                placeholder="Number of Passengers"
                type="number"
                min="1"
                max="8"
                className="w-full px-2 py-3 bg-gray-100 text-black rounded text-sm placeholder:text-xs"
                onChange={handleInputChange}
                value={reservationData.numberOfPassengers}
                required
              />
            </div>

            {/* Payment Method */}
            <select
              name="paymentMethod"
              value={reservationData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-2 py-3 bg-gray-100 text-black rounded text-sm"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Credit Card</option>
              <option value="Cash App">Cash App</option>
              <option value="PayPal">PayPal</option>
            </select>



            {/* Route Information Display */}
            {routeDistance && routeDuration && (
              <div className="text-xs text-gray-600">
                Distance: {routeDistance} | Duration: {routeDuration}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-2 py-3 rounded font-semibold transition-colors text-sm ${isRequiredFieldsFilled && !isSubmittingForm
                ? "bg-[#293751] text-white hover:bg-gray-700"
                : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              disabled={!isRequiredFieldsFilled || isSubmittingForm}
            >
              {isSubmittingForm ? "Scheduling..." : "Schedule Ride"}
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="w-full lg:w-1/2 h-[100%] rounded-xl p-3 ">

          <div className="w-full rounded-xl overflow-hidden shadow-md font-sans bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800">
            { /* Card Header */}
            <div className="bg-[#293751] text-white p-2">
              <h3 className="text-lg font-semibold m-0">Contact Us</h3>
            </div>

            { /* Card Body */}
            <div className="p-3 md:flex">
              { /* Phone */}


              { /* Mobile */}
              <div className="flex items-center ">
                <div className="text-gray-600 w-6 ml-10 flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Mobile: +1 (616) 633-7026</span>
              </div>

              { /* Email */}
              <div className="flex items-center">
                <div className="text-gray-600 w-6 ml-10 flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Email: abyridellc@gmail.com</span>
              </div>
            </div>
          </div>
          <GoogleMap
            onLoad={map => setMapInstance(map)}
            center={currentUserLocation}
            zoom={14}
            mapContainerStyle={{
              width: "100%",
              height: "550px",
              borderRadius: "10px",
              marginTop: "30px"
            }}
            options={{
              styles: isDarkModeEnabled ? darkMapStyle : lightMapStyle
            }}
          >
            {/* Route Polyline */}
            {polylineRoutePath.length > 0 && (
              <Polyline
                path={polylineRoutePath}
                options={{
                  strokeColor: "#070d1f",
                  strokeWeight: 5
                }}
              />
            )}

            {/* Current Location Marker */}
            {currentUserLocation && (
              <Marker
                position={currentUserLocation}
                icon={{
                  url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="3" opacity="0.8"/>
                      <circle cx="12" cy="12" r="3" fill="white"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 16),
                }}
                title="Your Current Location"
                zIndex={1000}
              />
            )}

            {/* Pickup Marker */}
            {reservationData.pickupLatitude && reservationData.pickupLongitude && (
              <Marker
                position={{
                  lat: reservationData.pickupLatitude,
                  lng: reservationData.pickupLongitude
                }}
                icon={{
                  url: PointImage,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                label={{
                  text: "Pickup",
                  color: "white",
                  fontWeight: "bold"
                }}
              />
            )}

            {/* Dropoff Marker */}
            {reservationData.dropoffLatitude && reservationData.dropoffLongitude && (
              <Marker
                position={{
                  lat: reservationData.dropoffLatitude,
                  lng: reservationData.dropoffLongitude
                }}
                icon={{
                  url: PointImage,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                label={{
                  text: "Dropoff",
                  color: "white",
                  fontWeight: "bold"
                }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default ReservationFormPageTets;