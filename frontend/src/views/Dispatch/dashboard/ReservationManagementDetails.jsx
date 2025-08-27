import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CreditCard, Phone, Mail, Car, User, CheckCircle, XCircle, Search, X } from 'lucide-react';
import ReservationService from '../../../Services/Dispatch/ReservationManagement';
import adminServiceInstance from '../../../Services/Dispatch/DriverManagement';
import Swal from 'sweetalert2';

function ReservationManagementDetails() {
const { reservationId } = useParams();

   const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Add cleanup flag

    const loadData = async () => {
      try {
        if (!reservationId) {
          throw new Error('No reservation ID provided');
        }

       const response = await ReservationService.getReservationById(reservationId);
console.log('Reservation response:', response); // 🔍 Add this

if (isMounted) {
  if (response) {
    setReservation(response); // ✅ Correct use if response is the object
  } else {
    throw new Error('No reservation found');
  }

}

      } catch (err) {
        if (isMounted) {
          console.error('Failed to load reservation:', err);
          setError(err.message || 'Failed to load reservation');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [reservationId]);

const getDrivers = async () => {
  const response = await adminServiceInstance.getDrivers();
  // response is the array already
  setDrivers(Array.isArray(response) ? response : []);
};



  const confirmReservation = async (reservationId, driverId) => {
    try {
      const response = await ReservationService.confirmReservation(reservationId, driverId);
      return response;
    } catch (error) {
      console.error('Confirm reservation error:', error);
      throw error;
    }
  };

  const rejectReservation = async (reservationId) => {
    try {
      const response = await ReservationService.rejectReservation(reservationId);
      return response;
    } catch (error) {
      console.error('Reject reservation error:', error);
      throw error;
    }
  };

  const handleConfirmReservation = async () => {
  if (!selectedDriver) {
    Swal.fire({
      icon: 'warning',
      title: 'No Driver Selected',
      text: 'Please select a driver before confirming the reservation.',
    });
    return;
  }

  setProcessingAction('confirming');

  try {
    await confirmReservation(reservation.id, selectedDriver.id);

    // Update reservation status locally
    setReservation(prev => ({
      ...prev,
      reservationStatus: 'confirmed',
      driverId: selectedDriver.id,
    }));

    setShowDriverModal(false);

    Swal.fire({
      icon: 'success',
      title: 'Reservation Confirmed',
      text: 'The reservation has been successfully confirmed and the driver has been assigned.',
    });
  } catch (error) {
    console.error('Confirm reservation error:', error);

    Swal.fire({
      icon: 'error',
      title: 'Confirmation Failed',
      text: 'There was an issue confirming the reservation. Please try again.',
    });
  } finally {
    setProcessingAction(null);
  }
};


  const handleRejectReservation = async () => {
    if (!window.confirm('Are you sure you want to reject this reservation?')) {
      return;
    }

    setProcessingAction('rejecting');
    
    try {
      await rejectReservation(reservation.id);
      
      // Update reservation status locally
      setReservation(prev => ({
        ...prev,
        reservationStatus: 'rejected'
      }));
      
      alert('Reservation rejected successfully!');
    } catch (error) {
      console.error('Reject reservation error:', error);
      alert('Failed to reject reservation');
    } finally {
      setProcessingAction(null);
    }
  };

  const openDriverModal = async () => {
    setShowDriverModal(true);
    try {
      const response = await getDrivers({ search: searchQuery });
      setDrivers(response.data);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    }
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Not Found</h2>
          <p className="text-gray-600">The requested reservation could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 rounded-t-2xl">
        <div className=" mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Reservation Details</h1>
          <p className="text-blue-100">Manage and process reservation requests</p>
        </div>
      </div>

      <div className=" mx-auto px-6 py-8">
        {/* Status and Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(reservation.reservationStatus)}`}>
              {reservation.reservationStatus.charAt(0).toUpperCase() + reservation.reservationStatus.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              Created: {formatDate(reservation.createdAt)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
 
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={`text-2xl ${
        star <= Number(reservation.Rating) ? 'text-yellow-400' : 'text-gray-300'
      }`}
    >
      ★
    </span>
  ))}
</div>

          
          {reservation.reservationStatus === 'pending' && (
            <div className="flex space-x-3">
              <button
                onClick={handleRejectReservation}
                disabled={processingAction === 'rejecting'}
                className="flex items-center px-14 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processingAction === 'rejecting' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject
              </button>
              <button
                onClick={openDriverModal}
                disabled={processingAction === 'confirming'}
                className="flex items-center px-14 py-3 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {processingAction === 'confirming' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Confirm
              </button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Customer Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {reservation.firstName} {reservation.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Primary Customer</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{reservation.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{reservation.phoneNumber}</span>
                </div>
              </div>

              {reservation.riderType === 'other' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Other Rider Details:</p>
                  <p className="text-sm text-gray-600">
                    {reservation.otherRiderFirstName} {reservation.otherRiderLastName}
                  </p>
                  <p className="text-sm text-gray-600">{reservation.otherRiderEmail}</p>
                  <p className="text-sm text-gray-600">{reservation.otherRiderPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Trip Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Trip Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup Location</p>
                  <p className="text-gray-900">{reservation.pickup}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Drop-off Location</p>
                  <p className="text-gray-900">{reservation.dropoff}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Distance</p>
                  <p className="text-lg font-semibold text-gray-900">{reservation.distance} km</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{reservation.duration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Schedule Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Scheduled Date</p>
                  <p className="text-gray-900">{formatDate(reservation.scheduledDateTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Scheduled Time</p>
                  <p className="text-gray-900">{formatTime(reservation.scheduledDateTime)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Passengers</p>
                  <p className="text-gray-900">{reservation.numberOfPassengers} passenger(s)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Payment Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Trip Price</span>
                <span className="text-xl font-bold text-gray-900">${reservation.price}</span>
              </div>
                 <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Abyride Earning Amount</span>
                <span className="text-xl font-bold text-gray-900">${reservation.abyrideEarningAmount}</span>
              </div>
                 <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Driver Earning Amount</span>
                <span className="text-xl font-bold text-gray-900">${reservation.driverEarningAmount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Payment Method</span>
                <span className="text-gray-900">{reservation.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Payment Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  reservation.paymentStatus === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Car className="h-5 w-5 mr-2 text-blue-600" />
              Vehicle & Driver Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
  <p className="text-sm font-medium text-gray-700 mb-2">Vehicle Category</p>
  <p className="text-gray-900">
    {reservation.carCategory?.name ?? 'N/A'}
  </p>
</div>



              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Assigned Driver</p>
                <p className="text-gray-900">
                  {reservation.driverId ? `Driver Name: ${reservation.firstName} ${reservation.lastName}` : 'Not assigned yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
          {/* Vehicle Information */}
          {reservation.reservationStatus === 'cancelled' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 ml-[45px] mr-[45px] lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <X className="h-5 w-5 mr-2 text-blue-600" />
          Canceling information 
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
  <p className="text-sm font-medium text-gray-700 mb-2">Canceling Date </p>
   <p className="text-gray-900">
          {reservation.canceledAt
            ? new Date(reservation.canceledAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'N/A'}
        </p>
   
</div>



              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Canceling Reason</p>
                <p className="text-gray-900">
                  {reservation.cancellationReason ?? 'N/A'}
                </p>
              </div>
            </div>
          </div>
      
          )}

{showDriverModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
      
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Driver</h3>

        {/* Dropdown select */}
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDriver?.id?.toString() || ''}
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const driver = drivers.find(d => d.id === selectedId);
            setSelectedDriver(driver);
          }}
        >
          <option value="" disabled>Select a driver</option>
          {drivers.length > 0 ? (
            drivers.map(driver => (
              <option key={driver.id} value={driver.id.toString()}>
                {driver.firstName} {driver.lastName}
              </option>
            ))
          ) : (
            <option disabled>No drivers found</option>
          )}
        </select>
      </div>

      <div className="p-4 border-t border-gray-200 flex space-x-3">
        <button
          onClick={() => setShowDriverModal(false)}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmReservation}
          disabled={!selectedDriver || processingAction === 'confirming'}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {processingAction === 'confirming' ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Confirming...
            </div>
          ) : (
            'Confirm Reservation'
          )}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default ReservationManagementDetails;