import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  // Effect to handle authentication status changes
  useEffect(() => {
    const checkAuth = () => {
      if (!isLoggedIn) {
        navigate('/login', { replace: true });
      }
    };

    // Check auth status when component mounts
    checkAuth();

    // Listen for storage events (in case localStorage changes in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn' && e.newValue !== 'true') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn, navigate]);

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;