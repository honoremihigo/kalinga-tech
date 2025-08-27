import axios from 'axios';

// Base URL - update this to match your backend URL
const BASE_URL = import.meta.env.VITE_API_URL; // Adjust port and path as needed

class FareService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Create a new fare
  async createFare(fareData) {
    try {
      const response = await this.apiClient.post('/fare/create', fareData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create fare');
    }
  }

  // Get all fares
  async getAllFares() {
    try {
      const response = await this.apiClient.get('/fare/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch fares');
    }
  }

  // Get a single fare by ID
  async getFareById(id) {
    try {
      const response = await this.apiClient.get(`/fare/getone/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch fare');
    }
  }

  // Update a fare
  async updateFare(id, fareData) {
    try {
      const response = await this.apiClient.put(`/fare/update/${id}`, fareData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update fare');
    }
  }

  // Delete a fare
  async deleteFare(id) {
    try {
      const response = await this.apiClient.delete(`/fare/delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete fare');
    }
  }
}

// Export a single instance
const fareService = new FareService();
export default fareService;

// Usage examples:
/*
import fareService from './fareService';

// Create fare
const newFare = await fareService.createFare({
  categoryId: 1,
  fromDay: 'Monday',
  tillDay: 'Friday',
  fromTime: '06:00',
  tillTime: '18:00',
  startRate: 5.00,
  startRatePerMile: 2.50
});

// Get all fares (includes category data)
const fares = await fareService.getAllFares();

// Get single fare (includes category data)
const fare = await fareService.getFareById(1);

// Update fare
const updated = await fareService.updateFare(1, {
  startRate: 6.00,
  startRatePerMile: 3.00
});

// Delete fare
await fareService.deleteFare(1);
*/