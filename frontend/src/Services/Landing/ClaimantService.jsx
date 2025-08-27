import api from '../../api/api'; // Adjust the import path based on your file structure

/**
 * Claimant Service
 * Frontend service for managing claimant operations
 */
class ClaimantService {
  
  /**
   * Create a new claimant
   * @param {Object} claimantData - The claimant data to create
   * @returns {Promise<Object>} Response with message and created claimant data
   */
  async createClaimant(claimantData) {
    try {
      const response = await api.post('/claimants/create', claimantData);
      return response.data;
    } catch (error) {
      console.error('Error creating claimant:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get all claimants
   * @returns {Promise<Object>} Response with message and array of claimants
   */
  async getAllClaimants() {
    try {
      const response = await api.get('/claimants');
      return response.data;
    } catch (error) {
      console.error('Error fetching claimants:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get a single claimant by ID
   * @param {string} id - The claimant ID
   * @returns {Promise<Object>} Response with message and claimant data
   */
  async getClaimantById(id) {
    try {
      const response = await api.get(`/claimants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching claimant ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update a claimant
   * @param {string} id - The claimant ID
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} Response with message and updated claimant data
   */
  async updateClaimant(id, updateData) {
    try {
      const response = await api.put(`/claimants/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating claimant ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Delete a claimant
   * @param {string} id - The claimant ID
   * @returns {Promise<Object>} Response with success message
   */
  async deleteClaimant(id) {
    try {
      const response = await api.delete(`/claimants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting claimant ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - The error object
   * @returns {Object} Formatted error object
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
        data: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 500,
        message: 'Network error - no response from server',
        data: null
      };
    } else {
      // Something else happened
      return {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        data: null
      };
    }
  }
}

// Create and export a singleton instance
const claimantService = new ClaimantService();
export default claimantService;

// Also export the class if you need multiple instances
export { ClaimantService };

/*
Usage Examples:

// Import the service
import claimantService from './services/claimantService';

// Create a new claimant
const createClaimant = async () => {
  try {
    const newClaimant = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      // ... other claimant fields
    };
    
    const result = await claimantService.createClaimant(newClaimant);
    console.log('Claimant created:', result);
  } catch (error) {
    console.error('Failed to create claimant:', error);
  }
};

// Get all claimants
const fetchAllClaimants = async () => {
  try {
    const result = await claimantService.getAllClaimants();
    console.log('All claimants:', result.data);
  } catch (error) {
    console.error('Failed to fetch claimants:', error);
  }
};

// Get claimant by ID
const fetchClaimant = async (id) => {
  try {
    const result = await claimantService.getClaimantById(id);
    console.log('Claimant:', result.data);
  } catch (error) {
    console.error('Failed to fetch claimant:', error);
  }
};

// Update claimant
const updateClaimant = async (id, updates) => {
  try {
    const result = await claimantService.updateClaimant(id, updates);
    console.log('Claimant updated:', result);
  } catch (error) {
    console.error('Failed to update claimant:', error);
  }
};

// Delete claimant
const removeClaimant = async (id) => {
  try {
    const result = await claimantService.deleteClaimant(id);
    console.log('Claimant deleted:', result.message);
  } catch (error) {
    console.error('Failed to delete claimant:', error);
  }
};

// Using with React hooks
import { useState, useEffect } from 'react';

const ClaimantList = () => {
  const [claimants, setClaimants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClaimants = async () => {
      try {
        setLoading(true);
        const result = await claimantService.getAllClaimants();
        setClaimants(result.data);
      } catch (err) {
        setError(claimantService.handleError(err));
      } finally {
        setLoading(false);
      }
    };

    loadClaimants();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {claimants.map(claimant => (
        <div key={claimant.id}>{claimant.name}</div>
      ))}
    </div>
  );
};
*/