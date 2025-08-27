import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    MapPin,
    Clock,
    User,
    Phone,
    Mail,
    CreditCard,
    Star,
    Calendar,
    DollarSign,
    Luggage,
    AlertCircle,
    CheckCircle,
    XCircle,
    Timer,
    X
} from 'lucide-react';
// import { useParams } from 'react-router-dom';
import bookingService from '../../../../Services/Dispatch/bookingService';
import driverManagementService from '../../../../Services/Dispatch/DriverManagement';
import { useParams } from 'react-router-dom';

const ReservationView = () => {
    const { id } = useParams();

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [approvalForm, setApprovalForm] = useState({
        driverId: '',
        extraCharge: 0,
        driverWaitingCharge: 0,
        driverPackageCharge: 0,
        waitingMin: 0
    });
    const [submitting, setSubmitting] = useState({
        approve: false,
        reject: false
    });

    const fetchReservation = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getBookingByNumber(id);
            setReservation(data);
        } catch (err) {
            setError(err.message || 'Failed to load reservation details');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchReservation();
    }, [id]);

    const fetchDrivers = async () => {
        try {
            const driversData = await driverManagementService.getDrivers();
            setDrivers(driversData);
        } catch (err) {
            console.error('Failed to fetch drivers:', err);
        }
    };

    const handleApproveClick = async () => {
        setShowApproveModal(true);
        await fetchDrivers();
    };

    const handleRejectClick = () => {
        setShowRejectModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setApprovalForm(prev => ({
            ...prev,
            [name]: name === 'driverId' ? value : parseFloat(value) || 0
        }));
    };

    const handleApproveSubmit = async (e) => {
        e.preventDefault();
        if (!approvalForm.driverId) {
            alert('Please select a driver');
            return;
        }

        setSubmitting(pre => (
            { ...pre, approve: true }
        ));
        try {
            // Here you would call your booking service to approve the reservation
            const response = await bookingService.approveBooking(reservation.id, {
                ...approvalForm,
                waitingFee: approvalForm.driverWaitingCharge,
                parkingFee: approvalForm.driverPackageCharge,

            })

            await fetchReservation()

            setShowApproveModal(false);
            alert('Reservation approved successfully!');
        } catch (err) {
            console.error('Failed to approve reservation:', err);
            alert('Failed to approve reservation. Please try again.');
        } finally {
            setSubmitting(pre => (
                { ...pre, approve: false }
            ));
        }
    };

    const handleRejectionSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(pre => (
            { ...pre, reject: true }
        ));
        try {
            // Here you would call your booking service to reject the reservation
            const response = await bookingService.rejectBooking(reservation.id)

            await fetchReservation()

            setShowRejectModal(false);
            alert('Reservation cancelled successfully!');
        } catch (err) {
            console.error('Failed to cancel reservation:', err);
            alert('Failed to cancel reservation. Please try again.');
        } finally {
            setSubmitting(pre => (
                { ...pre, reject: false }
            ));
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            ACCEPTED: 'bg-blue-100 text-blue-800',
            IN_PROGRESS: 'bg-purple-100 text-purple-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status) => {
        const statusColors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PAID: 'bg-green-100 text-green-800',
            FAILED: 'bg-red-100 text-red-800',
            REFUNDED: 'bg-gray-100 text-gray-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
                    <p className="text-gray-600 mb-6">Reservation not found</p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => window.history.back()}
                                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Reservation Details</h1>
                                <p className="text-sm text-gray-600">#{reservation.bookingNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.bookingStatus)}`}>
                                {reservation.bookingStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Trip Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                Trip Information
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                                    <p className="text-gray-900">{reservation.pickupAddress || 'N/A'}</p>
                                    {reservation.pickupNote && (
                                        <p className="text-sm text-gray-600 mt-1">Note: {reservation.pickupNote}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                                    <p className="text-gray-900">{reservation.dropoffAddress || 'N/A'}</p>
                                    {reservation.dropoffNote && (
                                        <p className="text-sm text-gray-600 mt-1">Note: {reservation.dropoffNote}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                                        <p className="text-gray-900">{reservation.distance ? `${reservation.distance} km` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                        <p className="text-gray-900">{reservation.duration || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
                                    <p className="text-gray-900 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                        {formatDateTime(reservation.date)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Passenger Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                Passenger Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <p className="text-gray-900">
                                        {reservation.client.firstName && reservation.client.lastName
                                            ? `${reservation.client.firstName} ${reservation.client.lastName}`
                                            : 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <p className="text-gray-900 flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                        {reservation.client.phoneNumber || 'N/A'}
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <p className="text-gray-900 flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                        {reservation.client.email || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Driver Information */}
                        {reservation.driver && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-green-600" />
                                    Assigned Driver
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <p className="text-gray-900 font-medium">
                                            {reservation.driver.firstName && reservation.driver.lastName
                                                ? `${reservation.driver.firstName} ${reservation.driver.lastName}`
                                                : 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <p className="text-gray-900 flex items-center">
                                            <Phone className="w-4 h-4 mr-2 text-green-600" />
                                            {reservation.driver.phoneNumber || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <p className="text-gray-900 flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-green-600" />
                                            {reservation.driver.email || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <p className="text-gray-900">
                                            {reservation.driver.gender || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                        <p className="text-gray-900">
                                            {reservation.driver.nationality || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <p className="text-gray-900">
                                            {reservation.driver.dateOfBirth 
                                                ? new Date(reservation.driver.dateOfBirth).toLocaleDateString()
                                                : 'N/A'}
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <p className="text-gray-900">
                                            {reservation.driver.address || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Driver Action Buttons */}
                                {/* <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex space-x-3">
                                        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Driver
                                        </button>
                                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Email Driver
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        )}

                        {/* Return Trips */}
                        {reservation.returnTrips && reservation.returnTrips.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Return Trips</h2>

                                <div className="space-y-4">
                                    {reservation.returnTrips.map((returnTrip, index) => (
                                        <div key={returnTrip.id} className="border rounded-lg p-4 bg-gray-50">
                                            <h3 className="font-medium text-gray-900 mb-2">Return Trip {index + 1}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Date:</span>
                                                    <span className="ml-2 font-medium">{formatDateTime(returnTrip.returnDate)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Duration:</span>
                                                    <span className="ml-2 font-medium">{returnTrip.duration || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Distance:</span>
                                                    <span className="ml-2 font-medium">{returnTrip.distance + 'km' || 'N/A'}</span>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <span className="text-gray-600">From:</span>
                                                    <span className="ml-2 font-medium">{returnTrip.pickupAddress}</span>
                                                      {returnTrip.pickupNote && (
                                        <p className="text-sm text-gray-600 mt-1">Note: {returnTrip.pickupNote}</p>
                                    )}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <span className="text-gray-600">To:</span>
                                                    <span className="ml-2 font-medium">{returnTrip.dropoffAddress}</span>
                                                      {returnTrip.dropoffNote && (
                                        <p className="text-sm text-gray-600 mt-1">Note: {returnTrip.dropoffNote}</p>
                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Payment Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                                Payment Details
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                                        {reservation.paymentStatus}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Method:</span>
                                    <span className="text-gray-900">{reservation.paymentMethod || 'N/A'}</span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Base Price:</span>
                                        <span className="text-blue-600">{formatCurrency(reservation.price)}</span>
                                    </div>

                                    {reservation.extraCharge && parseFloat(reservation.extraCharge) > 0 && (
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>Extra Charge:</span>
                                            <span>{formatCurrency(reservation.extraCharge)}</span>
                                        </div>
                                    )}

                                    {reservation.driverPackageCharge && parseFloat(reservation.driverPackageCharge) > 0 && (
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>Package Charge:</span>
                                            <span>{formatCurrency(reservation.driverPackageCharge)}</span>
                                        </div>
                                    )}

                                    {reservation.driverWaitingCharge && parseFloat(reservation.driverWaitingCharge) > 0 && (
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>Waiting Charge:</span>
                                            <span>{formatCurrency(reservation.driverWaitingCharge)}</span>
                                        </div>
                                    )}

                                   
                                </div>

                                {reservation.paymentConfirmedAt && (
                                    <div className="text-sm text-gray-600">
                                        <span>Confirmed:</span>
                                        <span className="ml-2">{formatDateTime(reservation.paymentConfirmedAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 flex items-center">
                                        <Luggage className="w-4 h-4 mr-2 text-blue-600" />
                                        Luggage Count:
                                    </span>
                                    <span className="text-gray-900 font-medium">{reservation.luggageCount || 0}</span>
                                </div>

                                {reservation.waitingMin && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 flex items-center">
                                            <Timer className="w-4 h-4 mr-2 text-blue-600" />
                                            Waiting Time:
                                        </span>
                                        <span className="text-gray-900 font-medium">{reservation.waitingMin} min</span>
                                    </div>
                                )}

                                {reservation.rating && reservation.rating !== "0" && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 flex items-center">
                                            <Star className="w-4 h-4 mr-2 text-blue-600" />
                                            Rating:
                                        </span>
                                        <span className="text-gray-900 flex items-center font-medium">
                                            {reservation.rating}
                                            <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-gray-900 font-medium">Reservation Created</p>
                                        <p className="text-gray-600">{formatDateTime(reservation.createdAt)}</p>
                                    </div>
                                </div>

                                {reservation.paymentConfirmedAt && (
                                    <div className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-gray-900 font-medium">Payment Confirmed</p>
                                            <p className="text-gray-600">{formatDateTime(reservation.paymentConfirmedAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {reservation.rideCompletedAt && (
                                    <div className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-gray-900 font-medium">Ride Completed</p>
                                            <p className="text-gray-600">{formatDateTime(reservation.rideCompletedAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {reservation.canceledAt && (
                                    <div className="flex items-start">
                                        <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-gray-900 font-medium">Reservation Cancelled</p>
                                            <p className="text-gray-600">{formatDateTime(reservation.canceledAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {reservation.bookingStatus === 'IN_PROGRESS' && !reservation.rideCompletedAt && (
                                    <div className="flex items-start">
                                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-white mr-3 mt-0.5">
                                            <div className="w-full h-full rounded-full bg-blue-500 animate-pulse"></div>
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-medium">Trip in Progress</p>
                                            <p className="text-gray-600">Currently on the way</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                      {
                        (reservation.bookingStatus === 'PENDING'   ) && (
                              <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>

                            <div className="space-y-3">
                               
                                {reservation.bookingStatus === 'PENDING' && (
                                    <button 
                                        onClick={handleRejectClick}
                                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                                        disabled={submitting.reject}
                                    >
                                        {submitting.reject ? 'Cancelling...' : 'Cancel Reservation'}
                                    </button>
                                )}

                                {(reservation.bookingStatus === 'PENDING' || !reservation.driver ) && (
                                    <button
                                        onClick={handleApproveClick}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Approve Reservation
                                    </button>
                                )}

                               

                                {/* {reservation.bookingStatus === 'COMPLETED' && (!reservation.rating || reservation.rating === "0") && (
                                    <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                                        Rate Trip
                                    </button>
                                )} */}
                            </div>
                        </div>
                        )
                      }
                    </div>
                </div>
            </div>

            {/* Approve Reservation Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-900">Approve Reservation</h2>
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleApproveSubmit} className="p-6 space-y-4">
                            {/* Driver Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Driver *
                                </label>
                                <select
                                    name="driverId"
                                    value={approvalForm.driverId}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Choose a driver...</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.firstName} {driver.lastName} - {driver.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Extra Charge */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Extra Charge ($)
                                </label>
                                <input
                                    type="number"
                                    name="extraCharge"
                                    value={approvalForm.extraCharge}
                                    onChange={handleFormChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Driver Waiting Charge */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Driver Waiting Charge ($)
                                </label>
                                <input
                                    type="number"
                                    name="driverWaitingCharge"
                                    value={approvalForm.driverWaitingCharge}
                                    onChange={handleFormChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Driver Package Charge */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Driver Package Charge ($)
                                </label>
                                <input
                                    type="number"
                                    name="driverPackageCharge"
                                    value={approvalForm.driverPackageCharge}
                                    onChange={handleFormChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Waiting Minutes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Waiting Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="waitingMin"
                                    value={approvalForm.waitingMin}
                                    onChange={handleFormChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowApproveModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={submitting.approve}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    disabled={submitting.approve}
                                >
                                    {submitting.approve ? 'Approving...' : 'Approve'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cancel/Reject Reservation Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                                Cancel Reservation
                            </h2>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={submitting.reject}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                                    Are you sure you want to cancel this reservation?
                                </h3>
                                <p className="text-sm text-gray-600 text-center">
                                    This action cannot be undone. The reservation will be permanently cancelled and the customer will be notified.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Booking Number:</span>
                                        <span className="font-medium">#{reservation.bookingNumber}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Customer:</span>
                                        <span className="font-medium">
                                            {reservation.client.firstName} {reservation.client.lastName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trip Date:</span>
                                        <span className="font-medium">{formatDateTime(reservation.date)}</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleRejectionSubmit}>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectModal(false)}
                                        className="flex-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        disabled={submitting.reject}
                                    >
                                        Keep Reservation
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                        disabled={submitting.reject}
                                    >
                                        {submitting.reject ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Cancelling...
                                            </>
                                        ) : (
                                            'Yes, Cancel Reservation'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationView;