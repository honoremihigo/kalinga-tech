import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Send cookies with every request
});

const AuthService = {
  sendOtp: async (value) => {
    const response = await API.post('driver/auth/login', { value });
    return response.data;
  },

  verifyOtp: async (value, otp) => {
    const response = await API.post('driver/auth/verify', { value, otp });
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get('driver/auth/me');
    const user = response.data;

    console.log('Logged in User ID:', user.id);

    return user;
  },

  isAuthenticated: async () => {
    try {
      const response = await API.get('driver/auth/me');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  googleLogin: async (token) => {
    const response = await API.post('driver/auth/google-login', { token });
    return response.data;
  },

  appleLogin: async (token) => {
    const response = await API.post('driver/auth/apple-login', { token });
    return response.data;
  },

  logout: async () => {
    const response = await API.post('driver/auth/logout');
    return response.data;
  },

  deleteAccount: async () => {
    const response = await API.delete('driver/auth/delete-account');
    return response.data;
  },
};

export default AuthService;
