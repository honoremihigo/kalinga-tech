import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../Services/ClientProcess/Auth';

function ClientProtectedRouter() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await AuthService.getProfile();
        setUser(userData); // Contains { client }
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

  if (!user || !user.client) {
    return <Navigate to="/AbyrideClient" replace />;
  }

  return <Outlet context={{ user }} />;
}

export default ClientProtectedRouter;
