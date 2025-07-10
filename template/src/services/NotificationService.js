import axios from "axios";
import { API_BASE_URL, NOTIFICATION_ENDPOINTS } from "../config/api";

class NotificationService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
    });

    // Add interceptor to include auth token in requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  // Get all notifications
  async getNotifications() {
    try {
      console.log('Fetching notifications from:', NOTIFICATION_ENDPOINTS.getAll);
      const response = await axios.get(NOTIFICATION_ENDPOINTS.getAll, {
        headers: this.getAuthHeaders()
      });
      console.log('Notifications fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Get count of unread notifications
  async getUnreadCount() {
    try {
      console.log('Fetching unread count from:', NOTIFICATION_ENDPOINTS.unreadCount);
      const response = await axios.get(NOTIFICATION_ENDPOINTS.unreadCount, {
        headers: this.getAuthHeaders()
      });
      console.log('Unread count:', response.data.count);
      return response.data.count;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  }

  // Mark notifications as read
  async markAsRead(ids = []) {
    try {
      const response = await axios.post(
        NOTIFICATION_ENDPOINTS.markAsRead, 
        { ids },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(id) {
    try {
      const response = await axios.delete(
        NOTIFICATION_ENDPOINTS.delete(id), 
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
  
  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }
}

export default new NotificationService();