import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const FoundPropertyService = {
  // Create a new found property record
  create: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/found-property`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create found property record");
    }
  },

  // Get all found property records
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/found-property`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch found property records");
    }
  },

  // Update a found property record by ID
  update: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/found-property/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update found property record");
    }
  },

  // Delete a found property record by ID
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/found-property/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete found property record");
    }
  },

  // Mark found property as delivered to client by ID
  activate: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/found-property/activate/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to mark found property as delivered");
    }
  },
};
