import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Users, Mail, Phone, MapPin, Check, AlertTriangle, User, FileText, Download, Eye, RefreshCw, ChevronLeft, ChevronRight, Calendar, Target, Car, Home } from 'lucide-react';
import memberService from '../../../Services/Dispatch/MemberService';

import DeleteMemberModal from '../../../components/Dispatch/dashboard/member/DeleteMemberModal';
import UpsertMemberModal from '../../../components/Dispatch/dashboard/member/UpsertMemberModal';
import ViewMemberModal from '../../../components/Dispatch/dashboard/member/ViewMemberModal';
import { API_URL } from '../../../api/api';

const MemberManagement = ({ role }) => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notification, setNotification] = useState(null);
    const [memberStats, setMemberStats] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Fetch all members with better error handling
    const fetchMembers = async (showRefreshLoader = false) => {
        if (showRefreshLoader) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const data = await memberService.getAllMembers();
            setMembers(data);
            setFilteredMembers(data);

            // Fetch member statistics
            const stats = await memberService.getMemberStats();
            setMemberStats(stats.data);

            if (showRefreshLoader) {
                showNotification('Members refreshed successfully!');
            }
        } catch (error) {
            console.error('Failed to fetch members:', error);
            showNotification(`Failed to fetch members: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        let filtered = members.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone?.includes(searchTerm)
        );

        if (filterCity) {
            filtered = filtered.filter(member =>
                member.city.toLowerCase() === filterCity.toLowerCase()
            );
        }

        setFilteredMembers(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchTerm, filterCity, members]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredMembers.slice(startIndex, endIndex);

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

    // Get unique cities for filter dropdown
    const getUniqueCities = () => {
        const cities = [...new Set(members.map(member => member.city))];
        return cities.sort();
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleAddMember = async (memberFormData, profileImage) => {
        setIsLoading(true);
        try {
            const validation = memberService.validateMemberData(memberFormData);
            if (!validation.isValid) {
                const errorMessage = Object.values(validation.errors).join(', ');
                throw new Error(errorMessage);
            }

            const response = await memberService.createMember(memberFormData, profileImage);

            await fetchMembers();

            setIsAddModalOpen(false);
            showNotification(response.message || 'Member added successfully!');
        } catch (error) {
            showNotification(`Failed to add member: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditMember = async (memberFormData, profileImage) => {
        setIsLoading(true);
        try {
            if (!selectedMember) {
                throw new Error('No member selected for editing');
            }

            const validation = memberService.validateMemberData(memberFormData);
            if (!validation.isValid) {
                const errorMessage = Object.values(validation.errors).join(', ');
                throw new Error(errorMessage);
            }

            // For updates, we'll use regular form data if no new image is provided
            let response;
            if (profileImage) {
                response = await memberService.createMember(memberFormData, profileImage); // Using create for FormData handling
            } else {
                response = await memberService.updateMember(selectedMember.id, memberFormData);
            }

            await fetchMembers();

            setIsEditModalOpen(false);
            setSelectedMember(null);
            showNotification(response.message || 'Member updated successfully!');
        } catch (error) {
            showNotification(`Failed to update member: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMember = async () => {
        setIsLoading(true);
        try {
            if (!selectedMember) {
                throw new Error('No member selected for deletion');
            }

            const response = await memberService.deleteMember(selectedMember.id);

            setMembers(prev => prev.filter(member => member.id !== selectedMember.id));
            setFilteredMembers(prev => prev.filter(member => member.id !== selectedMember.id));

            setIsDeleteModalOpen(false);
            setSelectedMember(null);
            showNotification(response.message || 'Member deleted successfully!');
        } catch (error) {
            showNotification(`Failed to delete member: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const openEditModal = (member) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (member) => {
        setSelectedMember(member);
        setIsDeleteModalOpen(true);
    };

    const openViewModal = (member) => {
        setSelectedMember(member);
        setIsViewModalOpen(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRidePurposes = (ridePurposes) => {
        if (!ridePurposes) return [];
        try {
            return typeof ridePurposes === 'string' ? JSON.parse(ridePurposes) : ridePurposes;
        } catch {
            return [];
        }
    };

    const closeAllModals = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsViewModalOpen(false);
        setSelectedMember(null);
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

    // Stats Cards Component
    const StatsCards = () => (
        memberStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Members</p>
                            <p className="text-2xl font-bold text-gray-900">{memberStats.totalMembers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Car className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Avg. Monthly Rides</p>
                            <p className="text-2xl font-bold text-gray-900">{memberStats.averageExpectedRides}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Cities</p>
                            <p className="text-2xl font-bold text-gray-900">{Object.keys(memberStats.membersByCity).length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Target className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Ride Purposes</p>
                            <p className="text-2xl font-bold text-gray-900">{Object.keys(memberStats.ridePurposesDistribution).length}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    // Pagination Component
    const PaginationComponent = () => (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} entries
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
                {currentItems.map((member, index) => (
                    <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="p-6">
                            {/* Member Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                                        {member.profileImage ? (
                                            <img
                                                src={member.profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}

                                        <div className={member.profileImage ? 'hidden' : 'flex'}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate" title={member.name}>
                                            {member.name}
                                        </h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs text-gray-500">Active</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openViewModal(member)}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="View member"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => openEditModal(member)}
                                        disabled={isLoading}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-colors"
                                        title="Edit member"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(member)}
                                        disabled={isLoading}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                                        title="Delete member"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Member Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={14} />
                                    <span className="truncate">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={14} />
                                    <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin size={14} />
                                    <span className="truncate">{member.street}, {member.district}, {member.city}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Car size={14} />
                                    <span>{member.expectedMonthlyRides} rides/month</span>
                                </div>
                            </div>

                            {/* Ride Purposes */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">
                                    Ride Purposes
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getRidePurposes(member.ridePurposes).slice(0, 3).map((purpose, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {purpose}
                                        </span>
                                    ))}
                                    {getRidePurposes(member.ridePurposes).length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{getRidePurposes(member.ridePurposes).length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Documents section */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">
                                    Documents
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {member.identityDocument && (
                                        <button
                                            onClick={() => window.open(member.identityDocument, '_blank')}
                                            className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors"
                                        >
                                            <FileText size={12} />
                                            Identity Doc
                                        </button>
                                    )}
                                    {!member.identityDocument && (
                                        <span className="text-xs text-gray-500">No documents</span>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={12} />
                                    <span>Joined {formatDate(member.createdAt)}</span>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((member, index) => (
                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                        {startIndex + index + 1}
                                    </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                                            {member.profileImage ? (
                                                <img
                                                    src={`${API_URL}${member.profileImage}`}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}

                                            <div className={member.profileImage ? 'hidden' : 'flex'}>
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {member.name}
                                            </div>
                                          
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <Mail size={14} className="text-gray-400" />
                                            <span className="truncate max-w-40">{member.email}</span>
                                        </div>
                                       
                                    </div>
                                </td>



                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {formatDate(member.createdAt)}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openViewModal(member)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(member)}
                                            disabled={isLoading}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(member)}
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
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
                    </div>
                    <p className="text-gray-600">Manage your members and their ride preferences</p>
                </div>

                {/* Stats Cards */}
                <StatsCards />

                {/* Search and Actions Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
                            <div className="relative flex-grow max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search members by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="relative min-w-48">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="">All Cities</option>
                                    {getUniqueCities().map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => fetchMembers(true)}
                                disabled={isRefreshing}
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                            >
                                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                <Plus size={20} />
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && !isRefreshing ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center gap-3">
                            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                            <p className="text-gray-600">Loading members...</p>
                        </div>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || filterCity ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first member.'}
                        </p>
                        {!searchTerm && !filterCity && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={20} />
                                Add Member
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
                <UpsertMemberModal
                    isOpen={isAddModalOpen || isEditModalOpen}
                    onClose={closeAllModals}
                    onSubmit={isEditModalOpen ? handleEditMember : handleAddMember}
                    member={selectedMember}
                    isLoading={isLoading}
                    title={isEditModalOpen ? 'Edit Member' : 'Add New Member'}
                />

                <ViewMemberModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    member={selectedMember}
                />


                <DeleteMemberModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeAllModals}
                    onConfirm={handleDeleteMember}
                    member={selectedMember}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default MemberManagement;