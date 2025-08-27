import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Car, Mail, Phone, MapPin, Check, AlertTriangle, Calendar, Badge, Eye, RefreshCw, ChevronLeft, ChevronRight, DollarSign, Clock, Users, Route } from 'lucide-react';
import bookingService from '../../../../Services/Dispatch/bookingService';
import { useNavigate } from 'react-router-dom';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const navigate = useNavigate()

  // Fetch all bookings
  const fetchBookings = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const data = await bookingService.getAllBookings() || [];
      setBookings(data || []);
      setFilteredBookings(data || []);
      
      if (showRefreshLoader) {
        showNotification('Bookings refreshed successfully!');
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      showNotification(`Failed to fetch bookings: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings.filter(booking => {
      const matchesSearch = 
        booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||

        booking.client.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client.phoneNumber?.includes(searchTerm) ||
        booking.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.dropoffAddress?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || booking.bookingStatus === statusFilter;
      const matchesPaymentStatus = !paymentStatusFilter || booking.paymentStatus === paymentStatusFilter;

      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchTerm, bookings, statusFilter, paymentStatusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBookings.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteBooking = async () => {
    setIsLoading(true);
    try {
      if (!selectedBooking) {
        throw new Error('No booking selected for deletion');
      }

      const response = await bookingService.deleteBooking(selectedBooking.id);
      
      setBookings(prev => prev.filter(booking => booking.id !== selectedBooking.id));
      setFilteredBookings(prev => prev.filter(booking => booking.id !== selectedBooking.id));
      
      setIsDeleteModalOpen(false);
      setSelectedBooking(null);
      showNotification('Booking deleted successfully!');
    } catch (error) {
      showNotification(`Failed to delete booking: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      ACCEPTED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Accepted' },
      IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'In Progress' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      PAID: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Navigation functions (to be implemented based on your routing setup)
  const navigateToCreate = () => {
    // Navigate to create booking page
    navigate('/Dispatch/dashboard/ReservationFormDipatch')

  };

  const navigateToEdit = (bookingId) => {
    // Navigate to edit booking page
    console.log('Navigate to edit booking:', bookingId);
  };

  const navigateToView = (bookingNumber) => {
    // Navigate to view booking details page
    navigate(`${bookingNumber}`)
    console.log('Navigate to view booking:', bookingNumber);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Pagination Component
  const PaginationComponent = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} entries
        </p>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="flex items-center gap-1 mx-2">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );

  // Delete Modal Component
  const DeleteModal = () => (
    isDeleteModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Reservation</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete Reservation "{selectedBooking?.bookingNumber}"? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBooking}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && <RefreshCw size={16} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Card View Component (Mobile/Tablet)
  const CardView = () => (
    <div className="lg:hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {currentItems.map((booking, index) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Booking Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      #{booking.bookingNumber}
                    </h3>
                    {booking.returnTrips?.length > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Return
                      </span>
                    )}
                  </div>
                  <div className="flex items-center py-2 text-sm gap-2">
                    <span>Reservation status:</span>
                    {getStatusBadge(booking.bookingStatus)}
                  </div>
                  <div className="flex items-center py-2 text-sm gap-2">
                    <span>Payment status:</span>
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={() => navigateToView(booking.bookingNumber)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View booking"
                  >
                    <Eye size={16} />
                  </button>
                  {/* <button
                    onClick={() => navigateToEdit(booking.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit booking"
                  >
                    <Edit3 size={16} />
                  </button> */}
                  <button
                    onClick={() => openDeleteModal(booking)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                    title="Delete booking"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {booking.client.firstName} {booking.client.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span className="truncate">{booking.client.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{booking.client.phoneNumber || 'No phone'}</span>
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-green-700 font-medium">From: </span>
                    <span className="text-gray-600 break-words">
                      {booking.pickupAddress?.substring(0, 50)}
                      {(booking.pickupAddress?.length || 0) > 50 ? '...' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-red-700 font-medium">To: </span>
                    <span className="text-gray-600 break-words">
                      {booking.dropoffAddress?.substring(0, 50)}
                      {(booking.dropoffAddress?.length || 0) > 50 ? '...' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price and Details */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(booking.price)}
                  </span>
                </div>
                {booking.distance && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="text-sm text-gray-900">
                      {booking.distance} miles
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment:</span>
                  <span className="text-sm text-gray-900">
                    {booking.paymentMethod || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>
                    {booking.date ? formatDate(booking.date) : 'No date set'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination for Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <PaginationComponent />
      </div>
    </div>
  );

  // Table View Component (Desktop)
  const TableView = () => (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((booking, index) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {startIndex + index + 1}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        #{booking.bookingNumber}
                        {booking.returnTrips?.length > 0 && (
                          <Route size={14} className="text-blue-500" title="Has return trips" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.luggageCount > 0 && (
                          <span className="mr-2">{booking.luggageCount} luggage</span>
                        )}
                        {booking.distance && (
                          <span>{booking.distance} miles</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                
              
                <td className="px-6 py-4 whitespace-nowrap ">
                  <div className="space-y-2 ">

                    {booking.client.firstName || ''} {booking.client.lastName || ''}
                    
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    {getStatusBadge(booking.bookingStatus)}
                    
                  </div>
                </td>
               
              
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(booking.price)}  {' '}
                    <span className="text-sm text-gray-500">
                        
                      {booking.paymentMethod || 'Not set'}
                    </span>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {booking.date ? formatDate(booking.date) : 'No date'}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToView(booking.bookingNumber)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {/* <button
                      onClick={() => navigateToEdit(booking.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button> */}
                    <button
                      onClick={() => openDeleteModal(booking)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      <PaginationComponent />
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 h-[90vh] sm:p-6 lg:p-8">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } animate-in slide-in-from-top-2 duration-300`}>
          {notification.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          {notification.message}
        </div>
      )}

      <div className="h-full overflow-y-auto mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reservations Management</h1>
          </div>
          <p className="text-gray-600">Manage customer bookings and reservations</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Reservation by booking number, customer, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Payments</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
             
              <button
                onClick={navigateToCreate}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus size={20} />
                New Reservation
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && !isRefreshing ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading Reservations...</p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reservations found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter || paymentStatusFilter ? 
                'Try adjusting your search terms or filters.' : 
                'Get started by creating your first Reservation.'}
            </p>
            {!searchTerm && !statusFilter && !paymentStatusFilter && (
              <button
                onClick={navigateToCreate}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                Create Reservation
              </button>
            )}
          </div>
        ) : (
          <>
            <CardView />
            <TableView />
          </>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal />
    </div>
  );
};

export default BookingManagement;