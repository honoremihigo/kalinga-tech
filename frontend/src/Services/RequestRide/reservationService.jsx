import axios from 'axios';

const SERVICE_API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: SERVICE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a new ride reservation
 * @param {Object} reservationData
 * @returns {Promise<Object>}
 */
export const createRideReservation = async (reservationData) => {
  try {
    const requiredFields = [
      'firstName',
      'lastName',
      'customerEmail',
      'customerPhone',
      'pickupAddress',
      'dropoffAddress',
      'scheduledDateTime',
      'numberOfPassengers'
    ];

    const missingFields = requiredFields.filter(field => !reservationData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const reservationPayload = {
      firstName: reservationData.firstName,
      lastName: reservationData.lastName,
      customerEmail: reservationData.customerEmail,
      customerPhone: reservationData.customerPhone,
      pickupAddress: reservationData.pickupAddress,
      dropoffAddress: reservationData.dropoffAddress,
      pickupLatitude: reservationData.pickupLatitude || null,
      pickupLongitude: reservationData.pickupLongitude || null,
      dropoffLatitude: reservationData.dropoffLatitude || null,
      dropoffLongitude: reservationData.dropoffLongitude || null,
      scheduledDateTime: reservationData.scheduledDateTime,
      numberOfPassengers: parseInt(reservationData.numberOfPassengers) || 1,
      carCategory: reservationData.carCategory || "",
      paymentMethod: reservationData.paymentMethod || "",
      riderType: reservationData.riderType || "me",
      otherRider: reservationData.riderType === "someoneElse" ? {
        firstName: reservationData.otherRiderData?.firstName || "",
        lastName: reservationData.otherRiderData?.lastName || "",
        email: reservationData.otherRiderData?.email || "",
        phone: reservationData.otherRiderData?.phone || ""
      } : null
    };

    const response = await apiClient.post('/reservation', reservationPayload);

    return {
      success: true,
      data: response.data,
      message: 'Reservation created successfully',
    };

  } catch (error) {
    console.error('Reservation creation error:', error);

    if (error.response) {
      return {
        success: false,
        error: error.response.data,
        message: error.response.data?.message || 'Server error occurred',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Network error',
        message: 'Unable to connect to server. Please check your internet connection.',
      };
    } else {
      return {
        success: false,
        error: error.message,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }
};
