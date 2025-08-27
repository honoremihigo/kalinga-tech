import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Users, CreditCard, Plus, Minus, Map } from 'lucide-react';
import { useJsApiLoader, Autocomplete, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
// Add this import at the top of your component file
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import Swal from 'sweetalert2';
import categoryService from '../../Services/Dispatch/CategoryManagement';
import bookingService from '../../Services/Dispatch/bookingService';
import AutocompleteInput from '../../components/Dispatch/dashboard/reservation/AutoComplete';
import MapView from '../../components/Dispatch/dashboard/reservation/MapView';
import Modal from '../../components/Dispatch/dashboard/reservation/Modal';
import DashboardNavbar from '../../components/DashboardNavbar';
import { useNavigate } from 'react-router-dom';


// Define libraries to load
const libraries = ['places', 'geometry'];

const AbrideReservationForm = () => {
  // Basic user info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // 1. Update the phone state to store both formatted phone and validation status
const [phone, setPhone] = useState('');
const [phoneValid, setPhoneValid] = useState(true);
const [phoneError, setPhoneError] = useState('');

const navigate = useNavigate()

  // Trip details
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupNote, setPickupNote] = useState('');
  const [dropoffNote, setDropoffNote] = useState('');
  const [isPickupModalOpen, setPickupModalOpen] = useState(false);
  const [isDropoffModalOpen, setDropoffModalOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [price, setPrice] = useState(null);

  // Trip type
  const [tripType, setTripType] = useState('oneWay');
  const [returnTrips, setReturnTrips] = useState([{
    pickup: '',
    dropoff: '',
    pickupTime: '',
    dropoffTime: '',
    pickupNote: '',
    dropoffNote: ''
  }]);
  const [activeReturnNoteModal, setActiveReturnNoteModal] = useState({ index: -1, type: '' });

  // Luggage
  const [hasLuggage, setHasLuggage] = useState(false);
  const [luggageCount, setLuggageCount] = useState(0);

  // Booking time
  const [bookingTimeType, setBookingTimeType] = useState('now');
  const [customDateTime, setCustomDateTime] = useState('');
  const [nowPlusFiveMin, setNowPlusFiveMin] = useState('');

  // Category and payment
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
const [paymentMethod, setPaymentMethod] = useState('CREDITCARD'); 


// Google Maps API key
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API;

  // Use useJsApiLoader instead of LoadScript to prevent multiple API loading
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  useEffect(() => {
    async function getCategories() {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        Swal.fire('Error', err.message || 'Failed to fetch categories', 'error');
      }
    }
    getCategories();
  }, []);

  // Initialize "now + 5 min" datetime
useEffect(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
  setNowPlusFiveMin(formatted);
}, []);


  // Handle luggage checkbox
  useEffect(() => {
    if (!hasLuggage) {
      setLuggageCount(0);
    } else if (luggageCount === 0) {
      setLuggageCount(1);
    }
  }, [hasLuggage]);

  // Show map when both addresses are available
  useEffect(() => {
    if (pickupAddress && dropoffAddress) {
      setShowMap(true);
    } else {
      setShowMap(false);
      setDistance(null);
      setDuration(null);
      setPrice(null);
    }
  }, [pickupAddress, dropoffAddress]);

// Calculate price based on selected category and date/time
useEffect(() => {
  if (selectedCategory && (customDateTime || nowPlusFiveMin) && distance) {
    const generatePrice = () => {
      if (!selectedCategory.fare || !Array.isArray(selectedCategory.fare)) {
        setPrice(null);
        Swal.fire({
          icon: 'error',
          title: 'Reservation Not Available',
          text: 'No fare data available for the selected category. Please choose another date or time.',
        });
        return;
      }

      const selectedDate = new Date(bookingTimeType === 'now' ? nowPlusFiveMin : customDateTime);
      if (isNaN(selectedDate.getTime())) {
        setPrice(null);
        Swal.fire({
          icon: 'error',
          title: 'Reservation Not Available',
          text: 'Invalid booking date/time. Please choose another date or time.',
        });
        return;
      }

      const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });
      const time = selectedDate.toTimeString().slice(0, 5); // HH:MM format

      const matchingFare = selectedCategory.fare.find(fare => {
        // Validate fare properties
        if (!fare.fromDay || !fare.tillDay || !fare.fromTime || !fare.tillTime) {
          return false;
        }

        // Check day range
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const fromDayIndex = daysOfWeek.indexOf(fare.fromDay);
        const tillDayIndex = daysOfWeek.indexOf(fare.tillDay);
        const currentDayIndex = daysOfWeek.indexOf(dayOfWeek);

        if (fromDayIndex === -1 || tillDayIndex === -1 || currentDayIndex === -1) {
          return false;
        }

        let isDayInRange;
        if (fromDayIndex <= tillDayIndex) {
          isDayInRange = currentDayIndex >= fromDayIndex && currentDayIndex <= tillDayIndex;
        } else {
          isDayInRange = currentDayIndex >= fromDayIndex || currentDayIndex <= tillDayIndex;
        }

        // Check time range
        let isTimeInRange;
        if (fare.fromTime <= fare.tillTime) {
          isTimeInRange = time >= fare.fromTime && time <= fare.tillTime;
        } else {
          // Handle overnight time ranges (e.g., 22:00 to 06:00)
          isTimeInRange = time >= fare.fromTime || time <= fare.tillTime;
        }

        return isDayInRange && isTimeInRange;
      });

      if (matchingFare) {
        // Convert distance from string (e.g., "10.5 miles") to number
        const distanceNum = parseFloat(distance);
        if (isNaN(distanceNum)) {
          setPrice(null);
          Swal.fire({
            icon: 'error',
            title: 'Reservation Not Available',
            text: 'Invalid distance value. Please ensure valid pickup and dropoff addresses.',
          });
          return;
        }

        // Calculate main trip price
        const calculatedPrice = matchingFare.startRate + (matchingFare.startRatePerMile * distanceNum);

        if (tripType === 'roundTrip') {
          // Calculate return trips total price
          let totalReturnPrice = 0;
          
          returnTrips.forEach((trip, index) => {
            if (trip.pickup && trip.dropoff && trip.distance) {
              // Extract numeric distance from return trip
              const returnDistanceNum = typeof trip.distance === 'string' 
                ? parseFloat(trip.distance.replace(/[^\d.]/g, '')) 
                : parseFloat(trip.distance) || 0;

              if (!isNaN(returnDistanceNum) && returnDistanceNum > 0) {
                // Calculate fare for return trip based on its pickup time if available
                let returnMatchingFare = matchingFare; // Default to main trip fare
                
                if (trip.pickupTime) {
                  const returnDate = new Date(trip.pickupTime);
                  if (!isNaN(returnDate.getTime())) {
                    const returnDayOfWeek = returnDate.toLocaleString('en-US', { weekday: 'long' });
                    const returnTime = returnDate.toTimeString().slice(0, 5);
                    
                    // Find matching fare for return trip time
                    const returnFare = selectedCategory.fare.find(fare => {
                      if (!fare.fromDay || !fare.tillDay || !fare.fromTime || !fare.tillTime) {
                        return false;
                      }

                      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      const fromDayIndex = daysOfWeek.indexOf(fare.fromDay);
                      const tillDayIndex = daysOfWeek.indexOf(fare.tillDay);
                      const currentDayIndex = daysOfWeek.indexOf(returnDayOfWeek);

                      if (fromDayIndex === -1 || tillDayIndex === -1 || currentDayIndex === -1) {
                        return false;
                      }

                      let isDayInRange;
                      if (fromDayIndex <= tillDayIndex) {
                        isDayInRange = currentDayIndex >= fromDayIndex && currentDayIndex <= tillDayIndex;
                      } else {
                        isDayInRange = currentDayIndex >= fromDayIndex || currentDayIndex <= tillDayIndex;
                      }

                      let isTimeInRange;
                      if (fare.fromTime <= fare.tillTime) {
                        isTimeInRange = returnTime >= fare.fromTime && returnTime <= fare.tillTime;
                      } else {
                        isTimeInRange = returnTime >= fare.fromTime || returnTime <= fare.tillTime;
                      }

                      return isDayInRange && isTimeInRange;
                    });
                    
                    if (returnFare) {
                      returnMatchingFare = returnFare;
                    }
                  }
                }
                
                // Calculate return trip price
                const returnTripPrice = returnMatchingFare.startRate + (returnMatchingFare.startRatePerMile * returnDistanceNum);
                totalReturnPrice += returnTripPrice;
              }
            }
          });
          
          // Set total price (main trip + all return trips)
          const totalPrice = calculatedPrice + totalReturnPrice;
          setPrice(totalPrice.toFixed(2));
        } else {
          setPrice(calculatedPrice.toFixed(2));
        }
      } else {
        setPrice(null);
        Swal.fire({
          icon: 'error',
          title: 'Reservation Not Available',
          text: 'No matching fare found for the selected date and time. Please choose another date or time.',
        });
      }
    };

    generatePrice();
  } else {
    setPrice(null);
  }
}, [selectedCategory, bookingTimeType, customDateTime, nowPlusFiveMin, distance, tripType, returnTrips]);

  // Add new return trip
  const addReturnTrip = () => {
    setReturnTrips([...returnTrips, {
      pickup: '',
      dropoff: '',
      pickupTime: '',
      dropoffTime: '',
      pickupNote: '',
      dropoffNote: ''
    }]);
  };


  // Remove return trip
  const removeReturnTrip = (index) => {
    if (returnTrips.length > 1) {
      setReturnTrips(returnTrips.filter((_, i) => i !== index));
    }
  };

  // Update return trip field
  const updateReturnTrip = (index, field, value) => {
    const updated = [...returnTrips];
    updated[index][field] = value;
    setReturnTrips(updated);
  };

  // Get minimum datetime (current time)
  const getMinDateTime = () => {
    return new Date().toISOString().slice(0, 16);
  };

  // Handle place selection
  const handlePlaceSelect = (place, field) => {
    console.log('Place selected for', field, ':', place);
  };

  // Handle distance calculation
  const handleDistanceCalculated = (dist, dur) => {
    setDistance(dist);
    setDuration(dur);
  };

  // 2. Phone validation function
const validatePhone = (phone, country) => {
  if (!phone || phone.length < 10) {
    return {
      valid: false,
      error: 'Please enter a valid phone number'
    };
  }
  
  // Check minimum length based on country
  const countryData = country || {};
  const minLength = countryData.dialCode ? countryData.dialCode.length + 7 : 10;
  
  if (phone.length < minLength) {
    return {
      valid: false,
      error: 'Phone number is too short'
    };
  }
  
  return {
    valid: true,
    error: ''
  };
};

// 3. Handle phone input change
const handlePhoneChange = (value, country) => {
  setPhone(value);
  
  const validation = validatePhone(value, country);
  setPhoneValid(validation.valid);
  setPhoneError(validation.error);
};

// Calculate distance and duration for return trips when addresses change
useEffect(() => {
  const calculateReturnTripDistances = async () => {
    if (!window.google || !window.google.maps) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    const updatedTrips = await Promise.all(
      returnTrips.map(async (trip, index) => {
        // Only calculate if both addresses are provided
        if (!trip.pickup || !trip.dropoff) {
          return { ...trip, distance: null, duration: null };
        }

        try {
          const result = await new Promise((resolve, reject) => {
            directionsService.route({
              origin: trip.pickup,
              destination: trip.dropoff,
              travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
              if (status === 'OK') {
                resolve(result);
              } else {
                reject(new Error(`Directions request failed: ${status}`));
              }
            });
          });

          const route = result.routes[0];
          const leg = route.legs[0];
          
          return {
            ...trip,
            distance: leg.distance.text,
            duration: leg.duration.text
          };
        } catch (error) {
          console.error(`Error calculating distance for return trip ${index + 1}:`, error);
          return {
            ...trip,
            distance: 'Unable to calculate',
            duration: 'Unable to calculate'
          };
        }
      })
    );

    setReturnTrips(updatedTrips);
  };

  // Only run if we have return trips and Google Maps is loaded
  if (tripType === 'roundTrip' && returnTrips.length > 0) {
    calculateReturnTripDistances();
  }
}, [returnTrips.map(trip => `${trip.pickup}-${trip.dropoff}`).join(','), tripType]);


  // Helper function to calculate distance and duration for return trips
const calculateReturnTripDistances = async (returnTrips) => {
  if (!window.google || !window.google.maps) {
    console.warn('Google Maps API not loaded');
    return returnTrips.map(trip => ({ ...trip, distance: 0, duration: '' }));
  }

  const directionsService = new window.google.maps.DirectionsService();
  
  const processedTrips = await Promise.all(
    returnTrips.map(async (trip) => {
      try {
        const result = await new Promise((resolve, reject) => {
          directionsService.route({
            origin: trip.pickup,
            destination: trip.dropoff,
            travelMode: window.google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === 'OK') {
              resolve(result);
            } else {
              reject(new Error(`Directions request failed: ${status}`));
            }
          });
        });

        const route = result.routes[0];
        const leg = route.legs[0];
        
        return {
          ...trip,
          distance: parseFloat(leg.distance.text.replace(/[^\d.]/g, '')), // Extract numeric value
          duration: leg.duration.text
        };
      } catch (error) {
        console.error('Error calculating distance for return trip:', error);
        return {
          ...trip,
          distance: 0,
          duration: ''
        };
      }
    })
  );

  return processedTrips;
};

const handleReset = ()=>{
   // Reset form after successful booking
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPickupAddress('');
    setDropoffAddress('');
    setPickupNote('');
    setDropoffNote('');
    setReturnTrips([{
      pickup: '',
      dropoff: '',
      pickupTime: '',
      dropoffTime: '',
      pickupNote: '',
      dropoffNote: '',
      distance: '',

      
    }]);
    setLuggageCount(0);
    setHasLuggage(false);
    setSelectedCategory('');
    setTripType('oneWay');
    setBookingTimeType('now');
    setCustomDateTime('');
    setPaymentMethod('CREDITCARD');
    setDistance(null);
    setDuration(null);
    setPrice(null);
}

// Updated handleSubmit with distance calculation for return trips
const handleSubmit = async () => {
  if (!firstName || !selectedCategory?.name || !lastName || !email || !phone || !pickupAddress || !dropoffAddress || !selectedCategory || !price) {
    Swal.fire({
      icon: 'error',
      title: 'Incomplete Form',
      text: 'Please fill in all required fields and ensure a valid price is calculated. If no price is shown, try selecting a different date or time.',
    });
    return;
  }

  let processedReturnTrips = null;
  if (tripType === 'roundTrip') {
    const validReturnTrips = returnTrips.filter(trip => 
      trip.pickup && 
      trip.pickup.trim() !== '' && 
      trip.dropoff && 
      trip.dropoff.trim() !== '' && 
      trip.pickupTime && 
      trip.pickupTime.trim() !== ''
    );

    if (validReturnTrips.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Return Trip Information',
        text: 'Please fill in at least one complete return trip with pickup address, dropoff address, and pickup time.',
      });
      return;
    }

    // Show loading while calculating distances
    Swal.fire({
      title: 'Processing...',
      text: 'Calculating distances for return trips...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Calculate distances and durations for return trips
      const tripsWithDistances = await calculateReturnTripDistances(validReturnTrips);
      
      processedReturnTrips = tripsWithDistances.map(trip => ({
        returnDate: trip.pickupTime,
        pickupAddress: trip.pickup,
        dropoffAddress: trip.dropoff,
        pickupNote: trip.pickupNote || '',
        dropoffNote: trip.dropoffNote || '',
        distance: trip.distance || 0,
        duration: trip.duration || ''
      }));

      Swal.close(); // Close loading dialog
      
    } catch (error) {
      Swal.close();
      console.error('Error calculating return trip distances:', error);
      
      // Continue with zero distances if calculation fails
      processedReturnTrips = validReturnTrips.map(trip => ({
        returnDate: trip.pickupTime,
        pickupAddress: trip.pickup,
        dropoffAddress: trip.dropoff,
        pickupNote: trip.pickupNote || '',
        dropoffNote: trip.dropoffNote || '',
        distance: 0,
        duration: ''
      }));
    }
  }

  const formData = {
    firstName,
    lastName,
    email,
    phoneNumber: phone,
    pickupAddress,
    dropoffAddress,
    pickupNote: pickupNote || '',
    dropoffNote: dropoffNote || '',
    returnTrips: processedReturnTrips,
    luggageCount: luggageCount || 0,
    date: bookingTimeType === 'now' ? nowPlusFiveMin : customDateTime,
    paymentMethod: paymentMethod,
    distance: parseFloat(distance) || 0,
    duration: duration || '',
    price: Number(price) || 0,
    rideCategory:selectedCategory?.name
  };

  try {
    const response = await bookingService.createClientBooking(formData);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Booking created successfully!',
    }).then(()=>{
    });
    navigate('/reservation-pending',{replace:true})


    
    // Reset form...
    // (same reset code as before)
    // handleReset()
    
  } catch (error) {
    console.error('Booking failed:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to create booking',
    });
  }
};
;

const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % routes.length);
  };

 // Show error if API key is not provided
  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-4">Configuration Required</h1>
              <p className="text-gray-600 mb-4">
                Please replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key to enable autocomplete functionality.
              </p>
              <p className="text-sm text-gray-500">
                You can get an API key from the Google Cloud Console and enable the Places API.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-4">Maps Loading Error</h1>
              <p className="text-gray-600 mb-4">
                Failed to load Google Maps. Please check your internet connection and API key.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Rest of your existing JSX content remains the same */}
          
        <DashboardNavbar />
        
        <div className=" mx-auto px-4 w-full">
          <div className="bg-white rounded-lg w-full  p-8">
            <div className="flex items-start xl:items-center flex-col xl:flex-row justify-between pb-4">

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Abyride Reservation</h1>
              <p className="text-gray-600">Book your ride with us</p>
            </div>

                 <div className=" w-full xl:w-1/2 rounded-xl overflow-hidden shadow-md font-sans bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800">
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

            </div>
            <div className="grid grid-cols-1 w-full xl:grid-cols-4 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Phone Number *
  </label>
  <PhoneInput
    country={'us'} // Default country
    value={phone}
    onChange={handlePhoneChange}
    inputProps={{
      name: 'phone',
      required: true,
      className: `w-full px-12 text-black py-2 border rounded-lg focus:outline-none focus:ring-2 ${
        phoneValid 
          ? 'border-gray-300 focus:ring-slate-500' 
          : 'border-red-300 focus:ring-red-500'
      }`
    }}
    containerClass="w-full"
    buttonClass="!border-gray-300"
    dropdownClass="!bg-white !border-gray-300"
    searchClass="!bg-white"
    enableSearch={true}
    disableSearchIcon={false}
    placeholder="Enter phone number"
    countryCodeEditable={false}
    specialLabel=""
  />
  {/* Error message */}
  {!phoneValid && phoneError && (
    <p className="text-red-500 text-xs mt-1">{phoneError}</p>
  )}
  {/* Success indicator */}
  {phone && phoneValid && (
    <p className="text-green-500 text-xs mt-1">✓ Valid phone number</p>
  )}
</div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Trip Details</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                        <div className="flex gap-2">
                          <AutocompleteInput
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                            placeholder="Enter pickup address"
                            className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                            required
                            onPlaceSelect={(place) => handlePlaceSelect(place, 'pickup')}
                          />
                          <button
                            type="button"
                            onClick={() => setPickupModalOpen(true)}
                            className="px-4 py-2 bg-[#293751] text-white rounded-lg hover:bg-slate-600 flex items-center gap-2"
                          >
                            <MapPin size={16} />
                            Note
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Address</label>
                        <div className="flex gap-2">
                          <AutocompleteInput
                            value={dropoffAddress}
                            onChange={(e) => setDropoffAddress(e.target.value)}
                            placeholder="Enter dropoff address"
                            className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                            required
                            onPlaceSelect={(place) => handlePlaceSelect(place, 'dropoff')}
                          />
                          <button
                            type="button"
                            onClick={() => setDropoffModalOpen(true)}
                            className="px-4 py-2 bg-[#293751] text-white rounded-lg hover:bg-slate-600 flex items-center gap-2"
                          >
                            <MapPin size={16} />
                            Note
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Distance, Duration, and Price Display */}
                    {(distance || duration || price) && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                          <Map size={16} />
                          Trip Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {distance && (
                            <div>
                              <span className="text-gray-600">Distance:</span>
                              <span className="font-medium text-gray-900 ml-2">{distance}</span>
                            </div>
                          )}
                          {duration && (
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium text-gray-900 ml-2">{duration}</span>
                            </div>
                          )}
                          {price && (
                            <div>
                              <span className="text-gray-600">Estimated Price:</span>
                              <span className="font-medium text-gray-900 ml-2">${price}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trip Type Radio Buttons */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Trip Type</label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="tripType"
                              value="oneWay"
                              checked={tripType === 'oneWay'}
                              onChange={(e) => setTripType(e.target.value)}
                              className="mr-3 h-4 w-4 text-slate-600"
                            />
                            <div>
                              <div className="font-medium">One Way</div>
                              <div className="text-sm text-gray-500">Single trip to destination</div>
                            </div>
                          </label>
                          <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="tripType"
                              value="roundTrip"
                              checked={tripType === 'roundTrip'}
                              onChange={(e) => setTripType(e.target.value)}
                              className="mr-3 h-4 w-4 text-slate-600"
                            />
                            <div>
                              <div className="font-medium">Round Trip</div>
                              <div className="text-sm text-gray-500">Trip with return journey</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

               {/* Round Trip Details - Improved UI */}
{tripType === 'roundTrip' && (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-800">Return Trip Details</h3>
      <button
        type="button"
        onClick={addReturnTrip}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        <Plus size={16} />
        Add Return Trip
      </button>
    </div>
    
    {returnTrips.map((trip, index) => (
      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-700">Return Trip {index + 1}</h4>
          {returnTrips.length > 1 && (
            <button
              type="button"
              onClick={() => removeReturnTrip(index)}
              className="text-red-500 hover:text-red-700 p-1"
              title="Remove this return trip"
            >
              <Minus size={16} />
            </button>
          )}
        </div>
        
        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Pickup Address *
            </label>
            <div className="flex gap-2">
              <AutocompleteInput
                value={trip.pickup}
                onChange={(e) => updateReturnTrip(index, 'pickup', e.target.value)}
                placeholder="Enter return pickup address"
                className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                onPlaceSelect={(place) => handlePlaceSelect(place, `return-pickup-${index}`)}
              />
              <button
                type="button"
                onClick={() => setActiveReturnNoteModal({ index, type: 'pickup' })}
                className="px-3 py-2 bg-[#293751] text-white rounded-lg hover:bg-slate-600"
                title="Add pickup note"
              >
                <MapPin size={16} />
              </button>
            </div>
            {/* Validation message */}
            {tripType === 'roundTrip' && !trip.pickup && (
              <p className="text-red-500 text-xs mt-1">Pickup address is required</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Dropoff Address *
            </label>
            <div className="flex gap-2">
              <AutocompleteInput
                value={trip.dropoff}
                onChange={(e) => updateReturnTrip(index, 'dropoff', e.target.value)}
                placeholder="Enter return dropoff address"
                className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                onPlaceSelect={(place) => handlePlaceSelect(place, `return-dropoff-${index}`)}
              />
              <button
                type="button"
                onClick={() => setActiveReturnNoteModal({ index, type: 'dropoff' })}
                className="px-3 py-2 bg-[#293751] text-white rounded-lg hover:bg-slate-600"
                title="Add dropoff note"
              >
                <MapPin size={16} />
              </button>
            </div>
            {/* Validation message */}
            {tripType === 'roundTrip' && !trip.dropoff && (
              <p className="text-red-500 text-xs mt-1">Dropoff address is required</p>
            )}
          </div>
        </div>
        
        {/* Time Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Pickup Time *
            </label>
            <input
              type="datetime-local"
              value={trip.pickupTime}
              onChange={(e) => updateReturnTrip(index, 'pickupTime', e.target.value)}
              min={getMinDateTime()}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            {/* Validation message */}
            {tripType === 'roundTrip' && !trip.pickupTime && (
              <p className="text-red-500 text-xs mt-1">Pickup time is required</p>
            )}
          </div>
          
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Dropoff Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={trip.dropoffTime}
              onChange={(e) => updateReturnTrip(index, 'dropoffTime', e.target.value)}
              min={trip.pickupTime || getMinDateTime()}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <p className="text-gray-500 text-xs mt-1">Leave empty if not needed</p>
          </div> */}
        </div>
        
       
    {/* Enhanced Trip Summary with Distance and Duration */}
{trip.pickup && trip.dropoff && (
  <div className="bg-slate-50 p-3 rounded-lg">
    <h5 className="text-sm font-medium text-gray-800 mb-2">Trip Summary</h5>
    <div className="space-y-1">
      <p className="text-xs text-gray-600">
        <strong>From:</strong> {trip.pickup.length > 50 ? trip.pickup.substring(0, 50) + '...' : trip.pickup}
      </p>
      <p className="text-xs text-gray-600">
        <strong>To:</strong> {trip.dropoff.length > 50 ? trip.dropoff.substring(0, 50) + '...' : trip.dropoff}
      </p>
      {trip.pickupTime && (
        <p className="text-xs text-gray-600">
          <strong>When:</strong> {new Date(trip.pickupTime).toLocaleString()}
        </p>
      )}
      {/* Distance and Duration Display */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200">
        <div className="text-xs">
          <span className="text-gray-500">Distance:</span>
          <div className="font-medium text-gray-800">
            {trip.distance || 'Calculating...'}
          </div>
        </div>
        <div className="text-xs">
          <span className="text-gray-500">Duration:</span>
          <div className="font-medium text-gray-800">
            {trip.duration || 'Calculating...'}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    ))}
    
    {/* Helper text */}
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <div className="text-yellow-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-yellow-800 font-medium">Return Trip Information</p>
          <p className="text-xs text-yellow-700">
            Each return trip requires a pickup address, dropoff address, and pickup time. 
            You can add multiple return trips for complex itineraries.
          </p>
        </div>
      </div>
    </div>
  </div>
)}
                {/* Luggage */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Luggage</h2>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hasLuggage}
                        onChange={(e) => setHasLuggage(e.target.checked)}
                        className="mr-2 h-4 w-4 text-slate-600 rounded focus:ring-slate-500"
                      />
                      Do you have luggage?
                    </label>
                  </div>
                  {hasLuggage && (
                    <div className="max-w-xs">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Luggage</label>
                      <input
                        type="number"
                        min="1"
                        value={luggageCount}
                        onChange={(e) => setLuggageCount(parseInt(e.target.value) || 0)}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                  )}
                </div>

                {/* Booking Time */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Booking Time</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="bookingTimeType"
                        value="now"
                        checked={bookingTimeType === 'now'}
                        onChange={(e) => setBookingTimeType(e.target.value)}
                        className="mr-3 h-4 w-4 text-slate-600"
                      />
                      <div>
                        <div className="font-medium">Book Now</div>
                        <div className="text-sm text-gray-500">Pickup in 5 minutes</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="bookingTimeType"
                        value="later"
                        checked={bookingTimeType === 'later'}
                        onChange={(e) => setBookingTimeType(e.target.value)}
                        className="mr-3 h-4 w-4 text-slate-600"
                      />
                      <div>
                        <div className="font-medium">Schedule Later</div>
                        <div className="text-sm text-gray-500">Choose specific time</div>
                      </div>
                    </label>
                  </div>
                  <div className="max-w-md">
                    {bookingTimeType === 'now' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time (Auto-set to now + 5 min)</label>
                        <input
                          type="datetime-local"
                          value={nowPlusFiveMin}
                          disabled
                          className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Pickup Time</label>
                        <input
                          type="datetime-local"
                          value={customDateTime}
                          onChange={(e) => setCustomDateTime(e.target.value)}
                          min={getMinDateTime()}
                          className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Category Radio Buttons */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Vehicle Category</h2>
                  <div className="space-y-2">
                    <select
                      name="vehicleCategory"
                      className="text-black p-3 border accent-current"
                      required
                      onChange={(e) => {
                        const selected = categories.find(cat => cat.id === parseInt(e.target.value));
                        setSelectedCategory(selected || '');
                      }}
                      value={selectedCategory.id || ''}
                    >
                      <option value="" className="p-4 text-black" disabled>
                        Choose category
                      </option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="p-4 text-black">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Method Radio Buttons */}
                {/* Payment Method Radio Buttons */}
<div className="space-y-4">
  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Payment Method</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
      <input
        type="radio"
        name="paymentMethod"
        value="CREDITCARD"
        checked={paymentMethod === 'CREDITCARD'}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="mr-3 h-4 w-4 text-slate-600"
      />
      <div className="flex items-center">
        <CreditCard size={20} className="mr-3 text-gray-600" />
        <div>
          <div className="font-medium">Credit Card</div>
          <div className="text-sm text-gray-500">Pay with credit or debit card</div>
        </div>
      </div>
    </label>
    <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
      <input
        type="radio"
        name="paymentMethod"
        value="CASH"
        checked={paymentMethod === 'CASH'}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="mr-3 h-4 w-4 text-slate-600"
      />
      <div className="flex items-center">
        <Users size={20} className="mr-3 text-gray-600" />
        <div>
          <div className="font-medium">Cash</div>
          <div className="text-sm text-gray-500">Pay with cash on arrival</div>
        </div>
      </div>
    </label>
  </div>
</div>
                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-[#293751] text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition duration-200"
                  >
                    Book Reservation
                  </button>
                </div>
              </div>

              {/* Right Column - Map */}
              <div className="lg:col-span-2  ">
                <div className="sticky w-full top-8 ">
                  
                  <h2 className="text-xl font-semibold  text-gray-800 border-b pb-2 mb-4">Route Map</h2>

                  <MapView
                    pickupAddress={pickupAddress}
                    dropoffAddress={dropoffAddress}
                    onDistanceCalculated={handleDistanceCalculated}
                  />

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isPickupModalOpen}
          onClose={() => setPickupModalOpen(false)}
          title="Pickup Address Note"
        >
          <textarea
            value={pickupNote}
            onChange={(e) => setPickupNote(e.target.value)}
            placeholder="Add any special instructions for pickup..."
            className="text-black w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setPickupModalOpen(false)}
              className="px-4 py-2 bg-[#293751] text-white rounded-lg hover:bg-slate-600"
            >
              Save Note
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={isDropoffModalOpen}
          onClose={() => setDropoffModalOpen(false)}
          title="Dropoff Address Note"
        >
          <textarea
            value={dropoffNote}
            onChange={(e) => setDropoffNote(e.target.value)}
            placeholder="Add any special instructions for dropoff..."
            className="text-black w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setDropoffModalOpen(false)}
              className="px-4 py-2 bg-[#293751] text-white rounded-lg hover:bg-slate-600"
            >
              Save Note
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={activeReturnNoteModal.index >= 0}
          onClose={() => setActiveReturnNoteModal({ index: -1, type: '' })}
          title={`Return Trip ${activeReturnNoteModal.index + 1} - ${activeReturnNoteModal.type === 'pickup' ? 'Pickup' : 'Dropoff'} Note`}
        >
          <textarea
            value={activeReturnNoteModal.index >= 0 ? returnTrips[activeReturnNoteModal.index]?.[`${activeReturnNoteModal.type}Note`] || '' : ''}
            onChange={(e) => {
              if (activeReturnNoteModal.index >= 0) {
                updateReturnTrip(activeReturnNoteModal.index, `${activeReturnNoteModal.type}Note`, e.target.value);
              }
            }}
            placeholder={`Add special instructions for ${activeReturnNoteModal.type}...`}
            className="text-black w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setActiveReturnNoteModal({ index: -1, type: '' })}
              className="px-4 py-2 bg-[#293751]  text-white rounded-lg hover:bg-slate-600"
            >
              Save Note
            </button>
          </div>
        </Modal>
      </div>
);
};

export default AbrideReservationForm;