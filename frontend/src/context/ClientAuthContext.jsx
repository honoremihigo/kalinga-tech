import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";

// Create context with a default value
const ClientAuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  sendOtp: async () => {
    throw new Error("ClientAuthContext not initialized");
  },
  verifyOtp: async () => {
    throw new Error("ClientAuthContext not initialized");
  },
  logout: async () => {
    throw new Error("ClientAuthContext not initialized");
  },
  updateClient: async () => {
    throw new Error("ClientAuthContext not initialized");
  },
  chopCountryCode: async () => {
    throw new Error("ClientAuthContext not initialized");
  },
  validateIdentifier: () => ({ isValid: false, type: null }),
});

// API URL configuration
const API_URL = import.meta.env.VITE_API_URL;

// eslint-disable-next-line react/prop-types
export const ClientAuthContextProvider = ({ children }) => {
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
    async (identifier,code) => {
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
        const response = await axios.post(`${API_URL}/auth/send-otp`, {
          identifier,code
        });
        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send OTP";
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
      const response = await axios.post(`${API_URL}/auth/verify-otp`, data, {
        withCredentials: true,
      });
      await checkAuth();
      if (response.data.token) {
        setIsAuthenticated(true);
      }

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const updateClient = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${API_URL}/users/update-profile`,
        data,
        {
          withCredentials: true,
        },
      );

      if (response.data.updateUser) {
        setUser(response.data.updateUser); // Update the state with new user data
        return response.data.updateUser; // Return the updated user
      } else {
        throw new Error("Failed to update user profile");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      console.log(response);

      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setUser(response.data.getUser);
      }
    } catch (err) {
      setIsAuthenticated(false);
      console.log(`error caused`, err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  function chopCountryCode(fullNumber, countryCode) {
    // Normalize inputs: remove '+' if present
    const cleanNumber = fullNumber.replace('+', '');
    const cleanCode = countryCode.replace('+', '');
  
    if (cleanNumber.startsWith(cleanCode)) {
      return cleanNumber.slice(cleanCode.length);
    } else {
      // Country code doesn't match
      return null;
    }
  }


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
    updateClient,
    logout,
    validateIdentifier,
    chopCountryCode
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(ClientAuthContext);
  console.log(`the context shit`, context);
  if (!context) {
    throw new Error("useAuth must be used within an ClientAuthContextProvider");
  }
  return context;
};

export default ClientAuthContext;
