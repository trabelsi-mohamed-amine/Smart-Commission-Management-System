// Configuration file for API URLs and other constants

// API base URL - defaults to localhost:8000 if VITE_API_URL is not defined
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_BASE_URL = `${API_URL}/api`;

// Authentication
export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
  logout: `${API_BASE_URL}/logout`,
};

// Notifications
export const NOTIFICATION_ENDPOINTS = {
  getAll: `${API_BASE_URL}/notifications`,
  markAsRead: `${API_BASE_URL}/notifications/mark-as-read`,
  unreadCount: `${API_BASE_URL}/notifications/unread-count`,
  delete: (id) => `${API_BASE_URL}/notifications/${id}`,
  todayMeetings: `${API_URL}/api/meetings/today`,
};

// Other API endpoints can be added here
