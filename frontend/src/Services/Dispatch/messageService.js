import axios from 'axios';

const API_URL =
    import.meta.env.VITE_API_URL;

// Send a message to a client
export const sendMessage = async(to, message) => {
    const res = await axios.post(`${API_URL}/messages/send`, { to, message });
    return res.data;
};

// Fetch messages sent TO the client by phone number
export const getSentMessages = async(phone) => {
    const res = await axios.post(`${API_URL}/messages/sent-message`, { phone });
    return res.data;
};

// Fetch inbound messages (received from or to client), optionally filtered by phone number
export const getInboxMessages = async(phone) => {
    const body = phone ? { phone } : {};
    const res = await axios.post(`${API_URL}/messages/inbox`, body);
    return res.data;
};