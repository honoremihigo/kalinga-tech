import axios from "axios";

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

export const ContactService = {
  // Submit contact message
  ContactUs: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/contact`, userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "An error occurred while sending your message"
      );
    }
  },

  // Get all contact messages
  getAllMessages: async () => {
    try {
      const response = await axios.get(`${API_URL}/contact`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  },

  // Delete a contact message by ID
  deleteMessage: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/contact/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  },
};
