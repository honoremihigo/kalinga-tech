// src/services/driverReservationService.js
import axios from 'axios';

// Create an Axios instance with default config
const apiClient = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDriverReservations = async () => {
  try {
    const response = await apiClient.get('/driver-reservations');
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error.response?.data?.message || 'Failed to fetch reservations';
  }
};

export const fetchReservationDetails = async (id) => {
  try {
    const response = await apiClient.get(`/driver-reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservation details:', error);
    throw error.response?.data?.message || 'Failed to fetch reservation details';
  }
};

export const markReservationComplete = async (id) => {
  try {
    const response = await apiClient.put(`/driver-reservations/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error marking reservation complete:', error);
    throw error.response?.data?.message || 'Failed to mark reservation complete';
  }
};

export const fetchDriverStats = async () => {
  try {
    const response = await apiClient.get('/driver-reservations/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching driver stats:', error);
    throw error.response?.data?.message || 'Failed to fetch driver stats';
  }
};

export const submitFoundItem = async (foundItemData) => {
  try {
    const response = await apiClient.post('/reservation/found-items', foundItemData);
    return response.data;
  } catch (error) {
    console.error('Error submitting found item:', error);
    throw error.response?.data?.message || 'Failed to submit found item';
  }
};