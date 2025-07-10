import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const NavbarAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
    // Force reload the page to ensure all states are reset
    window.location.reload();
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get role display name
  const getRoleDisplay = (role) => {
    if (!role) return '';
    return role.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  };
  if (!isLoggedIn) {
    return (
      <div className="auth-links d-flex align-items-center">
        <Link to="/login" className="nav-item nav-link">
          <FaUser className="me-1" style={{ fontSize: '0.875em' }} /> Log In
        </Link>
        <Link to="/register" className="nav-item nav-link">
          Register
        </Link>
      </div>
    );
  }  return (
    <div className="auth-section ms-auto d-flex align-items-center">
      <div className="dropdown">
        <button 
          className="btn btn-light dropdown-toggle d-flex align-items-center" 
          onClick={toggleDropdown}
        >
          <div className="avatar rounded-circle bg-primary text-white me-2" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="d-none d-md-inline">{user?.name || 'User'}</span>
          {user?.role && (
            <span className="badge bg-info ms-2">
              {getRoleDisplay(user.role)}
            </span>
          )}
        </button>
        <div className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} style={{ minWidth: '200px' }}>
          <div className="dropdown-header">
            <strong>{user?.name}</strong>
            <div className="small text-muted">{getRoleDisplay(user?.role)}</div>
          </div>
          <div className="dropdown-divider"></div>
          <Link to="/dashboard" className="dropdown-item">
            <FaTachometerAlt className="me-2" /> Dashboard
          </Link>
          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item text-danger">
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarAuth;
