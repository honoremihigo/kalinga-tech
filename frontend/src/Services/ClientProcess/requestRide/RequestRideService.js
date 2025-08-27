import axios from "axios";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

const RequestRideService = {
  async requestRide(formdata) {
    try {
      // Check for missing fields
      for (const [key, value] of Object.entries(formdata)) {
        if (
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          alert(`Missing required field: ${key}`);
          return;
        }
      }

      const formattedData = {
        pickuplocation: formdata.pickup,
        dropofflocation: formdata.dropoff,
        whotopick: formdata.pickPerson,
        pickuplat: formdata.pickLat ? Number(formdata.pickLat) : undefined,
        pickuplong: formdata.pickLong ? Number(formdata.pickLong) : undefined,
        dropofflat: formdata.dropLat ? Number(formdata.dropLat) : undefined,
        dropofflong: formdata.dropLong ? Number(formdata.dropLong) : undefined,
        time: formdata.pickTime,
      };
      console.log("FORMATTED DATA ON SUBMIT : ", formattedData);

      const response = await axios.post(
        `${API_URL}/ride/request`,
        formattedData,
        { withCredentials: true }
      );

      console.log("data sksks :", response.data);
      return response;
    } catch (error) {
      console.error("Request failed:", error);
      throw error; // Rethrow for better error handling
    }
  },

  async guestRideRequest(formdata) {
    try {
      // Check for missing fields
      for (const [key, value] of Object.entries(formdata)) {
        if (
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          alert(`Missing required field: ${key}`);
          return;
        }
      }

      const formattedData = {
        pickuplocation: formdata.pickup,
        dropofflocation: formdata.dropoff,
        pickuplat: formdata.pickLat ? Number(formdata.pickLat) : undefined,
        pickuplong: formdata.pickLong ? Number(formdata.pickLong) : undefined,
        dropofflat: formdata.dropLat ? Number(formdata.dropLat) : undefined,
        dropofflong: formdata.dropLong ? Number(formdata.dropLong) : undefined,
        time: formdata.pickTime,
        name: formdata.name,
        phone: formdata.phone,
        email: formdata.email,
      };
      console.log("FORMATTED DATA ON SUBMIT : ", formattedData);

      const response = await axios.post(
        `${API_URL}/ride/guest-request`,
        formattedData,
        { withCredentials: true }
      );

      console.log("data sksks :", response.data);
      return response;
    } catch (error) {
      console.error("Request failed:", error);
      throw error; // Rethrow for better error handling
    }
  },

  async confirmPayment(sessionId) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ride/confirmed-web-payment`,
        {
          sessionId,
        },
        { withCredentials: true }
      );

      if (response.data.rideId) {
        Swal.fire({
          title: "Payment Successful!",
          icon: "success",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
      return response.data;
    } catch (error) {
      Swal.fire({
        title: "Payment Failed!",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      throw new Error(error);
    }
  },
};

export const convertTimeToDateTime = (timeString) => {
  if (!timeString) return undefined; // Return undefined instead of null
  const [hours, minutes] = timeString.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return undefined; // Handle invalid time format

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export default RequestRideService;
