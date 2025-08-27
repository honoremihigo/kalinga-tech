import axios from "axios";

const JSON_API = "http://localhost:8000";

export const BookRide = {
  SearchPlaceCar: async (formData) => {
    try {
      const response = await axios.post(`${JSON_API}/rides`, formData);
      return response.data;
    } catch (error) {
      console.error("Error submitting payment method:", error);
    }
  },

  FetchAvailableCar: async () => {
    try {
      const response = await axios.get(`${JSON_API}/cars`);
      return response.data;
    } catch (error) {
      console.error("Error submiting payment method:", error);
    }
  },
  CheckPaymentMethod: async () => {},
  ConfirmRequestRide: async (formData) => {
    try {
      const response = await axios.post(`${JSON_API}/bookings`, formData);
      return response.data;
    } catch (error) {
      console.error("Error submiting payment method:", error);
    }
  },
  FetchCarByDriver: async (driverId) => {
    try {
      const response = await fetch(`${JSON_API}/cars/driver/${driverId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch car details for driver ${driverId}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching car by driver:", error.message);
      throw error;
    }
  },
};
