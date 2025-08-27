import React, { useState, useEffect } from 'react';
import { Save, X, Edit, Eye, Calendar, MapPin, Phone, Mail, User, Clock, Car, CreditCard, Ban } from 'lucide-react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Swal from 'sweetalert2';
import ReservationService from '../../../Services/Dispatch/ReservationManagement';
import FeeManagementService from '../../../Services/Dispatch/FeeManagement';
import { calculateCustomRoute } from "../../../Utils/calculateCustomRoute";
import { Link } from 'react-router-dom';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [routeDistance, setRouteDistance] = useState('');
  const [routeDuration, setRouteDuration] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    customerEmail: '',
    customerPhone: '',
    pickupAddress: '',
    dropoffAddress: '',
    pickupLatitude: null,
    pickupLongitude: null,
    dropoffLatitude: null,
    dropoffLongitude: null,
    scheduledDateTime: '',
    numberOfPassengers: 1,
    carCategory: '',
    paymentMethod: '',
    riderType: 'me',
    otherRiderData: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });

  // Google Maps configuration
  const { isLoaded: isGoogleMapsLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.GOOGLE_PLACES_API || "AIzaSyDBaDarG-S951BPfZoUCScMSe_T_v8M0pE",
    libraries: ["places"]
  });

  // Autocomplete refs
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);

  useEffect(() => {
    loadReservations();
    loadCategories();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await ReservationService.getAllReservations();
      setReservations(data);
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to fetch reservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await FeeManagementService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleShowModal = (reservation = null) => {
    setCurrentReservation(reservation);
    if (reservation) {
      setFormData({
        firstName: reservation.firstName || '',
        lastName: reservation.lastName || '',
        customerEmail: reservation.customerEmail || '',
        customerPhone: reservation.customerPhone || '',
        pickupAddress: reservation.pickupAddress || '',
        dropoffAddress: reservation.dropoffAddress || '',
        pickupLatitude: reservation.pickupLatitude || null,
        pickupLongitude: reservation.pickupLongitude || null,
        dropoffLatitude: reservation.dropoffLatitude || null,
        dropoffLongitude: reservation.dropoffLongitude || null,
        scheduledDateTime: reservation.scheduledDateTime || '',
        numberOfPassengers: reservation.numberOfPassengers || 1,
        carCategory: reservation.carCategory || '',
        paymentMethod: reservation.paymentMethod || '',
        riderType: reservation.riderType || 'me',
        otherRiderData: reservation.otherRider || {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        }
      });
    } else {
      // Reset form for new reservation
      setFormData({
        firstName: '',
        lastName: '',
        customerEmail: '',
        customerPhone: '',
        pickupAddress: '',
        dropoffAddress: '',
        pickupLatitude: null,
        pickupLongitude: null,
        dropoffLatitude: null,
        dropoffLongitude: null,
        scheduledDateTime: '',
        numberOfPassengers: 1,
        carCategory: '',
        paymentMethod: '',
        riderType: 'me',
        otherRiderData: {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        }
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentReservation(null);
    setRouteDistance('');
    setRouteDuration('');
  };

  const handleShowDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedReservation(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('otherRider.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        otherRiderData: {
          ...prev.otherRiderData,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (phone) => {
    setFormData(prev => ({ ...prev, customerPhone: phone }));
  };

  const handleOtherRiderPhoneChange = (phone) => {
    setFormData(prev => ({
      ...prev,
      otherRiderData: {
        ...prev.otherRiderData,
        phone: phone
      }
    }));
  };

  const handleTimeSelection = (type) => {
    if (type === 'now') {
      const now = new Date();
      const formatted = now.toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, scheduledDateTime: formatted }));
    }
  };

  const onPickupLoad = (autocomplete) => {
    setPickupAutocomplete(autocomplete);
  };

  const onDropoffLoad = (autocomplete) => {
    setDropoffAutocomplete(autocomplete);
  };

  const onPickupPlaceChanged = () => {
    if (pickupAutocomplete) {
      const place = pickupAutocomplete.getPlace();
      if (place.geometry) {
        setFormData(prev => ({
          ...prev,
          pickupAddress: place.formatted_address,
          pickupLatitude: place.geometry.location.lat(),
          pickupLongitude: place.geometry.location.lng()
        }));
      }
    }
  };

  const onDropoffPlaceChanged = () => {
    if (dropoffAutocomplete) {
      const place = dropoffAutocomplete.getPlace();
      if (place.geometry) {
        setFormData(prev => ({
          ...prev,
          dropoffAddress: place.formatted_address,
          dropoffLatitude: place.geometry.location.lat(),
          dropoffLongitude: place.geometry.location.lng()
        }));
      }
    }
  };

  const calculateRoute = async () => {
    if (formData.pickupLatitude && formData.pickupLongitude && 
        formData.dropoffLatitude && formData.dropoffLongitude) {
      try {
        await calculateCustomRoute({
          map: null, // We don't need map instance for just getting distance/duration
          pickup: { 
            lat: formData.pickupLatitude, 
            lng: formData.pickupLongitude 
          },
          dropoff: { 
            lat: formData.dropoffLatitude, 
            lng: formData.dropoffLongitude 
          },
          setPolylinePath: () => {}, // Not needed for this use case
          setDistance: setRouteDistance,
          setDuration: setRouteDuration,
        });
      } catch (error) {
        console.error("Route calculation error:", error);
      }
    }
  };

  useEffect(() => {
    if (formData.pickupLatitude && formData.dropoffLatitude) {
      calculateRoute();
    }
  }, [formData.pickupLatitude, formData.dropoffLatitude]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reservationPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        pickupAddress: formData.pickupAddress,
        dropoffAddress: formData.dropoffAddress,
        pickupLatitude: formData.pickupLatitude || null,
        pickupLongitude: formData.pickupLongitude || null,
        dropoffLatitude: formData.dropoffLatitude || null,
        dropoffLongitude: formData.dropoffLongitude || null,
        scheduledDateTime: formData.scheduledDateTime,
        numberOfPassengers: parseInt(formData.numberOfPassengers) || 1,
        carCategory: formData.carCategory || "",
        paymentMethod: formData.paymentMethod || "",
        riderType: formData.riderType || "me",
        otherRider: formData.riderType === "someoneElse" ? {
          firstName: formData.otherRiderData?.firstName || "",
          lastName: formData.otherRiderData?.lastName || "",
          email: formData.otherRiderData?.email || "",
          phone: formData.otherRiderData?.phone || ""
        } : null,
        distance: routeDistance,
        duration: routeDuration
      };

      if (currentReservation) {
        await ReservationService.updateReservation(currentReservation.id, reservationPayload);
        Swal.fire('Updated!', 'Reservation has been updated.', 'success');
      } else {
        await ReservationService.createReservation(reservationPayload);
        Swal.fire('Created!', 'New reservation has been created.', 'success');
      }
      handleCloseModal();
      loadReservations();
    } catch (err) {
      Swal.fire('Error', err.message || 'Operation failed', 'error');
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: 'Cancel Reservation?',
      text: 'This will cancel the reservation. Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        await ReservationService.cancelReservation(id);
        Swal.fire('Cancelled!', 'Reservation has been cancelled.', 'success');
        loadReservations();
      } catch (err) {
        Swal.fire('Error', err.message || 'Failed to cancel reservation', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading reservations...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Reservation Management</h3>
        <button
          onClick={() => handleShowModal()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          New Reservation
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Phone Number </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Payment Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Distance</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Created</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-left text-xs">
                  <div className="font-medium text-gray-900">
                    {reservation.firstName} {reservation.lastName}
                  </div>
                </td>
                <td className="px-4 py-2 text-left text-xs">
                  <div className="text-gray-600">{reservation.phoneNumber}</div>
             </td>
                   <td className="px-4 py-2 text-left text-xs">
              <div className="text-gray-500">{reservation.email}</div>
                </td> 
                <td className="px-4 py-2 text-center text-xs font-medium text-gray-900">
                  ${reservation.price?.toFixed(2) || '0.00'}
                </td>
                <td className="px-4 py-2 text-center text-xs">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reservation.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : reservation.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {reservation.paymentStatus || 'pending'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center text-xs text-gray-900">
                  {reservation.distance || 'N/A'}
                </td>
             <td className="px-4 py-2 text-center text-xs text-gray-500">
                  {new Date(reservation.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`${reservation.id}`}
                      className="text-blue-500 hover:text-blue-700"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleShowModal(reservation)}
                      className="text-green-500 hover:text-green-700"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Cancel"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500 text-sm">
                  No reservations found. Click New Reservation to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
{/* Create/Edit Modal */}
   {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {currentReservation ? 'Edit Reservation' : 'New Reservation'}
                </h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <div className="border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all pl-10 pr-3 py-2">
                      <PhoneInput
                        value={formData.customerPhone}
                        onChange={handlePhoneChange}
                        className="w-full"
                        defaultCountry="US"
                        international
                        withCountryCallingCode
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isGoogleMapsLoaded && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Autocomplete
                        onLoad={onPickupLoad}
                        onPlaceChanged={onPickupPlaceChanged}
                      >
                        <input
                          type="text"
                          name="pickupAddress"
                          value={formData.pickupAddress}
                          onChange={handleFormChange}
                          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="Enter pickup address"
                          required
                        />
                      </Autocomplete>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dropoff Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Autocomplete
                        onLoad={onDropoffLoad}
                        onPlaceChanged={onDropoffPlaceChanged}
                      >
                        <input
                          type="text"
                          name="dropoffAddress"
                          value={formData.dropoffAddress}
                          onChange={handleFormChange}
                          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="Enter dropoff address"
                          required
                        />
                      </Autocomplete>
                    </div>
                  </div>
                </div>
              )}

              {routeDistance && routeDuration && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl">
                  <div className="flex items-center space-x-6 text-sm text-blue-800">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <strong>Distance:</strong> <span className="ml-1">{routeDistance}</span>
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <strong>Duration:</strong> <span className="ml-1">{routeDuration}</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Scheduled Time <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3 mb-3">
                    <button
                      type="button"
                      onClick={() => handleTimeSelection('now')}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      Now
                    </button>
                    <span className="text-sm text-gray-500">or schedule for later</span>
                  </div>
                  <input
                    type="datetime-local"
                    name="scheduledDateTime"
                    value={formData.scheduledDateTime}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Passengers <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfPassengers"
                    value={formData.numberOfPassengers}
                    onChange={handleFormChange}
                    min="1"
                    max="8"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Car Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="carCategory"
                    value={formData.carCategory}
                    onChange={handleFormChange}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleFormChange}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  >
                    <option value="">Select Method</option>
                    <option value="card">Credit Card</option>
                    <option value="cash App">Cash App</option>
                    <option value="cash">Cash</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
              </div>

              {formData.riderType === 'someoneElse' && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Other Rider Details
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherRider.firstName"
                        value={formData.otherRiderData.firstName}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherRider.lastName"
                        value={formData.otherRiderData.lastName}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="otherRider.email"
                        value={formData.otherRiderData.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                        <PhoneInput
                          value={formData.otherRiderData.phone}
                          onChange={handleOtherRiderPhoneChange}
                          className="w-full"
                          defaultCountry="US"
                          international
                          withCountryCallingCode
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-[12px] text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {currentReservation ? 'Update' : 'Create'} Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Reservation Details</h3>
                <button onClick={handleCloseDetails} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Name:</strong> {selectedReservation.firstName} {selectedReservation.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedReservation.customerEmail}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedReservation.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Car className="w-5 h-5 mr-2 text-blue-600" />
                    Trip Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Category:</strong> {selectedReservation.carCategory}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Passengers:</strong> {selectedReservation.numberOfPassengers}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Distance:</strong> {selectedReservation.distance || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Duration:</strong> {selectedReservation.duration || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Addresses
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <strong>Pickup:</strong> {selectedReservation.pickupAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Dropoff:</strong> {selectedReservation.dropoffAddress}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Timing
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Scheduled:</strong> {new Date(selectedReservation.scheduledDateTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Created:</strong> {new Date(selectedReservation.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Payment
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Method:</strong> {selectedReservation.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Amount:</strong> ${selectedReservation.price?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <strong>Status:</strong> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                        selectedReservation.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedReservation.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedReservation.paymentStatus || 'pending'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedReservation.otherRider && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Other Rider Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Name:</strong> {selectedReservation.otherRider.firstName} {selectedReservation.otherRider.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedReservation.otherRider.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedReservation.otherRider.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end p-8 border-t border-gray-200">
              <button
                onClick={handleCloseDetails}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;