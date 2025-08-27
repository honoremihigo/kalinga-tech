import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const LostPropertyService = {
  // Create a new lost property report
  create: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/lost-property`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create lost property report");
    }
  },

  // Get all lost property reports
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/lost-property`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch lost property reports");
    }
  },

  // Update a lost property report by ID
  update: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/lost-property/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update lost property report");
    }
  },

  // Delete a lost property report by ID
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/lost-property/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete lost property report");
    }
  },

  // Activate a lost property report by ID (e.g. change status)
  activate: async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/lost-property/${id}/activate`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to activate lost property report");
    }
  },
};
