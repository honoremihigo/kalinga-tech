import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Check, AlertTriangle, ClipboardList, Calendar, User, RefreshCw, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import lostPropertiesService from '../../../../Services/Dispatch/lostPropertyService';
import bookingService from '../../../../Services/Dispatch/bookingService';


const UpsertLostPropertyModal = ({ isOpen, onClose, onSubmit, property, isLoading, title }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    bookingNumber: '', // Changed from bokingNumber to bookingNumber
    booking: null,
    phone: '',
    email: ''
  });
  const [bookingValidated, setBookingValidated] = useState(false);
  const [bookingValidating, setBookingValidating] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        itemName: property.itemName || '',
        itemDescription: property.itemDescription || '',
        bookingNumber: property.bookingNumber || '',
        booking: property.booking || null,
        phone: property.phone || '',
        email: property.email || ''
      });
      setBookingValidated(!!property.bookingNumber);
      setBookingError('');
      setFormErrors({});
    } else if (!property && isOpen) {
      setFormData({
        itemName: '',
        itemDescription: '',
        bookingNumber: '',
        booking: null,
        phone: '',
        email: ''
      });
      setBookingValidated(false);
      setBookingError('');
      setFormErrors({});
    }
  }, [property, isOpen]);

  const validateBookingNumber = async (bookingNumber) => {
    if (!bookingNumber.trim()) {
      setBookingError('Please enter a booking number');
      return;
    }

    setBookingValidating(true);
    setBookingError('');

    try {
      const response = await bookingService.getBookingByNumber(bookingNumber.trim());
      console.log('new dta:',response);
      
      if (response) {
        setFormData(prev => ({ 
          ...prev, 
          booking: response,
          phone: response.clientPhone || prev.phone,
          email: response.clientEmail || prev.email
        }));
        setBookingValidated(true);
        setBookingError('');
      } else {
        setBookingValidated(false);
        setFormData(prev => ({ ...prev, booking: null }));
        setBookingError('Booking not found. Please check the booking number and try again.');
      }
    } catch (error) {
      console.error('Error searching booking:', error);
      setBookingError(`Failed to find booking: ${error.message}`);
    } finally {
      setBookingValidating(false);
    }
  };

  const handleBookingNumberChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, bookingNumber: value }));
    
    if (bookingValidated) {
      setBookingValidated(false);
      setFormData(prev => ({ ...prev, booking: null }));
    }
    
    if (bookingError) {
      setBookingError('');
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.itemName.trim()) {
      errors.itemName = 'Item name is required';
    }

    if (!formData.itemDescription.trim()) {
      errors.itemDescription = 'Item description is required';
    } else if (formData.itemDescription.trim().length < 10) {
      errors.itemDescription = 'Description must be at least 10 characters long';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!bookingValidated) {
      setFormErrors({ booking: 'Please validate the booking number first' });
      return;
    }

    // Prepare data for submission
    const propertyData = {
      itemName: formData.itemName,
      itemDescription: formData.itemDescription,
      bookingNumber: formData.bookingNumber.trim(),
      claimantPhone: formData.phone,
      claimantEmail: formData.email
    };

    onSubmit(propertyData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Booking Number Validation Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-3">Step 1: Verify Booking</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Booking Number from Receipt *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.bookingNumber}
                    onChange={handleBookingNumberChange}
                    placeholder="e.g., BK001"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.bookingNumber || bookingError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => validateBookingNumber(formData.bookingNumber)}
                    disabled={bookingValidating || !formData.bookingNumber.trim() || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {bookingValidating ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                {(formErrors.bookingNumber || bookingError) && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.bookingNumber || bookingError}</p>
                )}
              </div>

              {bookingValidated && formData.booking && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Check size={16} />
                    <span className="font-medium">Booking Verified Successfully!</span>
                  </div>
                  <div className="text-sm text-green-600 space-y-1">
                    <p><strong>Client:</strong> {formData.booking.client.firstName}</p>
                    <p><strong>Driver:</strong> {formData.booking.driver.firstName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Property Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Step 2: Property Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  placeholder="e.g., iPhone 13, Wallet, Laptop"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.itemName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={!bookingValidated || isLoading}
                />
                {formErrors.itemName && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.itemName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={formData.itemDescription}
                  onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                  placeholder="Provide detailed description including color, brand, distinctive features, etc."
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    formErrors.itemDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={!bookingValidated || isLoading}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.itemDescription ? (
                    <p className="text-red-600 text-sm">{formErrors.itemDescription}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Minimum 10 characters</p>
                  )}
                  <span className="text-sm text-gray-400">{formData.itemDescription.length}/500</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+250 788 123 456"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={!bookingValidated || isLoading}
                />
                {formErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">We'll contact you if the item is found</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@domain.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={!bookingValidated || isLoading}
                />
                {formErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">We'll contact you if the item is found</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!bookingValidated || isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : property ? 'Update Property' : 'Report Lost Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default UpsertLostPropertyModal