import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // No token, redirect to login
    return <Navigate to="/Nso2/controlpanel/dashboard/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Check if the token has expired
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token'); // Remove expired token
      return <Navigate to="/Nso2/controlpanel/dashboard/login" />;
    }

    // Check if the user role is allowed
    if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
      
        console.log("hy")
        return <Navigate to="/unauthorized" />;
    }

    // Token is valid and user role is allowed, render the child components
    return children;
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('token'); // Remove invalid token
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
