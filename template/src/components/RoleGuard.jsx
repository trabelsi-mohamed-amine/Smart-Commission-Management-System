import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleGuard = ({ allowedRoles }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (token && user) {
        setIsAuth(true);
        setUserRole(user.role);
      } else {
        setIsAuth(false);
        setUserRole(null);
      }
    };
    
    checkAuth();
  }, []);
  
  // Loading state while checking auth
  if (isAuth === null) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }
  
  // Not authenticated
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  
  // User doesn't have the required role
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'commission_member') {
      return <Navigate to="/dashboard/commissions/view" />;
    } else if (userRole === 'commission_manager') {
      return <Navigate to="/dashboard/meetings" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  
  // User has the required role
  return <Outlet />;
};

export default RoleGuard;
