import api from '../../api/api'; // Your axios instance

/**
 * Found Property Service - Frontend API integration for found property operations
 * Handles all CRUD operations and file uploads for found properties
 */
class FoundPropertyService {
  /**
   * Create a new found property with image
   * @param {Object} propertyData - Found property information
   * @param {File} image - Property image file
   * @returns {Promise<Object>} Created property data
   */
  async createFoundProperty(propertyData, image) {
    try {
      const formData = new FormData();
      
      // Append property data to FormData
      Object.keys(propertyData).forEach(key => {
        if (propertyData[key] !== null && propertyData[key] !== undefined) {
          formData.append(key, propertyData[key]);
        }
      });
      
      // Append image if provided
      if (image) {
        formData.append('imageUrl', image);
      }

      const response = await api.post('/found-properties/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all found properties
   * @returns {Promise<Array>} List of all found properties
   */
  async getAllFoundProperties() {
    try {
      const response = await api.get('/found-properties');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific found property by ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Property data
   */
  async getFoundPropertyById(propertyId) {
    try {
      const response = await api.get(`/found-properties/${propertyId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a found property
   * @param {string} propertyId - Property ID
   * @param {Object} updateData - Data to update
   * @param {File} image - Updated image file (optional)
   * @returns {Promise<Object>} Updated property data
   */
  async updateFoundProperty(propertyId, updateData, image) {
    try {
      const formData = new FormData();
      
      // Append update data to FormData
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          formData.append(key, updateData[key]);
        }
      });
      
      // Append image if provided
      if (image) {
        formData.append('imageUrl', image);
      }

      const response = await api.put(`/found-properties/${propertyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a found property
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Success message
   */
  async deleteFoundProperty(propertyId) {
    try {
      const response = await api.delete(`/found-properties/${propertyId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Approve a found property claim
   * @param {Object} approvalData - Approval information
   * @returns {Promise<Object>} Updated property data
   */
  async approveFoundProperty(approvalData) {
    try {
      const response = await api.post('/found-properties/return', approvalData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate found property data before submission
   * @param {Object} propertyData - Property data to validate
   * @returns {Object} Validation result
   */
  validateFoundPropertyData(propertyData) {
    const errors = {};
    
    console.log(propertyData);
    
    // Required fields validation
    if (!propertyData.itemDescription || propertyData.itemDescription.trim().length < 3) {
      errors.itemDescription = 'Description must be at least 3 characters long';
    }
    
    if (!propertyData.driverId || isNaN(parseInt(propertyData.driverId))) {
      errors.driverId = 'Valid driver ID is required';
    }
    
    if (!propertyData.locationFound) {
      errors.locationFound = 'Location is required ';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate approval data before submission
   * @param {Object} approvalData - Approval data to validate
   * @returns {Object} Validation result
   */
  validateApprovalData(approvalData) {
    const errors = {};
    
    if (!approvalData.foundPropertyId) {
      errors.foundPropertyId = 'Found property ID is required';
    }
    
    if (!approvalData.claimantId) {
      errors.claimantId = 'Claimant ID is required';
    }
    
    if (!approvalData.name || approvalData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!approvalData.email || !this.isValidEmail(approvalData.email)) {
      errors.email = 'Please provide a valid email address';
    }
    
    if (!approvalData.phone || approvalData.phone.trim().length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
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
const foundPropertyService = new FoundPropertyService();
export default foundPropertyService;

// Export the class as well for testing or custom instances
export { FoundPropertyService };