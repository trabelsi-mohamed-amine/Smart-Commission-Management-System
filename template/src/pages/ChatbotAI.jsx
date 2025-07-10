// filepath: c:\Users\amine\Desktop\projet pfe\template\src\pages\ChatbotAI.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';
import './ChatbotAI.css';

const ChatbotAI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial chatbot messages based on user role
  const initialMessages = {
    admin: [
      {
        type: "bot",
        text: "Welcome to SmartMeet admin dashboard! How can I help you today?",
        options: [
          { text: "Manage users", value: "users" },
          { text: "Commission settings", value: "commissions" }, 
          { text: "Reports overview", value: "reports" },
          { text: "System settings", value: "settings" }
        ]
      }
    ],
    commission_president: [
      {
        type: "bot",
        text: "Welcome to your commission president dashboard! How can I help you today?",
        options: [
          { text: "Schedule meetings", value: "schedule" },
          { text: "Manage commission members", value: "members" },
          { text: "Review reports", value: "reports" },
          { text: "Commission settings", value: "settings" }
        ]
      }
    ],
    member: [
      {
        type: "bot",
        text: "Welcome to your member dashboard! What would you like to do?",
        options: [
          { text: "View upcoming meetings", value: "meetings" },
          { text: "Check notifications", value: "notifications" },
          { text: "Access reports", value: "reports" },
          { text: "Update profile", value: "profile" }
        ]
      }
    ],
    default: [
      {
        type: "bot",
        text: "Welcome to SmartMeet! How can I help you navigate the dashboard?",
        options: [
          { text: "Dashboard overview", value: "overview" },
          { text: "Notifications help", value: "notifications" },
          { text: "Profile settings", value: "profile" },
          { text: "General help", value: "help" }
        ]
      }
    ]
  };

  // Responses for different user selections
  const botResponses = {
    // Admin responses
    users: {
      text: "In the User Management section, you can:",
      options: [
        { text: "Add new users", value: "add_users" },
        { text: "Edit user permissions", value: "edit_permissions" },
        { text: "Deactivate accounts", value: "deactivate_accounts" }
      ]
    },
    commissions: {
      text: "For Commission settings, you can:",
      options: [
        { text: "Create new commissions", value: "create_commission" },
        { text: "Assign members", value: "assign_members" },     
        { text: "Configure commission rules", value: "configure_rules" }
      ]
    },
    reports: {
      text: "In the Reports section, you can access:",
      options: [
        { text: "Commission activity reports", value: "commission_reports" },
        { text: "Meeting statistics", value: "meeting_stats" },
        { text: "User activity logs", value: "user_logs" }
      ]
    },
    settings: {
      text: "What system settings would you like to know about?",
      options: [
        { text: "Email notifications", value: "email_settings" },
        { text: "System preferences", value: "system_prefs" },
        { text: "Security settings", value: "security_settings" }
      ]
    },
    schedule: {
      text: "For scheduling meetings, you can:",
      options: [
        { text: "Create a new meeting", value: "new_meeting" },
        { text: "Edit an existing meeting", value: "edit_meeting" },
        { text: "Set recurring meetings", value: "recurring_meetings" }
      ]
    },
    members: {
      text: "For commission member management, you can:",
      options: [
        { text: "Add new members", value: "add_members" },
        { text: "Update member roles", value: "update_roles" },
        { text: "Remove members", value: "remove_members" }
      ]
    },
    meetings: {
      text: "For your upcoming meetings, you can:",
      options: [
        { text: "View meeting schedule", value: "view_schedule" },
        { text: "Check meeting details", value: "meeting_details" },
        { text: "Access meeting materials", value: "meeting_materials" }
      ]
    },
    notifications: {
      text: "For notification settings, you can:",
      options: [
        { text: "Configure email alerts", value: "email_alerts" },
        { text: "Set notification preferences", value: "notification_prefs" },
        { text: "Manage calendar integration", value: "calendar_integration" }
      ]
    },
    profile: {
      text: "For your profile settings, you can:",
      options: [
        { text: "Update personal information", value: "update_info" },
        { text: "Change password", value: "change_password" },
        { text: "Manage notification preferences", value: "notification_prefs" }
      ]
    },
    overview: {
      text: "The dashboard provides access to:",
      options: [
        { text: "Your upcoming meetings", value: "meetings" },
        { text: "Commission information", value: "commissions" },
        { text: "Notification center", value: "notifications" }
      ]
    },
    help: {
      text: "How can I assist you today?",
      options: [
        { text: "Navigation help", value: "navigation" },
        { text: "Account issues", value: "account_issues" },
        { text: "Feature tutorials", value: "tutorials" }
      ]
    },
    
    // Final responses
    add_users: "To add new users, go to Users > Add User and fill out the required information. New users will receive an email invitation to set up their account.",
    edit_permissions: "To edit user permissions, select a user from the Users list, click 'Edit' and adjust their role and permission settings as needed.",
    deactivate_accounts: "To deactivate a user account, go to the Users list, select the user, and click the 'Deactivate' button. The user will be notified and will no longer have access to the system.",
    create_commission: "To create a new commission, navigate to Commissions > Add New and provide the commission details, including name, purpose, and initial members.",
    assign_members: "To assign members to a commission, go to the commission details page, click 'Manage Members', then use the search function to find and add new members.",
    configure_rules: "Commission rules can be configured in the commission settings. Go to your commission page, click 'Settings', and then 'Rules & Procedures'.",
    commission_reports: "Commission activity reports are available under Reports > Commissions. You can filter by date range and export to PDF or Excel.",
    meeting_stats: "Meeting statistics show attendance trends, meeting durations, and decision outcomes. Access them via Reports > Meeting Analytics.",
    user_logs: "User activity logs track system usage and can be viewed under Reports > User Activity. These logs are available only to administrators.",
    email_settings: "Email notification settings can be configured under System Settings > Notifications. You can customize templates and frequency of notifications.",
    system_prefs: "System preferences allow you to customize the platform appearance and default behaviors under System Settings > Preferences.",
    security_settings: "Security settings for password policies and login requirements are under System Settings > Security.",
    new_meeting: "To create a new meeting, go to Meetings > Schedule New, fill in the details, select participants, and set the agenda items.",
    edit_meeting: "To edit an existing meeting, find it in your Meetings list, click on it, then select 'Edit Details'.",
    recurring_meetings: "For recurring meetings, when creating a new meeting, check the 'Recurring' option and set the frequency pattern.",
    add_members: "To add new members to your commission, go to Commission Details > Members > Add New, then search for users and set their roles.",
    update_roles: "Member roles can be updated from the Commission Members page by clicking the role dropdown next to each member's name.",
    remove_members: "To remove a member, go to Commission Details > Members, find the member, and click the remove icon. They will be notified automatically.",
    view_schedule: "Your meeting schedule is visible on your dashboard calendar or under Meetings > Calendar View.",
    meeting_details: "To see specific meeting details, click on any meeting in your calendar or meetings list.",
    meeting_materials: "Meeting materials like documents and presentations can be accessed from the specific meeting page under the 'Materials' tab.",
    email_alerts: "Configure your email alerts under Profile > Notifications > Email Settings.",
    notification_prefs: "Set which events trigger notifications in your Profile > Notifications > Preferences.",
    calendar_integration: "Calendar integration with external calendars can be set up under Profile > Integrations > Calendar.",
    update_info: "Update your personal information under Profile > Personal Details.",
    change_password: "Change your password under Profile > Security > Password.",
    navigation: "The main navigation menu is on the left side of your screen, showing options based on your role. Your most frequent actions are also available as shortcuts on your dashboard.",
    account_issues: "For account-related issues like login problems or access restrictions, please contact your system administrator or use the 'Help & Support' option in the footer menu.",
    tutorials: "Feature tutorials are available under Help > Tutorials, where you can find step-by-step guides and videos for all major platform features.",
    
    // Add other value-specific responses here
    create_meeting: "To schedule a new meeting, click on the 'Meetings' tab in the sidebar, then click the 'New Meeting' button. Fill in the required details like title, date, time, and participants.",
    minutes: "Meeting minutes can be accessed from the meeting details page under the 'Minutes' tab. You can also download them as PDF or share them with other commission members.",
    user_roles: "SmartMeet has different roles including Administrator, Commission President, and Commission Member. Each role has different permissions and access levels within the system."
  };

  // Function to focus the input field
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // Focus input field when "Ask another question" is shown (last message)
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.type === "bot" && lastMsg?.options?.some(opt => opt.text === "Ask another question")) {
        focusInput();
      }
    }
  }, [messages]);
  // Get user info on component mount  
  useEffect(() => {
    // Get user info from localStorage
    try {
      const userString = localStorage.getItem("user");
      console.log("Checking localStorage for user:", userString);
      
      if (!userString) {
        console.log("No user found in localStorage, using default");
        setUserName("Guest User");
        setUserRole("default");
        setMessages([initialMessages.default[0]]);
        return;
      }
      
      const user = JSON.parse(userString);
      console.log("User loaded from localStorage:", user);
      
      if (user) {
        setUserName(user.name || "User");
        const userRole = user.role || "default";
        setUserRole(userRole);
        console.log("Setting user role to:", userRole);
        
        // Show welcome message with role-specific options
        if (userRole === "administrator" || userRole === "admin") {
          setMessages([initialMessages.admin[0]]);
        } else if (userRole === "commission_manager" || userRole === "commission_president") {
          setMessages([initialMessages.commission_president[0]]);
        } else if (userRole === "commission_member" || userRole === "member") {
          setMessages([initialMessages.member[0]]);
        } else {
          console.log("Using default welcome message for role:", userRole);
          setMessages([initialMessages.default[0]]);
        }
      } else {
        // For testing purposes, if no user is found
        setUserName("Guest User");
        setUserRole("default");
        setMessages([initialMessages.default[0]]);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      setUserName("Guest User");
      setUserRole("default");
      setMessages([initialMessages.default[0]]);
    }
    
    // Focus the input field after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleOptionClick = (option) => {
    if (!option || !option.value) return;
    
    // First add the user message so it appears immediately
    const userMessage = { type: "user", text: option.text };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Small delay to simulate thinking/processing
    setTimeout(() => {
      // Find response for the selected option
      const response = botResponses[option.value];
      let botResponse;
      
      // If there's a structured response with more options
      if (response && typeof response === "object") {
        botResponse = {
          type: "bot",
          text: response.text,
          options: response.options
        };
      }
      // If there's a final text response with no more options
      else if (response) {
        botResponse = {
          type: "bot",
          text: response,
          options: [
            { text: "Ask another question", value: "help" } // Allow user to continue conversation
          ]
        };
      }
      // Default fallback response
      else {
        botResponse = {
          type: "bot",
          text: "I'm still learning about that feature. Our team is working on providing more detailed information.",
          options: [
            { text: "Ask another question", value: "help" } // Allow user to continue conversation
          ]
        };
      }
      
      // Hide typing indicator and update the messages with the bot's response
      setIsTyping(false);
      setMessages(prevMessages => [...prevMessages, botResponse]);
      
      // Focus back on input for continuing conversation after selecting an option
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 800); // Slightly shorter delay for better responsiveness
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;
    
    // Clear the input field immediately
    setInputValue("");
    
    // Create a user message and add it to messages
    const userMessage = { type: "user", text: trimmedInput };
    
    // Update messages with the user message (use functional update to ensure we're working with latest state)
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Store the input for processing
    const userInput = trimmedInput;
    
    // Log for debugging
    console.log('Processing user input:', userInput);
    
    // Use setTimeout to give visual feedback that the bot is "thinking"
    setTimeout(() => {
      // Process the input to determine the appropriate response
      const lowerInput = userInput.toLowerCase();
      console.log('Processing lowercase input:', lowerInput);
      let botResponse;
      
      // Check for common keywords
      if (lowerInput.includes("meeting") || lowerInput.includes("schedule")) {
        botResponse = {
          type: "bot",
          text: "Looking for information about meetings?",
          options: [
            { text: "Schedule new meeting", value: "create_meeting" },
            { text: "View upcoming meetings", value: "meetings" },
            { text: "Meeting minutes", value: "minutes" }
          ]
        };
      } 
      else if (lowerInput.includes("user") || lowerInput.includes("permission")) {
        botResponse = {
          type: "bot",
          text: "Need help with user management?",
          options: [
            { text: "Add new users", value: "add_users" },
            { text: "Edit permissions", value: "edit_permissions" },
            { text: "User roles", value: "user_roles" }
          ]
        };
      }
      else if (lowerInput.includes("commission") || lowerInput.includes("committee")) {
        botResponse = {
          type: "bot",
          text: "Looking for information about commissions?",
          options: [
            { text: "Create new commission", value: "create_commission" },
            { text: "Manage members", value: "members" },
            { text: "Commission reports", value: "commission_reports" }
          ]
        };
      }
      else if (lowerInput.includes("profile") || lowerInput.includes("account") || lowerInput.includes("password")) {
        botResponse = {
          type: "bot",
          text: "Need help with your account settings?",
          options: [
            { text: "Update personal info", value: "update_info" },
            { text: "Change password", value: "change_password" },
            { text: "Notification settings", value: "notification_prefs" }
          ]
        };
      }
      else if (lowerInput.includes("help") || lowerInput.includes("guide") || lowerInput.includes("tutorial")) {
        botResponse = {
          type: "bot",
          text: "Looking for guidance?",
          options: [
            { text: "Navigation help", value: "navigation" },
            { text: "Account issues", value: "account_issues" },
            { text: "Feature tutorials", value: "tutorials" }
          ]
        };
      }
      // Report-related queries
      else if (lowerInput.includes("report") || lowerInput.includes("analytic") || lowerInput.includes("statistic")) {
        botResponse = {
          type: "bot",
          text: "Interested in reports and analytics?",
          options: [
            { text: "Commission activity reports", value: "commission_reports" },
            { text: "Meeting statistics", value: "meeting_stats" },
            { text: "User activity logs", value: "user_logs" }
          ]
        };
      }
      // Notification-related queries
      else if (lowerInput.includes("notif") || lowerInput.includes("alert") || lowerInput.includes("remind")) {
        botResponse = {
          type: "bot",
          text: "Want to know about notifications?",
          options: [
            { text: "Email alerts", value: "email_alerts" },
            { text: "Notification preferences", value: "notification_prefs" },
            { text: "Calendar integration", value: "calendar_integration" }
          ]
        };
      }      // Default response if no keyword matches
      else {
        console.log('No keyword match found, using default response');
        // Make sure we have a valid role or fallback to default
        const role = userRole && initialMessages[userRole] ? userRole : "default";
        console.log('Using role for options:', role);
        
        botResponse = {
          type: "bot",
          text: "I'm not sure I understand. Could you try one of these topics?",
          options: initialMessages[role][0].options || initialMessages.default[0].options
        };
      }
      
      // Hide typing indicator and add bot response
      setIsTyping(false);
      console.log('Adding bot response:', botResponse);
      
      // Update messages with the bot response (using functional update again)
      setMessages(prevMessages => [...prevMessages, botResponse]);
      
      // Focus back on input for easy continuous conversation
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 800); // Set a reasonable delay that feels responsive but gives time for typing indicator
  };

  return (
    <div className="chatbot-page-container">
      <div className="chatbot-header-section">
        <div className="d-flex align-items-center mb-3">
          <FaRobot className="chatbot-page-icon" />
          <h1>SmartMeet Assistant</h1>
        </div>
        <p className="mb-4">
          Your AI assistant for navigating SmartMeet. Ask any question about the platform features,
          how to perform specific tasks, or get help with your workflow.
        </p>
      </div>
      
      <div className="chatbot-main-container">
        <div className="chatbot-messages-section">
          <h2>Conversation</h2>
          <div className="chat-messages-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.type === "bot" ? "bot-message" : "user-message"}`}
              >
                <div className="message-icon">
                  {msg.type === "bot" ? 
                    <FaRobot /> : 
                    <div className="user-avatar">{userName.charAt(0)}</div>
                  }
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">
                      {msg.type === "bot" ? "SmartMeet Assistant" : userName}
                    </span>
                  </div>
                  <div className="message-text">{msg.text}</div>
                  {msg.options && msg.type === "bot" && (
                    <div className="chat-options">
                      {msg.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          className="option-button"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="chat-message bot-message typing-indicator-container">
                <div className="message-icon">
                  <FaRobot />
                </div>
                <div className="message-content typing-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="chat-input-container">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your question here..."
              value={inputValue}
              onChange={handleInputChange}
              aria-label="Message"
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!inputValue.trim()}
              title="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAI;
