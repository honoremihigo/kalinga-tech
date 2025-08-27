// const JSON_API = import.meta.env.JSON_SERVER_API;
import axios from "axios";
const JSON_API = "http://localhost:3000";

export const SavePaymentMethod = {
  PaymentMethod: async (paymentData) => {
    try {
      const response = await axios.post(`${JSON_API}/payments`, paymentData);
      return response.data;
    } catch (error) {
      console.error("Error submiting payment method:", error);
    }
  },
};
