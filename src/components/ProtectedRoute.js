import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, vendorOnly = false }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={vendorOnly ? '/vendor-login' : '/customer-login'} />;
  }

  if (vendorOnly && !user.isVendor) {
    return <Navigate to="/customer-login" />;
  }

  return children;
}

export default ProtectedRoute;
