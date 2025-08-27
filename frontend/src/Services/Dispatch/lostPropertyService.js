import api from '../../api/api'; // Your axios instance

/**
 * Lost Properties Service - Frontend API integration for lost property operations
 * Handles all CRUD operations and status management for lost properties
 */
class LostPropertiesService {
  /**
   * Create a new lost property
   * @param {Object} propertyData - Lost property information
   * @returns {Promise<Object>} Created property data
   */
  async createLostProperty(propertyData) {
    try {
      const response = await api.post('/lost-properties/create', propertyData);
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all lost properties with booking and user details
   * @returns {Promise<Array>} List of all lost properties with related data
   */
  async getAllLostProperties() {
    try {
      const response = await api.get('/lost-properties');
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific lost property by ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Property data
   */
  async getLostPropertyById(propertyId) {
    try {
      const response = await api.get(`/lost-properties/${propertyId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a lost property
   * @param {string} propertyId - Property ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated property data
   */
  async updateLostProperty(propertyId, updateData) {
    try {
      const response = await api.put(`/lost-properties/${propertyId}`, updateData);
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a lost property
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Success message
   */
  async deleteLostProperty(propertyId) {
    try {
      const response = await api.delete(`/lost-properties/${propertyId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark a lost property as found
   * @param {string} propertyId - Property ID
   * @param {Object} returnerData - Information about who found/returned the item
   * @returns {Promise<Object>} Updated property data with success message
   */
  async markAsFound(propertyId, returnerData) {
    try {
      const response = await api.put(`/lost-properties/${propertyId}/found`, returnerData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search lost properties by item name, description, or booking number
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Filtered properties
   */
  async searchLostProperties(searchTerm) {
    try {
      const response = await api.get('/lost-properties');
      const allProperties = response.data.data || response.data;
      
      if (!searchTerm || searchTerm.trim() === '') {
        return allProperties;
      }

      const term = searchTerm.toLowerCase().trim();
      return allProperties.filter(property => 
        property.itemName.toLowerCase().includes(term) ||
        property.itemDescription.toLowerCase().includes(term) ||
        (property.bokingNumber && property.bokingNumber.toLowerCase().includes(term)) ||
        (property.booking?.client?.name && property.booking.client.name.toLowerCase().includes(term)) ||
        (property.booking?.driver?.name && property.booking.driver.name.toLowerCase().includes(term))
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Filter properties by status
   * @param {string} status - Status to filter by ('found', 'lost', etc.)
   * @returns {Promise<Array>} Filtered properties
   */
  async getPropertiesByStatus(status = 'lost') {
    try {
      const response = await api.get('/lost-properties');
      const allProperties = response.data.data || response.data;
      
      return allProperties.filter(property => property.status === status);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all found properties
   * @returns {Promise<Array>} List of found properties
   */
  async getFoundProperties() {
    return this.getPropertiesByStatus('found');
  }

  /**
   * Get all lost (not found) properties
   * @returns {Promise<Array>} List of lost properties
   */
  async getLostProperties() {
    return this.getPropertiesByStatus('lost');
  }

  /**
   * Get properties by booking number
   * @param {string} bookingNumber - Booking number to search
   * @returns {Promise<Array>} Properties with matching booking number
   */
  async getPropertiesByBookingNumber(bookingNumber) {
    try {
      const response = await api.get('/lost-properties');
      const allProperties = response.data.data || response.data;
      
      if (!bookingNumber || bookingNumber.trim() === '') {
        return [];
      }

      const booking = bookingNumber.toLowerCase().trim();
      return allProperties.filter(property => 
        property.bokingNumber && property.bokingNumber.toLowerCase() === booking
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get properties by client
   * @param {string} clientId - Client ID
   * @returns {Promise<Array>} Properties related to the client
   */
  async getPropertiesByClient(clientId) {
    try {
      const response = await api.get('/lost-properties');
      const allProperties = response.data.data || response.data;
      
      return allProperties.filter(property => 
        property.booking?.client?.id === clientId
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get properties by driver
   * @param {string} driverId - Driver ID
   * @returns {Promise<Array>} Properties related to the driver
   */
  async getPropertiesByDriver(driverId) {
    try {
      const response = await api.get('/lost-properties');
      const allProperties = response.data.data || response.data;
      
      return allProperties.filter(property => 
        property.booking?.driver?.id === driverId
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get recent lost properties (within specified days)
   * @param {number} days - Number of days to look back (default: 7)
   * @returns {Promise<Array>} Recent properties
   */
  async getRecentLostProperties(days = 7) {
    try {
      const response = await api.get('/lost-properties');
      const allProperties = response.data.data || response.data;
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return allProperties.filter(property => {
        const createdDate = new Date(property.createdAt);
        return createdDate >= cutoffDate;
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate lost property data before submission
   * @param {Object} propertyData - Property data to validate
   * @returns {Object} Validation result
   */
  validateLostPropertyData(propertyData) {
    const errors = {};
    
    console.log(propertyData);
    
    // Required fields validation
    if (!propertyData.itemName || propertyData.itemName.trim().length < 2) {
      errors.itemName = 'Item name must be at least 2 characters long';
    }
    
    if (!propertyData.itemDescription || propertyData.itemDescription.trim().length < 5) {
      errors.itemDescription = 'Item description must be at least 5 characters long';
    }
    
    // Optional booking number validation
    if (propertyData.bokingNumber && propertyData.bokingNumber.trim().length < 3) {
      errors.bokingNumber = 'Booking number must be at least 3 characters long if provided';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate returner data before marking as found
   * @param {Object} returnerData - Returner data to validate
   * @returns {Object} Validation result
   */
  validateReturnerData(returnerData) {
    const errors = {};
    
    if (!returnerData.returnerName || returnerData.returnerName.trim().length < 2) {
      errors.returnerName = 'Returner name must be at least 2 characters long';
    }
    
    if (!returnerData.returnerPhone || returnerData.returnerPhone.trim().length < 10) {
      errors.returnerPhone = 'Phone number must be at least 10 digits';
    }
    
    if (!returnerData.returnerEmail || !this.isValidEmail(returnerData.returnerEmail)) {
      errors.returnerEmail = 'Please provide a valid email address';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Format property for display with additional computed fields
   * @param {Object} property - Property object
   * @returns {Object} Formatted property
   */
  formatPropertyForDisplay(property) {
    return {
      ...property,
      statusDisplay: property.status === 'found' ? '✅ Found' : '❌ Lost',
      clientName: property.booking?.client?.name || 'Unknown',
      driverName: property.booking?.driver?.name || 'Unknown',
      hasReturner: !!(property.returnerName && property.returnerPhone && property.returnerEmail),
      createdAtFormatted: property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Unknown'
    };
  }

  /**
   * Get statistics for lost properties
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics() {
    try {
      const response = await api.get('/lost-properties');
      const allProperties = response.data.data || response.data;
      
      const total = allProperties.length;
      const found = allProperties.filter(p => p.status === 'found').length;
      const lost = total - found;
      const foundRate = total > 0 ? Math.round((found / total) * 100) : 0;
      
      // Recent statistics (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recent = allProperties.filter(p => new Date(p.createdAt) >= thirtyDaysAgo);
      
      return {
        total,
        found,
        lost,
        foundRate,
        recentTotal: recent.length,
        recentFound: recent.filter(p => p.status === 'found').length
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
const lostPropertiesService = new LostPropertiesService();
export default lostPropertiesService;

// Export the class as well for testing or custom instances
export { LostPropertiesService };