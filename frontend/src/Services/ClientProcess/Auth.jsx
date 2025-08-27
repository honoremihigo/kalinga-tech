import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // Send cookies with every request
});

const AuthService = {
    sendOtp: async (value) => {
        const response = await API.post('client/auth/login', { value });
        return response.data;
    },

    verifyOtp: async (value, otp) => {
        const response = await API.post('client/auth/verify', { value, otp });
        return response.data;
    },

    getProfile: async () => {
        const response = await API.get('client/auth/me');
        const user = response.data;

        console.log('Logged in User ID:', user.id);

        return user;
    },

    completeProfile: async (profileData) => {
        const response = await API.patch(`client/auth/complete-profile`, profileData);
        return response.data;
    },

    googleLogin: async (token) => {
        const response = await API.post('client/auth/google-login', { token });
        return response.data;
    },

    appleLogin: async (token) => {
        const response = await API.post('client/auth/apple-login', { token });
        return response.data;
    },

    logout: async () => {
        const response = await API.post('client/auth/logout');
        return response.data;
    },

    deleteAccount: async () => {
        const response = await API.delete('client/auth/delete-account');
        return response.data;
    },
};

export default AuthService;
