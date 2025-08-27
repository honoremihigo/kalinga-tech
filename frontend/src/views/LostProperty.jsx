import { useState, useEffect } from 'react';
import {
    Search,
    Package,
    AlertTriangle,
    Info,
    Plus,
    X,
    Check,
    Clock,
    User,
    Phone,
    FileText,
    Calendar,
    Hash,
    Mail
} from 'lucide-react';
import bookingService from '../Services/Dispatch/bookingService'; // Adjust path as needed
import lostPropertiesService from '../Services/Dispatch/lostPropertyService'; // Import the service

const LostPropertyPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleAddProperty = async (propertyData) => {
        try {
            // Validate the data first
            const validation = lostPropertiesService.validateLostPropertyData(propertyData);
            if (!validation.isValid) {
                throw new Error(Object.values(validation.errors).join(', '));
            }

            // Create the lost property using the service
            const result = await lostPropertiesService.createLostProperty(propertyData);
            
            setSubmitSuccess(true);
            setSubmitMessage('Lost property report submitted successfully! We will contact you if the item is found.');
            setShowModal(false);
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
                setSubmitMessage('');
            }, 5000);
        } catch (error) {
            console.error('Error creating lost property:', error);
            setSubmitMessage(`Error: ${error.message}`);
            setSubmitSuccess(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                {submitMessage && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                        submitSuccess 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <div className="flex items-center gap-2">
                            {submitSuccess ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <AlertTriangle className="w-5 h-5" />
                            )}
                            <span>{submitMessage}</span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Package className="w-8 h-8 text-blue-600" />
                                Lost Property Management
                            </h1>
                            <p className="text-gray-600 mt-2">Report and track lost items from your bookings</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
                        >
                            <Plus size={20} />
                            Report Lost Item
                        </button>
                    </div>
                </div>

                {/* Rules and Information Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Lost Property Guidelines</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Reporting Guidelines */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-green-600" />
                                    How to Report Lost Items
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Have your booking number ready before reporting which is found on receipt we sent youx </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Provide detailed description of the lost item</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Include your contact phone number for updates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Report as soon as possible after discovering the loss</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Important Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                                    Important Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                        <p className="text-sm text-orange-800">
                                            <strong>Response Time:</strong> We aim to respond to lost property reports within 24 hours.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Verification:</strong> You must provide a valid booking number to report lost items.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-800">
                                            <strong>Recovery:</strong> Items found will be held securely for 30 days before disposal.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Need Help?</h3>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>Call: +250 788 123 456</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>Email: support@company.com</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>Hours: 8:00 AM - 6:00 PM (Mon-Fri)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Lost Property Modal */}
            {showModal && (
                <LostPropertyModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddProperty}
                />
            )}
        </div>
    );
};

// Modal Component for Adding Lost Property
const LostPropertyModal = ({ isOpen, onClose, onSubmit }) => {
    
    const [step, setStep] = useState(1); // 1: Booking verification, 2: Item details
    const [bookingNumber, setBookingNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [bookingData, setBookingData] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '',
        itemDescription: '',
        phone: '',
        email: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setBookingNumber('');
            setBookingData(null);
            setFormData({
                itemName: '',
                itemDescription: '',
                phone: '',
                email: ''
            });
            setValidationErrors({});
            setSearchError('');
        }
    }, [isOpen]);

    const handleBookingSearch = async () => {
        if (!bookingNumber.trim()) {
            setSearchError('Please enter a booking number');
            return;
        }

        setIsSearching(true);
        setSearchError('');

        try {
            const response = await bookingService.getBookingByNumber(bookingNumber.trim());

            if (response && response.data) {
                setBookingData(response.data);
                setStep(2);
                // Pre-fill phone and email if available in booking
                setFormData(prev => ({
                    ...prev,
                    phone: response.data.clientPhone || prev.phone,
                    email: response.data.clientEmail || prev.email
                }));
            } else {
                setSearchError('Booking not found. Please check the booking number and try again.');
            }
        } catch (error) {
            console.error('Error searching booking:', error);
            setSearchError(`Failed to find booking: ${error.message}`);
        } finally {
            setIsSearching(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
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

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const propertyData = {
                claimantEmail: formData.email,
                claimantPhone: formData.phone,
                bookingNumber: bookingNumber.trim(),
                itemName: formData.itemName,
                itemDescription: formData.itemDescription
            };

            await onSubmit(propertyData);
        } catch (error) {
            console.error('Error submitting lost property:', error);
            setValidationErrors({ submit: 'Failed to submit report. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                Report Lost Property
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {step === 1 ? 'Enter your booking number to verify' : 'Provide details about the lost item'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 ? (
                        // Step 1: Booking Verification
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Verify Your Booking</h3>
                                <p className="text-gray-600">
                                    Please enter your booking number to verify your identity and proceed with the lost property report.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Booking Number <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={bookingNumber}
                                            onChange={(e) => {
                                                setBookingNumber(e.target.value);
                                                setSearchError('');
                                            }}
                                            onKeyPress={(e) => e.key === 'Enter' && handleBookingSearch()}
                                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Enter your booking number (e.g., BK123456789)"
                                            disabled={isSearching}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleBookingSearch}
                                        disabled={isSearching || !bookingNumber.trim()}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-medium"
                                    >
                                        {isSearching ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Search size={16} />
                                        )}
                                        {isSearching ? 'Verifying...' : 'Verify'}
                                    </button>
                                </div>

                                {searchError && (
                                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                                        <AlertTriangle size={16} />
                                        {searchError}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Step 2: Lost Item Details
                        <div className="space-y-6">
                            {/* Booking Confirmation */}
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Check className="w-4 h-

4 text-green-600" />
                                    <span className="font-medium text-green-900">Booking Verified</span>
                                </div>
                                <div className="text-sm text-green-800 space-y-1">
                                    <div>Booking: {bookingNumber}</div>
                                    {bookingData?.client?.name && <div>Client: {bookingData.client.name}</div>}
                                    {bookingData?.bookingDate && <div>Date: {formatDate(bookingData.bookingDate)}</div>}
                                </div>
                            </div>

                            {/* Item Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Lost Item Details</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Item Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.itemName}
                                        onChange={(e) => handleInputChange('itemName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 text-black transition-colors ${validationErrors.itemName
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="e.g., Black Leather Wallet, iPhone 13, etc."
                                    />
                                    {validationErrors.itemName && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.itemName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Detailed Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.itemDescription}
                                        onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                                        rows={4}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors resize-none ${validationErrors.itemDescription
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="Provide a detailed description including color, brand, size, distinguishing features, contents, etc."
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        {validationErrors.itemDescription ? (
                                            <p className="text-sm text-red-600">{validationErrors.itemDescription}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">Minimum 10 characters</p>
                                        )}
                                        <span className="text-sm text-gray-400">{formData.itemDescription.length}/500</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg text-black focus:ring-2 transition-colors ${validationErrors.phone
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="+250 788 123 456"
                                    />
                                    {validationErrors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">We'll contact you if the item is found</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg text-black focus:ring-2 transition-colors ${validationErrors.email
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="example@domain.com"
                                    />
                                    {validationErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">We'll contact you if the item is found</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3 justify-end">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        {step === 2 && (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Submit Report
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LostPropertyPage;