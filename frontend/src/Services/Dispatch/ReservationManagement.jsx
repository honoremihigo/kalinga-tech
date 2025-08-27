// Services/Reservation/ReservationService.js
import axios from 'axios';

const SERVICE_API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: `${SERVICE_API_BASE_URL}/reservation`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${localStorage.getItem('token')}` // Uncomment if using auth
  },
});

class ReservationService {
  // Helper method for API calls
  async apiCall(method, endpoint, data = null, params = {}) {
    try {
      const response = await apiClient.request({
        url: endpoint,
        method,
        data,
        params,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('API error response:', error.response.data);
        throw new Error(error.response.data.message || 'API Error');
      } else {
        console.error('API call failed:', error.message);
        throw error;
      }
    }
  }

  // CRUD and custom endpoints
  getAllReservations(params = {}) {
    return this.apiCall('get', '/', null, params);
  }

  getReservationById(id) {
    return this.apiCall('get', `/${id}`);
  }

  createReservation(reservationData) {
    return this.apiCall('post', '/', reservationData);
  }

  updateReservation(id, reservationData) {
    return this.apiCall('put', `/${id}`, reservationData);
  }

  // inside class ReservationService

checkNewReservations() {
  return this.apiCall('get', '/check-new');
}

    async confirmReservation(reservationId, driverId) {
    return this.apiCall('patch', `/confirm/${reservationId}/`, { driverId });
  }

  async rejectReservation(reservationId) {
    return this.apiCall('patch', `/reject/${reservationId}/`);
  }
  
  deleteReservation(id) {
    return this.apiCall('delete', `/${id}`);
  }

  getReservationsByStatus(status, params = {}) {
    return this.apiCall('get', '/', null, { status, ...params });
  }

  getReservationsByDateRange(startDate, endDate, params = {}) {
    return this.apiCall('get', '/', null, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...params,
    });
  }

  getCustomerReservations(customerId, params = {}) {
    return this.apiCall('get', `/customer/${customerId}`, null, params);
  }

  updatePaymentStatus(id, paymentStatus) {
    return this.apiCall('patch', `/${id}/payment-status`, { paymentStatus });
  }

  getReservationStats(params = {}) {
    return this.apiCall('get', '/stats', null, params);
  }

  searchReservations(searchTerm, params = {}) {
    return this.apiCall('get', '/search', null, { search: searchTerm, ...params });
  }

  getTodayReservations() {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    return this.getReservationsByDateRange(start, end);
  }

  getUpcomingReservations(params = {}) {
    return this.apiCall('get', '/', null, { upcoming: true, ...params });
  }
async cancelReservation(id, reason) {
  return this.apiCall('patch', `/cancel/${id}`, { reason });
}

  // Validation logic
  validateReservationData(data) {
    const errors = [];

    if (!data.firstName) errors.push('First name is required');
    if (!data.lastName) errors.push('Last name is required');
    if (!data.customerEmail) errors.push('Email is required');
    if (!data.customerPhone) errors.push('Phone number is required');
    if (!data.pickupAddress) errors.push('Pickup address is required');
    if (!data.dropoffAddress) errors.push('Dropoff address is required');
    if (!data.scheduledDateTime) errors.push('Scheduled date/time is required');
    if (!data.carCategory) errors.push('Car category is required');
    if (!data.paymentMethod) errors.push('Payment method is required');

    if (data.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
      errors.push('Invalid email format');
    }

    if (data.customerPhone && data.customerPhone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    if (data.scheduledDateTime) {
      const scheduled = new Date(data.scheduledDateTime);
      const now = new Date();
      if (scheduled < now) {
        errors.push('Scheduled time cannot be in the past');
      }
    }

    if (data.numberOfPassengers && (data.numberOfPassengers < 1 || data.numberOfPassengers > 8)) {
      errors.push('Number of passengers must be between 1 and 8');
    }

    if (data.riderType === 'someoneElse' && data.otherRider) {
      if (!data.otherRider.firstName) errors.push('Other rider first name is required');
      if (!data.otherRider.lastName) errors.push('Other rider last name is required');
      if (!data.otherRider.email) errors.push('Other rider email is required');
      if (!data.otherRider.phone) errors.push('Other rider phone is required');
      if (data.otherRider.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.otherRider.email)) {
        errors.push('Invalid other rider email format');
      }
    }

    return errors;
  }

  async createReservationWithValidation(data) {
    const errors = this.validateReservationData(data);
    if (errors.length) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    return this.createReservation(data);
  }

  async updateReservationWithValidation(id, data) {
    const errors = this.validateReservationData(data);
    if (errors.length) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    return this.updateReservation(id, data);
  }
}

export default new ReservationService();
