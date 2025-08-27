import React from "react";
import { Navigate } from "react-router-dom";

import { useDriverAuth } from "../../context/DriverAuthContext";
import Loader from "../Loading";

const DriverProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useDriverAuth();

  // Show a loading state while authentication is being checked
  if (isLoading) {
    return <Loader />;
  }

  // If not authenticated, redirect to login/join page
  if (!isAuthenticated) {
    return <Navigate to="/JoinUs" replace />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
};

export default DriverProtectedRoute;
