import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";

// Create context with a default value
const DriverAuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  sendOtp: async () => {
    throw new Error("DriverAuthContext not initialized");
  },
  verifyOtp: async () => {
    throw new Error("DriverAuthContext not initialized");
  },
  logout: async () => {
    throw new Error("DriverAuthContext not initialized");
  },
  validateIdentifier: () => ({ isValid: false, type: null }),
});

// API URL configuration
const API_URL = import.meta.env.VITE_API_URL;

export const DriverAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const validateIdentifier = useCallback((identifier) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (emailRegex.test(identifier)) {
      return { isValid: true, type: "email" };
    }
    if (phoneRegex.test(identifier)) {
      return { isValid: true, type: "phone" };
    }
    return { isValid: false, type: null };
  }, []);

  const sendOtp = useCallback(
    async (identifier) => {
      setIsLoading(true);
      setError(null);

      const validation = validateIdentifier(identifier);
      if (!validation.isValid) {
        const error = "Invalid email or phone number";
        setError(error);
        setIsLoading(false);
        throw new Error(error);
      }

      try {
        const response = await axios.post(
          `${API_URL}/driver/checkdriver-sendotp`,
          { identifier },
        );
        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err?.response?.data?.message || err.message
            : "Failed to send OTP";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [validateIdentifier],
  );

  const verifyOtp = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/driver/verify-otp`, data, {
        withCredentials: true,
      });

      if (response.data.token) {
        setIsAuthenticated(true);
        setUser({
          id: response.data.token,
          identifier: data.identifier,
        });
      }

      return response.data;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Verification failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/driver/get-driver`, {
        withCredentials: true,
      });
      console.log(`fetched the driver data:`, response.data);

      if (response.data.authenticated) {
        setIsLoading(false);
        setIsAuthenticated(true);
        setUser(response.data.getdriver);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setIsLoading(false);
      console.log(`error caused`, err);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    sendOtp,
    verifyOtp,
    logout,
    validateIdentifier,
  };

  return (
    <DriverAuthContext.Provider value={value}>
      {children}
    </DriverAuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useDriverAuth = () => {
  const context = useContext(DriverAuthContext);
  console.log("driver auth context :", context);
  if (!context) {
    throw new Error("useDriverAuth must be used within an AuthProvider");
  }
  return context;
};

export default DriverAuthContext;
