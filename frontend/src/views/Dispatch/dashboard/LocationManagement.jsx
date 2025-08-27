import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, MapPin, Navigation, Globe, Check, AlertTriangle, Eye, RefreshCw, ChevronLeft, ChevronRight, Calendar, Heart, StarHalf, Star } from 'lucide-react';
import ViewLocationModal from '../../../components/Dispatch/dashboard/location/ViewLocationModal';
import UpsertLocationModal from '../../../components/Dispatch/dashboard/location/UpsertLocationModal';
import DeleteLocationModal from '../../../components/Dispatch/dashboard/location/DeleteLocationModal';
import locationService from '../../../Services/Dispatch/LocationServices'; // Import your service

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [upsertModalOpen, setUpsertModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notification, setNotification] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Initialize filtered locations
    useEffect(() => {
        setFilteredLocations(locations);
    }, [locations]);

    // Load locations on component mount
    useEffect(() => {
        fetchLocations();
    }, []);

    // Search filtering
    useEffect(() => {
        const filtered = locations.filter(location =>
            location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.address?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLocations(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchTerm, locations]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredLocations.slice(startIndex, endIndex);

    // Generate page numbers for pagination
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

    // Fetch locations from backend
    const fetchLocations = async (showRefreshLoader = false) => {
        if (showRefreshLoader) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const response = await locationService.getAllLocations();
            // Transform backend data to match frontend expectations
            const transformedLocations = response.map(location => ({
                id: location.location_id,
                name: location.name,
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
                is_favorite: location.is_favorite,
                created_by: location.created_by,
                created_at: location.created_at
            }));
            setLocations(transformedLocations);
            
            if (showRefreshLoader) {
                showNotification('Locations refreshed successfully!');
            }
        } catch (error) {
            showNotification(`Failed to fetch locations: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleAddLocation = () => {
        setSelectedLocation(null);
        setEditMode(false);
        setUpsertModalOpen(true);
    };

    const handleEditLocation = (location) => {
        setSelectedLocation(location);
        setEditMode(true);
        setUpsertModalOpen(true);
    };

    const handleDeleteLocation = (location) => {
        setSelectedLocation(location);
        setDeleteModalOpen(true);
    };

    const handleViewLocation = (location) => {
        setSelectedLocation(location);
        setViewModalOpen(true);
    };

    const handleToggleFavorite = async (location) => {
        try {
            // Transform data for backend
            const updateData = {
                name: location.name,
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
                is_favorite: !location.is_favorite
            };

            const response = await locationService.updateLocation(location.id, updateData);
            
            // Update local state
            setLocations(prev => prev.map(loc =>
                loc.id === location.id
                    ? { ...loc, is_favorite: response.is_favorite }
                    : loc
            ));
            
            showNotification(
                `Location ${response.is_favorite ? 'added to' : 'removed from'} favorites!`
            );
        } catch (error) {
            showNotification(`Failed to update favorite: ${error.message}`, 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCoordinates = (lat, lng) => {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    };

    const closeAllModals = () => {
        setUpsertModalOpen(false);
        setViewModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedLocation(null);
        setEditMode(false);
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

    // Handle form submission for create/update
    const handleSubmit = async (locationData) => {
        setIsLoading(true);
        try {
            // Validate data first
            const validation = locationService.validateLocationData(locationData);
            if (!validation.isValid) {
                const errorMessage = Object.values(validation.errors).join(', ');
                throw new Error(errorMessage);
            }

            // Prepare data for backend (ensure proper field names and types)
            const backendData = {
                name: locationData.name.trim(),
                address: locationData.address.trim(),
                latitude: parseFloat(locationData.latitude),
                longitude: parseFloat(locationData.longitude),
                is_favorite: locationData.is_favorite || false,
                // created_by can be added here if you have user context
            };

            let response;
            if (editMode && selectedLocation) {
                // Update existing location
                response = await locationService.updateLocation(selectedLocation.id, backendData);
                
                // Update local state
                setLocations(prev => prev.map(loc =>
                    loc.id === selectedLocation.id
                        ? {
                            id: response.location_id,
                            name: response.name,
                            address: response.address,
                            latitude: response.latitude,
                            longitude: response.longitude,
                            is_favorite: response.is_favorite,
                            created_by: response.created_by,
                            created_at: response.created_at
                        }
                        : loc
                ));
                showNotification('Location updated successfully!');
            } else {
                // Create new location
                response = await locationService.createLocation(backendData);
                
                // Add to local state
                const newLocation = {
                    id: response.location_id,
                    name: response.name,
                    address: response.address,
                    latitude: response.latitude,
                    longitude: response.longitude,
                    is_favorite: response.is_favorite,
                    created_by: response.created_by,
                    created_at: response.created_at
                };
                setLocations(prev => [newLocation, ...prev]);
                showNotification('Location added successfully!');
            }

            closeAllModals();
        } catch (error) {
            showNotification(`Failed to save location: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle location deletion
    const handleDelete = async () => {
        if (!selectedLocation) return;

        setIsLoading(true);
        try {
            await locationService.deleteLocation(selectedLocation.id);
            
            // Remove from local state
            setLocations(prev => prev.filter(location => location.id !== selectedLocation.id));
            closeAllModals();
            showNotification('Location deleted successfully!');
        } catch (error) {
            showNotification(`Failed to delete location: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination Component
    const PaginationComponent = () => (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredLocations.length)} of {filteredLocations.length} entries
                </p>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${currentPage === 1
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
                                className={`px-3 py-2 text-sm rounded-md transition-colors ${currentPage === page
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
                        className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${currentPage === totalPages
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

    // Card View Component (Mobile/Tablet)
    const CardView = () => (
        <div className="md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {currentItems.map((location, index) => (
                    <div key={location.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="p-6">
                            {/* Location Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 truncate" title={location.name}>
                                                {location.name || 'Unnamed Location'}
                                            </h3>
                                            {location.is_favorite && (
                                                <Star size={16} className="text-yellow-500 fill-current" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs text-gray-500">Active</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleToggleFavorite(location)}
                                        className={`p-2 rounded-lg transition-colors ${location.is_favorite
                                            ? 'text-yellow-500 hover:bg-yellow-50'
                                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                                        }`}
                                        title={location.is_favorite ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        <Star size={16} className={location.is_favorite ? 'fill-current' : ''} />
                                    </button>
                                    <button
                                        onClick={() => handleViewLocation(location)}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="View location"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleEditLocation(location)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit location"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLocation(location)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete location"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <Navigation size={14} className="mt-0.5 flex-shrink-0" />
                                    <span className="truncate">{location.address || 'No address'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Globe size={14} />
                                    <span className="truncate">{formatCoordinates(location.latitude, location.longitude)}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={12} />
                                    <span>Added {formatDate(location.created_at)}</span>
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
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((location, index) => (
                            <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                        {startIndex + index + 1}
                                    </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                                {location.name || 'Unnamed Location'}
                                                {location.is_favorite && (
                                                    <Star size={14} className="text-yellow-500 fill-current" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-xs text-gray-500">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-2 max-w-xs">
                                        <Navigation size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-900 break-words">
                                            {location.address || 'No address'}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Globe size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-900 font-mono">
                                            {formatCoordinates(location.latitude, location.longitude)}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {formatDate(location.created_at)}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleFavorite(location)}
                                            className={`p-2 rounded-lg transition-colors ${location.is_favorite
                                                ? 'text-yellow-500 hover:bg-yellow-50'
                                                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                                            }`}
                                            title={location.is_favorite ? "Remove from favorites" : "Add to favorites"}
                                        >
                                            <Star size={16} className={location.is_favorite ? 'fill-current' : ''} />
                                        </button>
                                        <button
                                            onClick={() => handleViewLocation(location)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEditLocation(location)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLocation(location)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
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
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
                    </div>
                    <p className="text-gray-600">Manage your business locations and coordinates</p>
                </div>

                {/* Search and Actions Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="relative flex-grow max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search locations by name or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => fetchLocations(true)}
                                disabled={isRefreshing}
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                            >
                                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                            <button
                                onClick={handleAddLocation}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                <Plus size={20} />
                                Add Location
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && !isRefreshing ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center gap-3">
                            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                            <p className="text-gray-600">Loading locations...</p>
                        </div>
                    </div>
                ) : filteredLocations.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first location.'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={handleAddLocation}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={20} />
                                Add Location
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <CardView />
                        <TableView />
                    </>
                )}

                {/* Modal Components */}
                <UpsertLocationModal
                    isOpen={upsertModalOpen}
                    onClose={() => {
                        setUpsertModalOpen(false);
                        setEditMode(false);
                    }}
                    onSubmit={handleSubmit}
                    location={editMode ? selectedLocation : null}
                    isLoading={isLoading}
                    title={editMode ? 'Edit Location' : 'Add New Location'}
                />

                <ViewLocationModal
                    isOpen={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    location={selectedLocation}
                />

                <DeleteLocationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    location={selectedLocation}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default LocationManagement;