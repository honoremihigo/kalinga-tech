import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Car, FileText, Home, Target } from 'lucide-react';
import { API_URL } from '../../../../api/api';

const ViewMemberModal = ({ isOpen, onClose, member }) => {
    if (!isOpen || !member) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Member Details</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Profile Section */}
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden flex-shrink-0">
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
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600">Active Member</span>
                            </div>
                            <p className="text-gray-600">
                                Member since {formatDate(member.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <p className="font-medium text-gray-900">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone Number</p>
                                    <p className="font-medium text-gray-900">{member.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Home className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">City</p>
                                    <p className="font-medium text-gray-900">{member.city}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <MapPin className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">District</p>
                                    <p className="font-medium text-gray-900">{member.district}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <MapPin className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Street</p>
                                    <p className="font-medium text-gray-900">{member.street}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ride Information */}
                    <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Ride Preferences</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Car className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Expected Monthly Rides</p>
                                    <p className="font-medium text-gray-900">{member.expectedMonthlyRides} rides/month</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                        <Target className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <p className="text-sm text-gray-600">Ride Purposes</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getRidePurposes(member.ridePurposes).length > 0 ? (
                                        getRidePurposes(member.ridePurposes).map((purpose, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                                {purpose}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-sm">No purposes specified</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Created: {formatDate(member.createdAt)}</span>
                            </div>
                            {member.updatedAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Updated: {formatDate(member.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewMemberModal;