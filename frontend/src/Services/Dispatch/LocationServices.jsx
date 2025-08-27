import api from './../../api/api'; // Your axios instance

/**
 * Location Service - Frontend API integration for location operations
 * Handles CRUD operations and validation for locations
 */
class LocationService {
  
  /**
   * Create a new location
   * @param {Object} locationData - Location information
   * @returns {Promise<Object>} Created location data
   */
  async createLocation(locationData) {
    try {
      const response = await api.post('/locations', locationData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all locations
   * @returns {Promise<Array>} List of all locations
   */
  async getAllLocations() {
    try {
      const response = await api.get('/locations');
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific location by ID
   * @param {string} locationId - Location ID
   * @returns {Promise<Object>} Location data
   */
  async getLocationById(locationId) {
    try {
      const response = await api.get(`/locations/${locationId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a location
   * @param {string} locationId - Location ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated location data
   */
  async updateLocation(locationId, updateData) {
    try {
      const response = await api.put(`/locations/${locationId}`, updateData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a location
   * @param {string} locationId - Location ID
   * @returns {Promise<Object>} Success message
   */
  async deleteLocation(locationId) {
    try {
      const response = await api.delete(`/locations/${locationId}`);
      return response.data.message;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate location data before submission
   * @param {Object} locationData - Location data to validate
   * @returns {Object} Validation result
   */
  validateLocationData(locationData) {
    const errors = {};
    
    // Required fields validation
    if (!locationData.name || locationData.name.trim().length < 2) {
      errors.name = 'Location name must be at least 2 characters long';
    }
    
    if (!locationData.address || locationData.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters long';
    }
    
    // Latitude validation
    if (locationData.latitude === undefined || locationData.latitude === null) {
      errors.latitude = 'Latitude is required';
    } else if (!this.isValidLatitude(locationData.latitude)) {
      errors.latitude = 'Latitude must be between -90 and 90 degrees';
    }
    
    // Longitude validation
    if (locationData.longitude === undefined || locationData.longitude === null) {
      errors.longitude = 'Longitude is required';
    } else if (!this.isValidLongitude(locationData.longitude)) {
      errors.longitude = 'Longitude must be between -180 and 180 degrees';
    }
    
    // Optional boolean validation
    if (locationData.is_favorite !== undefined && typeof locationData.is_favorite !== 'boolean') {
      errors.is_favorite = 'is_favorite must be a boolean value';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate latitude value
   * @param {number} latitude - Latitude to validate
   * @returns {boolean} Is valid latitude
   */
  isValidLatitude(latitude) {
    const lat = parseFloat(latitude);
    return !isNaN(lat) && lat >= -90 && lat <= 90;
  }

  /**
   * Validate longitude value
   * @param {number} longitude - Longitude to validate
   * @returns {boolean} Is valid longitude
   */
  isValidLongitude(longitude) {
    const lng = parseFloat(longitude);
    return !isNaN(lng) && lng >= -180 && lng <= 180;
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      const status = error.response.status;
      return new Error(`${status}: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: Unable to connect to server');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Create and export a singleton instance
const locationService = new LocationService();
export default locationService;

// Export the class as well for testing or custom instances
export { LocationService };