import axios from "axios";
import { API_BASE_URL, NOTIFICATION_ENDPOINTS } from "../config/api";
import { toast } from 'react-toastify';

/**
 * Meeting Notifications Service
 * Checks for today's meetings and handles browser notifications
 * This avoids the need for a server-side scheduler
 */
class MeetingNotificationService {
  constructor() {
    this.initialized = false;
    this.checkInterval = 15 * 60 * 1000; // Check every 15 minutes by default
    this.lastCheckTime = null;
    this.localStorageKey = 'lastMeetingCheck';
    this.todayString = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Initialize the notification service
   * @param {object} options - Configuration options
   * @param {number} options.interval - Check interval in milliseconds
   */
  init(options = {}) {
    if (this.initialized) return;
    
    if (options.interval) {
      this.checkInterval = options.interval;
    }
    
    // Check if we need to run the check now (if user has been logged in for a while)
    this.maybeCheckForMeetings();
    
    // Set up interval for future checks
    setInterval(() => this.maybeCheckForMeetings(), this.checkInterval);
    
    this.initialized = true;
    console.log('Meeting notification service initialized');
  }
  
  /**
   * Check for meetings if enough time has passed since last check
   */
  maybeCheckForMeetings() {
    // Skip if user is not authenticated
    if (!this.isAuthenticated()) {
      console.log('Not checking meetings - user not authenticated');
      return;
    }
    
    // Get the last check time from localStorage
    const lastCheck = localStorage.getItem(this.localStorageKey);
    const lastCheckDate = lastCheck ? new Date(lastCheck) : null;
    const now = new Date();
    
    // Skip if already checked today (respecting the interval)
    if (lastCheckDate) {
      const timeSinceLastCheck = now - lastCheckDate;
      
      // If the check was today and less than our interval ago, skip
      if (
        lastCheckDate.toISOString().split('T')[0] === this.todayString && 
        timeSinceLastCheck < this.checkInterval
      ) {
        console.log('Skipping meeting check - checked recently');
        return;
      }
    }
    
    // Perform the check
    this.checkForTodayMeetings();
  }
  
  /**
   * Check for today's meetings and trigger notifications
   */
  async checkForTodayMeetings() {
    try {
      // Only proceed if user is authenticated
      if (!this.isAuthenticated()) {
        console.log('User not authenticated, skipping meeting check');
        return;
      }
      
      console.log('Checking for today\'s meetings...');
      
      // Call API to get today's meetings
      const response = await axios.get(NOTIFICATION_ENDPOINTS.todayMeetings, {
        headers: this.getAuthHeaders()
      });
      
      const meetings = response.data;
      
      // Update last check time
      localStorage.setItem(this.localStorageKey, new Date().toISOString());
      
      // If no meetings, we're done
      if (!meetings || !meetings.length) {
        console.log('No meetings found for today');
        return;
      }
      
      console.log(`Found ${meetings.length} meetings for today`);
      
      // Process each meeting
      meetings.forEach(meeting => {
        this.showMeetingNotification(meeting);
      });
      
    } catch (error) {
      console.error('Failed to check for meetings:', error);
    }
  }
  
  /**
   * Display a browser notification for a meeting
   * @param {object} meeting - Meeting data
   */
  showMeetingNotification(meeting) {
    // Check if browser notifications are supported and permitted
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }
    
    // Skip if notification was already shown for this meeting today
    const notifiedMeetingsKey = `notifiedMeetings_${this.todayString}`;
    const notifiedMeetings = JSON.parse(localStorage.getItem(notifiedMeetingsKey) || '[]');
    
    if (notifiedMeetings.includes(meeting.id)) {
      console.log(`Already notified for meeting ${meeting.id} today`);
      return;
    }
    
    // Request permission if needed
    if (Notification.permission === "default") {
      Notification.requestPermission();
      // Show toast instead
      this.showToastNotification(meeting);
      return;
    }
    
    if (Notification.permission === "granted") {
      // Format meeting time for display
      const time = meeting.time || '00:00';
      
      // Create and show notification
      const notification = new Notification("Réunion aujourd'hui", {
        body: `${meeting.title}\nHeure: ${time}\n${meeting.commission?.name || 'Commission non spécifiée'}`,
        icon: "/favicon.ico", // Default icon
      });
      
      // Add click handler to go to meeting details
      notification.onclick = () => {
        window.focus();
        window.location.href = `/dashboard/meetings/${meeting.id}`;
      };
      
      // Mark this meeting as notified
      notifiedMeetings.push(meeting.id);
      localStorage.setItem(notifiedMeetingsKey, JSON.stringify(notifiedMeetings));
    } else {
      // If notifications are denied, use toast instead
      this.showToastNotification(meeting);
    }
  }
    /**
   * Show a toast notification for a meeting (fallback for browser notifications)
   * @param {object} meeting - Meeting data
   */
  showToastNotification(meeting) {
    const time = meeting.time || '00:00';
    const commission = meeting.commission?.name || 'Commission non spécifiée';
    
    // Use a string instead of JSX for the content
    const content = `Réunion aujourd'hui: ${meeting.title}\nHeure: ${time}\n${commission}`;
    
    toast.info(content, {
        autoClose: 10000,
        onClick: function() {
          window.location.href = '/dashboard/meetings/' + meeting.id;
        }
      });
    
    // Mark as notified even when using toast
    const notifiedMeetingsKey = `notifiedMeetings_${this.todayString}`;
    const notifiedMeetings = JSON.parse(localStorage.getItem(notifiedMeetingsKey) || '[]');
    notifiedMeetings.push(meeting.id);
    localStorage.setItem(notifiedMeetingsKey, JSON.stringify(notifiedMeetings));
  }
  
  /**
   * Check if the user is authenticated
   * @return {boolean} Whether the user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  
  /**
   * Get authentication headers for API requests
   * @returns {Object} Headers object with Authorization token
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
  }
}

// Create global instance
const meetingNotificationService = new MeetingNotificationService();

// Export for module usage
export default meetingNotificationService;
