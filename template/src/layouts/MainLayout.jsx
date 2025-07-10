import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbarr from '../components/Navbarr';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import meetingNotificationService from '../services/MeetingNotificationService';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      // Not authenticated, redirect to login
      navigate('/login');
    } else {
      setIsAuthenticated(true);
      
      // User is authenticated, check for today's meetings immediately
      meetingNotificationService.checkForTodayMeetings();
    }
  }, [navigate]);

  // Fix for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // Reset sidebar state for desktop view
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading or authenticated content
  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#F4F7FA' }}>
        <div className="text-center">
          <div className="spinner-loading">
            <FaSpinner className="spin-icon" />
          </div>
          <p className="text-muted mt-3">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="app-layout">
      <div className={`sidebar-fixed ${sidebarOpen ? 'show' : ''}`}>
        <Sidebar />
      </div>
      <div className="main-content">
        <Navbarr onMenuClick={toggleSidebar} />
        <main className="main-area">
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
