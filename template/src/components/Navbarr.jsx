import { FaBell, FaUserCircle, FaSignOutAlt, FaCog, FaEnvelope, FaUser, FaRobot } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import NotificationService from '../services/NotificationService';
import './Navbarr.css';

function Navbarr({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
      setUserRole(user.role);
    }

    // Fetch notifications when component mounts
    fetchUnreadCount();
    
    // Set up intervals for periodic updates
    const countInterval = setInterval(fetchUnreadCount, 30000); // Check unread count every 30 seconds
    
    // Handle clicks outside of dropdown to close it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(countInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch unread notifications count
  const fetchUnreadCount = async () => {
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };
  
  // Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const fetchedNotifications = await NotificationService.getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  const toggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    
    if (showProfileDropdown) setShowProfileDropdown(false);
    
    // Fetch notifications when opening the dropdown
    if (newState) {
      await fetchNotifications();
      
      // Mark notifications as read
      if (unreadCount > 0) {
        try {
          await NotificationService.markAsRead();
          setUnreadCount(0);
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      }
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (showNotifications) setShowNotifications(false);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <nav className="navbar-fixed">
      {/* Left: Title and hamburger */}
      <div className="navbar-left">
        <button className="icon-btn d-md-none me-3" onClick={onMenuClick}>
          <i className="fas fa-bars"></i>
        </button>
        <span className="navbar-title">SmartMeet</span>
      </div>      {/* Right: Icons */}
      <div className="navbar-icons">
            <div className="position-relative" ref={notificationRef}>          <button className="icon-btn" onClick={toggleNotifications}>
            <FaBell />
            {unreadCount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="position-absolute end-0 mt-2 bg-light shadow rounded notification-dropdown">
              <div className="dropdown-header py-2 px-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0">Notifications</h6>
                {unreadCount > 0 && (
                  <span className="badge bg-primary rounded-pill">{unreadCount} New</span>
                )}
              </div>
              <div className="dropdown-divider my-0"></div>
              
              {loading ? (
                <div className="p-3 text-center">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="ms-2">Loading notifications...</span>
                </div>
              ) : notifications.length > 0 ? (
                <>
                  {notifications.map((n) => (
                    <div key={n.id} className={`notification-item p-3 ${!n.read_at ? 'bg-light' : ''}`}>
                      <div className="d-flex align-items-start">                        <div className="notification-icon bg-primary-light rounded-circle p-2">
                          {n.type === 'MeetingTodayNotification' ? (
                            <FaBell className="text-primary" />
                          ) : (
                            <FaEnvelope className="text-primary" />
                          )}
                        </div>
                        <div className="ms-3">
                          <p className="notification-text mb-1 fw-semibold">
                            {n.type === 'MeetingTodayNotification' 
                              ? `Meeting Today: ${n.data.meeting_title}`
                              : n.type === 'NewOrderOfDayNotification'
                              ? `Order of Day Updated: ${n.data.commission_name}`
                              : n.data.message || 'Notification'}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{n.time_ago}</small>
                            <button 
                              className="btn btn-sm btn-link text-danger p-0" 
                              onClick={(e) => {
                                e.stopPropagation();
                                NotificationService.deleteNotification(n.id)
                                  .then(() => fetchNotifications());
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="dropdown-divider my-0"></div>
                </>
              ) : (
                <div className="p-3 text-center text-muted">
                  No notifications
                </div>
              )}
              
              <div className="text-center p-2">
                <button 
                  className="btn btn-sm btn-link text-decoration-none" 
                  onClick={() => {
                    NotificationService.markAsRead();
                    setUnreadCount(0);
                  }}
                >
                  Mark All as Read
                </button>
              </div>
            </div>
          )}
        </div>        <div className="position-relative icon-btn">
          <a href="/dashboard/help-assistant" className="chatbot-link">
            <FaRobot size={24} className="chatbot-icon" />
          </a>
        </div>
        
        <div className="position-relative" ref={dropdownRef}>
          <button className="icon-btn profile-btn" onClick={toggleProfileDropdown}>
            <FaUserCircle size={22} />
            <span className="ms-2 d-none d-md-inline ">{userName || 'User'}</span>
          </button>
          {showProfileDropdown && (
            <div className="position-absolute end-0 mt-2 bg-light shadow rounded profile-dropdown">
              <div className="user-info p-3 text-center">
                <div className="avatar-circle mx-auto mb-2">
                  <FaUserCircle size={50} className="text-primary" />
                </div>
                <h6 className="mb-1">{userName || 'User'}</h6>
                <span className="badge bg-secondary">{userRole ? userRole.replace('_', ' ').toUpperCase() : ''}</span>
              </div>
              
              <button className="dropdown-item py-2 text-danger d-flex align-items-center" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbarr;
