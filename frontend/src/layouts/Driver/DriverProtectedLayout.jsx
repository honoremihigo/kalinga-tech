import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../Services/DriverService/Auth';

function DriverProtectedLayout() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await AuthService.getProfile();
        setUser(userData); // contains { driver, vehicles }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600"></div>
      </div>
    );
  }

  if (!user || !user.driver) {
    return <Navigate to="/AbyrideDriver" replace />;
  }

  return <Outlet context={{ user }} />; // Provide user via context
}

export default DriverProtectedLayout;
