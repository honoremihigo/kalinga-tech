import api from '../../api/api'; // Assuming your axios instance is in api.js

class BookingService {
  /**
   * Create a new booking (dispatch)
   * @param {Object} bookingData - The booking data
   * @returns {Promise} API response
   */
  async createDispatchBooking(bookingData) {
    try {
      const response = await api.post('/bookings/dispatch', bookingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createClientBooking(bookingData) {
    try {
      const response = await api.post('/bookings/client', bookingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async sendSessionId(sessionId) {
    try {
      const response = await api.post(`/bookings/${sessionId}`);
      console.log('after sending sessionId :' ,response.data);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all bookings
   * @returns {Promise} API response with bookings array
   */
  async getAllBookings() {
    try {
      const response = await api.get('/bookings');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get booking by booking number
   * @param {string} bookingNumber - The booking number
   * @returns {Promise} API response with booking data
   */
  async getBookingByNumber(bookingNumber) {
    try {
      const response = await api.get(`/bookings/${bookingNumber}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update booking by ID
   * @param {string} bookingId - The booking ID
   * @param {Object} updateData - The data to update
   * @returns {Promise} API response
   */
  async updateBooking(bookingId, updateData) {
    try {
      const response = await api.patch(`/bookings/${bookingId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete booking by ID
   * @param {string} bookingId - The booking ID
   * @returns {Promise} API response
   */
  async deleteBooking(bookingId) {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create booking with return trips
   * @param {Object} bookingData - Main booking data
   * @param {Array} returnTrips - Array of return trip objects
   * @returns {Promise} API response
   */
  async createBookingWithReturnTrips(bookingData, returnTrips = []) {
    try {
      const payload = {
        ...bookingData,
        returnTrips
      };
      const response = await api.post('/bookings/dispatch', payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update booking status
   * @param {string} bookingId - The booking ID
   * @param {string} status - New booking status ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
   * @returns {Promise} API response
   */
  async updateBookingStatus(bookingId, status) {
    try {
      const response = await api.patch(`/bookings/${bookingId}`, {
        bookingStatus: status
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update payment status
   * @param {string} bookingId - The booking ID
   * @param {string} paymentStatus - New payment status ('PENDING', 'PAID', 'FAILED', 'REFUNDED')
   * @param {Object} paymentData - Additional payment data (optional)
   * @returns {Promise} API response
   */
  async updatePaymentStatus(bookingId, paymentStatus, paymentData = {}) {
    try {
      const payload = {
        paymentStatus,
        ...paymentData
      };
      
      if (paymentStatus === 'PAID') {
        payload.paymentConfirmedAt = new Date().toISOString();
      }

      const response = await api.patch(`/bookings/${bookingId}`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Assign driver to booking
   * @param {string} bookingId - The booking ID
   * @param {string} driverId - The driver ID
   * @returns {Promise} API response
   */
  async assignDriver(bookingId, driverId) {
    try {
      const response = await api.patch(`/bookings/${bookingId}`, {
        driverId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Complete ride
   * @param {string} bookingId - The booking ID
   * @param {number} rating - Rating (optional)
   * @returns {Promise} API response
   */
  async completeRide(bookingId, rating = null) {
    try {
      const payload = {
        bookingStatus: 'COMPLETED',
        rideCompletedAt: new Date().toISOString()
      };
      
      if (rating !== null) {
        payload.rating = rating.toString();
      }

      const response = await api.patch(`/bookings/${bookingId}`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancel booking
   * @param {string} bookingId - The booking ID
   * @returns {Promise} API response
   */
  async cancelBooking(bookingId) {
    try {
      const response = await api.patch(`/bookings/${bookingId}`, {
        bookingStatus: 'CANCELLED',
        canceledAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Approve booking with driver assignment and charges
   * @param {string} bookingId - The booking ID
   * @param {Object} approvalData - The approval data
   * @param {number} approvalData.driverId - The driver ID (required)
   * @param {number} approvalData.extraCharge - Extra charge (optional)
   * @param {number} approvalData.parkingFee - Parking fee (optional)
   * @param {number} approvalData.waitingFee - Waiting fee (optional)
   * @param {number} approvalData.waitingMin - Waiting minutes (optional)
   * @returns {Promise} API response
   */
  async approveBooking(bookingId, approvalData) {
    try {
      if (!approvalData.driverId) {
        throw new Error('Driver ID is required');
      }

      const response = await api.post(`/bookings/${bookingId}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reject booking
   * @param {string} bookingId - The booking ID
   * @param {string} reason - Rejection reason (optional)
   * @returns {Promise} API response
   */
  async rejectBooking(bookingId, reason = null) {
    try {
      const payload = reason ? { reason } : {};
      const response = await api.post(`/bookings/${bookingId}/reject`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - The error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || data?.error || 'An error occurred';
      
      return {
        status,
        message,
        data: data || null
      };
    } else if (error.request) {
      // Network error
      return {
        status: 0,
        message: 'Network error - please check your connection',
        data: null
      };
    } else {
      // Other error
      return {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        data: null
      };
    }
  }
}

// Create and export a singleton instance
const bookingService = new BookingService();
export default bookingService;