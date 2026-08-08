import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { ROLES } from '../utils/constants';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to default dashboard based on user's actual role
    if (role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
    if (role === ROLES.MECHANIC) return <Navigate to="/mechanic/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
