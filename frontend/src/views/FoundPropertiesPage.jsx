import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, User, Phone, Mail, X, Eye, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import foundPropertyService from '../Services/Dispatch/foundPropertyService';
import claimantService from '../Services/Landing/ClaimantService';
import { API_URL } from '../api/api';

const FoundPropertiesPage = () => {
  const [foundProperties, setFoundProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [paginatedProperties, setPaginatedProperties] = useState([]);
  
  const [claimFormData, setClaimFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    description: ''
  });
  const [claimFormErrors, setClaimFormErrors] = useState({});
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const totalItems = filteredProperties.length;

  // Load found properties on component mount
  useEffect(() => {
    loadFoundProperties();
    document.body.scrollIntoView({
      behavior:'smooth',
      block:"start"
    })
  }, []);


  // Filter properties based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProperties(foundProperties);
    } else {
      const filtered = foundProperties.filter(property => 
        property.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.locationFound.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, foundProperties]);

  // Update paginated properties when filtered properties or current page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredProperties.slice(startIndex, endIndex);
    setPaginatedProperties(paginated);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const loadFoundProperties = async () => {
    try {
      setLoading(true);
      const properties = await foundPropertyService.getAllFoundProperties();
      // Only show pending properties (not yet returned)
      const pendingProperties = properties.filter(property => property.status === 'pending');
      setFoundProperties(pendingProperties);
      setFilteredProperties(pendingProperties);
    } catch (err) {
      setError('Failed to load found properties. Please try again.');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimProperty = (property) => {
    setSelectedProperty(property);
    setShowClaimModal(true);
    setClaimFormData({
      fullName: '',
      phone: '',
      email: '',
      description: ''
    });
    setClaimFormErrors({});
  };

  const handleCloseModal = () => {
    setShowClaimModal(false);
    setSelectedProperty(null);
    setClaimFormData({
      fullName: '',
      phone: '',
      email: '',
      description: ''
    });
    setClaimFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClaimFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (claimFormErrors[name]) {
      setClaimFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateClaimForm = () => {
    const errors = {};
    
    if (!claimFormData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!claimFormData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (claimFormData.phone.trim().length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    
    if (!claimFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(claimFormData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!claimFormData.description.trim()) {
      errors.description = 'Please describe why this item belongs to you';
    } else if (claimFormData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }
    
    return errors;
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    
    const errors = validateClaimForm();
    if (Object.keys(errors).length > 0) {
      setClaimFormErrors(errors);
      return;
    }
    
    try {
      setSubmittingClaim(true);
      
      const claimData = {
        foundPropertyId: selectedProperty.id,
        fullName: claimFormData.fullName.trim(),
        phone: claimFormData.phone.trim(),
        email: claimFormData.email.trim(),
        description: claimFormData.description.trim()
      };
      
      await claimantService.createClaimant(claimData);

      // await loadFoundProperties()
      
      // Show success message and close modal
      alert('Your claim has been submitted successfully! We will contact you if your claim is verified.');
      handleCloseModal();
      
    } catch (err) {
      console.error('Error submitting claim:', err);
      alert('Failed to submit your claim. Please try again.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  // Pagination functions
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getVisiblePageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let prev = 0;
    for (let i of range) {
      if (i - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (i - prev !== 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading found properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button 
            onClick={loadFoundProperties}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Found Properties</h1>
              <p className="mt-2 text-gray-600">Browse items that have been found and claim what's yours</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {totalItems} items available
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by item description or location..."
            className="block w-full text-black pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Properties Grid */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No found properties are currently available'}
            </p>
          </div>
        ) : (
          <>
            {/* Pagination Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{' '}
                of <span className="font-medium">{totalItems}</span> results
              </p>
              
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Property Image */}
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <img
                    src={`${API_URL}${property.imageUrl}`}
                    alt={property.itemDescription}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                </div>
                
                {/* Property Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.itemDescription}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{property.locationFound}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Found on {formatDate(property.createdAt)}</span>
                    </div>
{/*                     
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div> */}
                  </div>
                  
                  <button
                    onClick={() => handleClaimProperty(property)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Claim This Item
                  </button>
                </div>
              </div>
            ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {getVisiblePageNumbers().map((pageNum, index) => {
                    if (pageNum === '...') {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={` text-black relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border border-blue-600'
                            : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Claim Modal */}
      {showClaimModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Claim This Item</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Property Preview */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex space-x-4">
                <img
                  src={`${API_URL}${selectedProperty.imageUrl}` }
                  alt={selectedProperty.itemDescription}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src ='' ;
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {selectedProperty.itemDescription}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedProperty.locationFound}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Found on {formatDate(selectedProperty.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Form */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={claimFormData.fullName}
                    onChange={handleInputChange}
                    className={` text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      claimFormErrors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {claimFormErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{claimFormErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={claimFormData.phone}
                    onChange={handleInputChange}
                    className={` text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      claimFormErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {claimFormErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{claimFormErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={claimFormData.email}
                    onChange={handleInputChange}
                    className={` text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      claimFormErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {claimFormErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{claimFormErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Why is this your item? *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={claimFormData.description}
                    onChange={handleInputChange}
                    className={` text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      claimFormErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Please provide details about how you lost this item, when, where, and any identifying features that prove it belongs to you..."
                  ></textarea>
                  {claimFormErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{claimFormErrors.description}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={submittingClaim}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitClaim}
                  disabled={submittingClaim}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundPropertiesPage;