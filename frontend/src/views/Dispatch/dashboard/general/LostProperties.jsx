import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Check, AlertTriangle, ClipboardList, Calendar, User, RefreshCw, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import lostPropertiesService from '../../../../Services/Dispatch/lostPropertyService';
import bookingService from '../../../../Services/Dispatch/bookingService';
import DeleteLostPropertyModal from '../../../../components/Dispatch/dashboard/lostProperty/DeleteLostPropertyModal';
import MarkAsFoundModal from '../../../../components/Dispatch/dashboard/lostProperty/MarkAsFoundModal';
import UpsertLostPropertyModal from '../../../../components/Dispatch/dashboard/lostProperty/UpsertLostPropertyModel';

const ViewPropertyModal = ({ isOpen, onClose, property, onMarkAsFound }) => {
  if (!isOpen || !property) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              property.status === 'found' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {property.status === 'found' ? '✅ Found' : '❌ Lost'}
            </div>
            {property.status === 'lost' && (
              <button
                onClick={() => onMarkAsFound(property)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark as Found
              </button>
            )}
          </div>

          {/* Item Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Item Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Item Name</label>
                <p className="text-gray-900">{property.itemName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{property.itemDescription}</p>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Booking Number</label>
                <p className="text-gray-900 font-mono">{property.bokingNumber}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Client</label>
                  <p className="text-gray-900">{property.booking?.client?.firstName || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{property.booking?.client?.phoneNumber || 'No phone'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Driver</label>
                  <p className="text-gray-900">{property.booking?.driver?.firstName || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{property.booking?.driver?.phoneNumber || 'No phone'}</p>
                </div>
              </div>
              {property.booking?.route && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Route</label>
                  <p className="text-gray-900">{property.booking.route}</p>
                </div>
              )}
            </div>
          </div>

          {/* Returner Information (if found) */}
          {property.status === 'found' && (property.returnerName || property.returnerPhone || property.returnerEmail) && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Returner Information</h3>
              <div className="space-y-2">
                {property.returnerName && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{property.returnerName}</p>
                  </div>
                )}
                {property.returnerPhone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{property.returnerPhone}</p>
                  </div>
                )}
                {property.returnerEmail && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{property.returnerEmail}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Reported Date</label>
                <p className="text-gray-900">{formatDate(property.createdAt)}</p>
              </div>
              {property.updatedAt && property.updatedAt !== property.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900">{formatDate(property.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const LostPropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isMarkFoundModalOpen, setIsMarkFoundModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch all properties using the real service
  const fetchProperties = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await lostPropertiesService.getAllLostProperties();
      setProperties(data);
      setFilteredProperties(data);
      if (showRefreshLoader) showNotification('Properties refreshed successfully!');
    } catch (error) {
      console.error('Error fetching properties:', error);
      showNotification(`Failed to fetch properties: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Search and filter logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProperties(properties);
    } else {
      // Use service search method if available, otherwise fallback to client-side
      const filtered = properties.filter(property =>
        property.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.itemDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.bokingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.booking?.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.booking?.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, properties]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProperties.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // CRUD Operations using real service
  const handleAddProperty = async (propertyData) => {
    setIsLoading(true);
    try {
      await lostPropertiesService.createLostProperty(propertyData);
      await fetchProperties();
      setIsAddModalOpen(false);
      showNotification('Lost property reported successfully!');
    } catch (error) {
      console.error('Error creating property:', error);
      showNotification(`Failed to report property: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProperty = async (propertyData) => {
    setIsLoading(true);
    try {
      if (!selectedProperty) throw new Error('No property selected for editing');
      await lostPropertiesService.updateLostProperty(selectedProperty.id, propertyData);
      await fetchProperties();
      setIsEditModalOpen(false);
      setSelectedProperty(null);
      showNotification('Property updated successfully!');
    } catch (error) {
      console.error('Error updating property:', error);
      showNotification(`Failed to update property: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    setIsLoading(true);
    try {
      if (!selectedProperty) throw new Error('No property selected for deletion');
      await lostPropertiesService.deleteLostProperty(selectedProperty.id);
      // Update local state immediately for better UX
      setProperties(prev => prev.filter(prop => prop.id !== selectedProperty.id));
      setFilteredProperties(prev => prev.filter(prop => prop.id !== selectedProperty.id));
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
      showNotification('Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
      showNotification(`Failed to delete property: ${error.message}`, 'error');
      // Refresh data in case of error to ensure consistency
      fetchProperties();
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsFound = async (returnerData) => {
    setIsLoading(true);
    try {
      if (!selectedProperty) throw new Error('No property selected');
      await lostPropertiesService.markAsFound(selectedProperty.id, returnerData);
      await fetchProperties();
      setIsMarkFoundModalOpen(false);
      setSelectedProperty(null);
      showNotification('Property marked as found successfully!');
    } catch (error) {
      console.error('Error marking property as found:', error);
      showNotification(`Failed to mark property as found: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Modal handlers
  const openEditModal = (property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  const openMarkFoundModal = (property) => {
    setSelectedProperty(property);
    setIsMarkFoundModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    setIsMarkFoundModalOpen(false);
    setSelectedProperty(null);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const PaginationComponent = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} entries
        </p>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
              currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
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
                  currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
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
              currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );

  const CardView = () => (
    <div className="md:hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {currentItems.map((property, index) => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate" title={property.itemName}>
                      {property.itemName}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${property.status === 'found' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs text-gray-500 capitalize">{property.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openViewModal(property)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View property"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEditModal(property)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-colors"
                    title="Edit property"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(property)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                    title="Delete property"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">{property.itemDescription}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={14} />
                  <span>Client: {property.booking?.client?.name || 'Unknown'}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Booking: {property.bookingNumber}
                </div>
                {property.status === 'lost' && (
                  <button
                    onClick={() => openMarkFoundModal(property)}
                    className="w-full mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Found
                  </button>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>Reported on {formatDate(property.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <PaginationComponent />
    </div>
  );

  const TableView = () => (
    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((property, index) => (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{startIndex + index + 1}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{property.itemName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={property.itemDescription}>
                    {property.itemDescription}
                  </div>
                </td>
               
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${property.status === 'found' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium capitalize ${property.status === 'found' ? 'text-green-800' : 'text-red-800'}`}>
                      {property.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(property.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openViewModal(property)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEditModal(property)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(property)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    {property.status === 'lost' && (
                      <button
                        onClick={() => openMarkFoundModal(property)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-50 rounded-lg transition-colors"
                        title="Mark as Found"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationComponent />
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 h-[90vh] sm:p-6 lg:p-8">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } animate-in slide-in-from-top-2 duration-300`}>
          {notification.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          {notification.message}
        </div>
      )}
      <div className="h-full overflow-y-auto mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Lost Properties Management</h1>
          </div>
          <p className="text-gray-600">Manage reported lost properties and track their status</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by item name, description, booking number, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-3">
             
              <button
                onClick={() => setIsAddModalOpen(true)}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus size={20} />
                Report Lost Item
              </button>
            </div>
          </div>
        </div>

        {isLoading && !isRefreshing ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading properties...</p>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lost properties found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'No lost properties have been reported yet.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                Report Lost Item
              </button>
            )}
          </div>
        ) : (
          <>
            <CardView />
            <TableView />
          </>
        )}

        {/* Modals */}
        <UpsertLostPropertyModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={closeAllModals}
          onSubmit={isEditModalOpen ? handleEditProperty : handleAddProperty}
          property={selectedProperty}
          isLoading={isLoading}
          title={isEditModalOpen ? 'Edit Lost Property' : 'Report Lost Item'}
        />

        <ViewPropertyModal
          isOpen={isViewModalOpen}
          onClose={closeAllModals}
          property={selectedProperty}
          onMarkAsFound={openMarkFoundModal}
        />

        <MarkAsFoundModal
          isOpen={isMarkFoundModalOpen}
          onClose={closeAllModals}
          onSubmit={handleMarkAsFound}
          property={selectedProperty}
          isLoading={isLoading}
        />

        <DeleteLostPropertyModal
          isOpen={isDeleteModalOpen}
          onClose={closeAllModals}
          onConfirm={handleDeleteProperty}
          item={selectedProperty}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
};

export default LostPropertiesManagement