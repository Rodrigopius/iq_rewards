import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Define the ProtectedRoute component
interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the nested route
  return <Outlet />;
};

export default ProtectedRoute;
