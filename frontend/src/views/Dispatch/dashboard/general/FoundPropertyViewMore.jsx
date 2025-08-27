import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import foundPropertyService from '../../../../Services/Dispatch/foundPropertyService';
import { API_URL } from '../../../../api/api';
import { X } from 'lucide-react';

const FoundPropertyViewMore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Modal state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [approving, setApproving] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [approveForm, setApproveForm] = useState({
    foundPropertyId: '',
    claimantId: '',
    name: '',
    email: '',
    phone: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApproveForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', approveForm);
    // You can send approveForm data to backend here
  };


  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await foundPropertyService.getFoundPropertyById(id);
      setProperty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      returned: 'bg-green-100 text-green-800 border-green-300',
      unclaimed: 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Pagination logic
  const getPaginatedClaims = () => {
    if (!property.claims) return [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return property.claims.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    if (!property.claims) return 0;
    return Math.ceil(property.claims.length / itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, getTotalPages()));
  };

  const handleApproveClick = (claim) => {
    setSelectedClaim(claim);
    setShowApprovalModal(true);
  };

  const handleCloseModal = () => {
    setShowApprovalModal(false);
    setSelectedClaim(null);
  };

  const handleApproveClaimant = async () => {
    if (!selectedClaim) return;

    try {
      setApproving(true);
      const approvalData = {
        foundPropertyId: property.id,
        claimantId: selectedClaim.id,
        name: approveForm.fullName,
        email: approveForm.email,
        phone: approveForm.phone,
        description: approveForm.description
      };

      await foundPropertyService.approveFoundProperty(approvalData);

      // Refresh property details to show updated status
      await fetchPropertyDetails();

      // Close modal and show success message
      handleCloseModal();

      // You can add a toast notification here if you have one
      alert('Claimant approved successfully!');
    } catch (err) {
      console.error('Error approving claimant:', err);
      alert('Error approving claimant. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-blue-600 font-medium">Loading property details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Property</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchPropertyDetails}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/found-properties')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-6">The requested property could not be found.</p>
          <button
            onClick={() => navigate('/found-properties')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 h-[90vh] sm:p-6 lg:p-8 overflow-y-auto">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="flex items-center space-x-4">
              {getStatusBadge(property.status)}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Found Property Details</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Property Image */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Property Image
              </h2>
            </div>

            <div className="p-6">
              {property.imageUrl && !imageError ? (
                <img
                  src={`${API_URL}${property.imageUrl}`}
                  alt="Found Property"
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>
                      {/* Approved Claimant Information */}
            {property.approvedClaimant && (
              <div className="bg-white rounded-lg  p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Approved Claimant
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{property.approvedClaimant.fullName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{property.approvedClaimant.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{property.approvedClaimant.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{property.approvedClaimant.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{property.itemDescription}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Found</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{property.locationFound}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Found</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">{formatDate(property.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            {property.driver && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Driver Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {property.driver.firstName} {property.driver.lastName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{property.driver.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{property.driver.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

  

            {/* Return Information */}
            {property.status === 'returned' && (property.returnerName || property.returnerEmail || property.returnerPhone) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Return Information
                </h2>
                <div className="space-y-3">
                  {property.returnerName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Returner Name</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{property.returnerName}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {property.returnerPhone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{property.returnerPhone}</p>
                      </div>
                    )}
                    {property.returnerEmail && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{property.returnerEmail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Claims Section with Pagination */}
        {property.claims && property.claims.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                All Claims ({property.claims.length})
              </h2>

              {/* Pagination Info */}
              <div className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, property.claims.length)} - {Math.min(currentPage * itemsPerPage, property.claims.length)} of {property.claims.length} claims
              </div>
            </div>

            {/* Claims Grid */}
            <div className="grid gap-4 grid-cols-2 mb-6">
              {getPaginatedClaims().map((claim, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                const isApproved = property.approvedClaimant;

                return (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-4 w-full h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800">Claim #{globalIndex + 1}</h3>
                      <span className="text-sm text-gray-500">{formatDate(claim.createdAt)}</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                        <p className="text-gray-900">{claim.fullName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                        <p className="text-gray-900">{claim.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <p className="text-gray-900">{claim.email || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">{claim.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      {isApproved ? (

                        property.approvedClaimant.id === claim.id ?

                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Approved
                            </span>
                          </>

                          :

                          <>
                            <span className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X size={12} />
                              Rejected
                            </span>
                          </>
                      ) : (
                        <button
                          onClick={() => handleApproveClick(claim)}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition duration-200"
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {getTotalPages() > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md ${currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === getTotalPages()}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="text-sm text-gray-700">
                  Page {currentPage} of {getTotalPages()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedClaim && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Approve Claimant</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Property Image */}
                  <div className='space-y-2'>
                    <h4 className="font-medium text-gray-800 mb-3">Found Property</h4>
                    {property.imageUrl && !imageError ? (
                      <img
                        src={`${API_URL}${property.imageUrl}`}
                        alt="Found Property"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">No image available </p>
                        </div>
                      </div>
                    )}
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 font-medium">Description:</p>
                      <p className="text-gray-800">{property.itemDescription}</p>
                    </div>
                  </div>
                  {/* Claimant Details */}
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-3">Claimant Details</h4>
                    <div className="space-y-1">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedClaim.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email </label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedClaim.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone  </label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedClaim.phone}</p>
                      </div>

                    </div>
                  </div>


                </div>
                {/* approveForm */}
                <div className="flex  gap-2 flex-col">



                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={approveForm.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={approveForm.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={approveForm.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />

                  <textarea
                    name="description"
                    placeholder="Description"
                    value={approveForm.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                  ></textarea>


                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="text-yellow-800 font-medium">Confirm Approval</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        Are you sure you want to approve this claimant? This action will mark the property as returned to this person.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    onClick={handleCloseModal}
                    disabled={approving}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApproveClaimant}
                    disabled={approving}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 flex items-center"
                  >
                    {approving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Approving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve Claimant
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundPropertyViewMore;