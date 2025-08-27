import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Check, AlertTriangle, ClipboardList, Calendar, Image, User, RefreshCw, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import foundPropertyService from '../../../../Services/Dispatch/foundPropertyService'; // Import the service

import UpsertFoundPropertyModal from '../../../../components/Dispatch/dashboard/foundProperties/UpsertFoundPropertyModal'; // Hypothetical modal component
import DeleteFoundPropertyModal from '../../../../components/Dispatch/dashboard/foundProperties/DeleteFoundPropertyModal';
import { API_URL } from '../../../../api/api';
import { useNavigate } from 'react-router-dom';
import { FcApprove } from 'react-icons/fc';


const FoundPropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  const navigate = useNavigate()
  // Fetch all properties
  const fetchProperties = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await foundPropertyService.getAllFoundProperties();
      setProperties(data);
      setFilteredProperties(data);
      if (showRefreshLoader) showNotification('Properties refreshed successfully!');
    } catch (error) {
      showNotification(`Failed to fetch properties: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter(property =>
      property.itemDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.driver.firstName?.toString().includes(searchTerm) ||
      property.driver.lastName?.toString().includes(searchTerm) ||
      property.driver.status?.toString().includes(searchTerm) 
    );
    setFilteredProperties(filtered);
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

  const handleAddProperty = async (propertyData, image) => {
    setIsLoading(true);
    try {
      
      const validation = foundPropertyService.validateFoundPropertyData(propertyData);
      if (!validation.isValid) throw new Error(Object.values(validation.errors).join(', '));

      const response = await foundPropertyService.createFoundProperty(propertyData, image);
      await fetchProperties();
      setIsAddModalOpen(false);
      showNotification('Property added successfully!');
    } catch (error) {
      showNotification(`Failed to add property: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProperty = async (propertyData, image) => {
    setIsLoading(true);
    try {
      if (!selectedProperty) throw new Error('No property selected for editing');
      const validation = foundPropertyService.validateFoundPropertyData(propertyData);
      if (!validation.isValid) throw new Error(Object.values(validation.errors).join(', '));

      const response = await foundPropertyService.updateFoundProperty(selectedProperty.id, propertyData, image);
      await fetchProperties();
      setIsEditModalOpen(false);
      setSelectedProperty(null);
      showNotification('Property updated successfully!');
    } catch (error) {
      showNotification(`Failed to update property: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    setIsLoading(true);
    try {
      if (!selectedProperty) throw new Error('No property selected for deletion');
      await foundPropertyService.deleteFoundProperty(selectedProperty.id);
      setProperties(prev => prev.filter(prop => prop.id !== selectedProperty.id));
      setFilteredProperties(prev => prev.filter(prop => prop.id !== selectedProperty.id));
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
      showNotification('Property deleted successfully!');
    } catch (error) {
      showNotification(`Failed to delete property: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveProperty = async (approvalData) => {
    setIsLoading(true);
    try {
      const validation = foundPropertyService.validateApprovalData(approvalData);
      if (!validation.isValid) throw new Error(Object.values(validation.errors).join(', '));

      await foundPropertyService.approveFoundProperty(approvalData);
      await fetchProperties();
      setIsApproveModalOpen(false);
      setSelectedProperty(null);
      showNotification('Property claim approved successfully!');
    } catch (error) {
      showNotification(`Failed to approve property: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const openApproveModal = (property) => {
    setSelectedProperty(property);
    setIsApproveModalOpen(true);
  };

  const openViewModal = (property) => {
    if(!property) return null
    console.log(property);
    
    navigate(`${property.id}`)
    
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayImageUrl = (imageUrl) => {
    return `${API_URL}${imageUrl || ''}`; // Adjust if you have a specific method in FoundPropertyService
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsApproveModalOpen(false);
    setIsViewModalOpen(false);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {currentItems.map((property, index) => (
        <div 
          key={property.id} 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden group"
        >
          {/* Image Section */}
          <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
            {property.imageUrl ? (
              <img
                src={getDisplayImageUrl(property.imageUrl)}
                alt="Property"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => (e.target.style.display = 'none')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <Image size={32} className="text-gray-400" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border
                ${property.status === 'returned' 
                  ? 'bg-emerald-500/90 text-white border-emerald-400/30' 
                  : 'bg-amber-500/90 text-white border-amber-400/30'
                }`}>
                {property.status === 'returned' ? '✓ Returned' : '⏳ Pending'}
              </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Content Section */}
          <div className="p-5">
            {/* Header */}
            <div className="mb-4">
              <h3 
                className="font-semibold text-gray-900 text-lg leading-tight mb-2 line-clamp-2" 
                title={property.description}
              >
                {property.description}
              </h3>
              
              {/* Driver Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-white" />
                </div>
                <div className="font-medium text-gray-700">
                  {`${property.driver?.firstName || ''} ${property.driver?.lastName || ''}`.trim() || 'Unknown Driver'}
                </div>
              </div>
            </div>

            {/* Date Info */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg px-3 py-2">
              <Calendar size={12} className="text-gray-400" />
              <span>Found on {formatDate(property.createdAt)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex gap-1">
                <button
                  onClick={() => openViewModal(property)}
                  className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-105"
                  title="View property"
                >
                  <Eye size={16} />
                </button>
              
                <button
                  onClick={() => openEditModal(property)}
                  disabled={isLoading}
                  className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-105"
                  title="Edit property"
                >
                  <Edit3 size={16} />
                </button>
                
                <button
                  onClick={() => openDeleteModal(property)}
                  disabled={isLoading}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-105"
                  title="Delete property"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
            
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Found Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((property, index) => (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{startIndex + index + 1}</span>
                </td>
                <td className="px-6 whitespace-nowrap">
                  <div className="flex items-center h-16 w-20  gap-3">
                    
                      {property.imageUrl ? (
                        <img
                          src={getDisplayImageUrl(property.imageUrl)}
                          alt="Property"
                          className="w-full h-full object-cover "
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      ) : (
                        <Image size={20} />
                      )}
                  
                 
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{`${property.driver?.firstName || '' } ${property.driver?.lastName || ''} ` }</div>
                </td>
               
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${property.status === 'returned' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm text-gray-600">{property.status || 'Pending'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDate(property.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
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
            <div className="p-2 bg-blue-600 rounded-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Found Properties Management</h1>
          </div>
          <p className="text-gray-600">Manage found properties and their claims</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties by description or driver ID..."
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
                Add Property
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
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first property.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                Add Property
              </button>
            )}
          </div>
        ) : (
          <>
            <CardView />
            <TableView />
          </>
        )}
        <UpsertFoundPropertyModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={closeAllModals}
          onSubmit={isEditModalOpen ? handleEditProperty : handleAddProperty}
          property={selectedProperty}
          isLoading={isLoading}
          title={isEditModalOpen ? 'Edit Property' : 'Add New Property'}
        />
       
        <DeleteFoundPropertyModal
          isOpen={isDeleteModalOpen}
          onClose={closeAllModals}
          onConfirm={handleDeleteProperty}
          item={selectedProperty}
          isLoading={isLoading}
          type="property"
        />
      
      </div>
    </div>
  );
};

export default FoundPropertiesManagement;