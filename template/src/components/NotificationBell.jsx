import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import NotificationService from '../services/NotificationService';
import './NotificationBell.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef(null);
  // Fetch unread count on component mount and set up interval
  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();
    fetchNotifications();
    
    // Refetch notifications count every 15 seconds for more responsive updates
    const countIntervalId = setInterval(fetchUnreadCount, 15000);
    
    // Refetch full notifications every 30 seconds if the dropdown is open
    const notificationsIntervalId = setInterval(() => {
      if (showNotifications) {
        fetchNotifications();
      }
    }, 30000);
    
    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(countIntervalId);
      clearInterval(notificationsIntervalId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);
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
    if (!localStorage.getItem('token')) return;
    
    try {
      const fetchedNotifications = await NotificationService.getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch notifications when clicking the bell
  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);
    
    if (!showNotifications) {
      setLoading(true);
      try {
        await fetchNotifications();
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    
      // Mark notifications as read when opening
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

  // Delete a notification
  const handleDelete = async (id) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Format notification message based on type
  const formatNotification = (notification) => {
    const { type, data } = notification;
    
    if (type === 'MeetingTodayNotification') {
      return (
        <div>
          <strong>Meeting Today:</strong> {data.meeting_title}
          <div className="notification-time">{data.meeting_time}</div>
        </div>
      );
    }
      if (type === 'NewOrderOfDayNotification') {
      return (
        <div>
          <strong>Order of Day Updated:</strong> {data.commission_name}
          <div className="notification-meta">Changes: {data.changes_description}</div>
        </div>
      );
    }
    
    if (type === 'NewCommissionNotification') {
      return (
        <div>
          <strong>New Commission Created:</strong> {data.commission_name}
          <div className="notification-meta">{data.description}</div>
        </div>
      );
    }
    
    return (
      <div>
        <strong>{type}</strong>: {JSON.stringify(data)}
      </div>
    );
  };

  return (
    <div className="notification-bell-container" ref={notificationRef}>
      <div className="notification-bell" onClick={handleBellClick}>
        <FaBell />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>
      
      {showNotifications && (
        <div className="notification-dropdown">
          <h6 className="notification-header">Notifications</h6>
          
          {loading ? (
            <div className="notification-loading">Loading notifications...</div>
          ) : notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                >
                  {formatNotification(notification)}
                  <div className="notification-footer">
                    <small>{notification.time_ago}</small>
                    <button 
                      className="notification-delete-btn" 
                      onClick={() => handleDelete(notification.id)}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="notification-empty">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
