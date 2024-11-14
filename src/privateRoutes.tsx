// PrivateRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { currentUser } = useAuth();

  // Redirect to login if the user is not authenticated
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
