// services/statsService.js
import axios from 'axios';

const SERVICE_API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: `${SERVICE_API_BASE_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${localStorage.getItem('token')}` // Add if auth is required
  },
});

// GET /stats/counts
const getSystemCounts = async () => {
  try {
    const response = await apiClient.get('/stats/counts');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export default {
  getSystemCounts,
};
