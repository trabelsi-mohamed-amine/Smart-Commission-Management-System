import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';
import './NavbarChatbot.css';
import './modal-transitions.css';

const NavbarChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isToggling, setIsToggling] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial chatbot messages based on user role
  const initialMessages = {
    admin: [
      {
        type: 'bot',
        text: 'Welcome to SmartMeet admin dashboard! How can I help you today?',
        options: [
          { text: 'Manage users', value: 'users' },
          { text: 'Commission settings', value: 'commissions' },
          { text: 'Reports overview', value: 'reports' },
          { text: 'System settings', value: 'settings' }
        ]
      }
    ],
    commission_president: [
      {
        type: 'bot',
        text: 'Welcome to your commission president dashboard! How can I help you today?',
        options: [
          { text: 'Schedule meetings', value: 'schedule' },
          { text: 'Manage commission members', value: 'members' },
          { text: 'Review reports', value: 'reports' },
          { text: 'Commission settings', value: 'settings' }
        ]
      }
    ],
    member: [
      {
        type: 'bot',
        text: 'Welcome to your member dashboard! What would you like to do?',
        options: [
          { text: 'View upcoming meetings', value: 'meetings' },
          { text: 'Check notifications', value: 'notifications' },
          { text: 'Access reports', value: 'reports' },
          { text: 'Update profile', value: 'profile' }
        ]
      }
    ],
    secretary: [
      {
        type: 'bot',
        text: 'Welcome to your secretary dashboard! How can I assist you?',
        options: [
          { text: 'Add meeting minutes', value: 'minutes' },
          { text: 'Prepare agenda', value: 'agenda' },
          { text: 'Manage documents', value: 'documents' },
          { text: 'Member coordination', value: 'coordination' }
        ]
      }
    ],
    default: [
      {
        type: 'bot',
        text: 'Welcome to SmartMeet! How can I help you navigate the dashboard?',
        options: [
          { text: 'Dashboard overview', value: 'overview' },
          { text: 'Notifications help', value: 'notifications' },
          { text: 'Profile settings', value: 'profile' },
          { text: 'General help', value: 'help' }
        ]
      }
    ]
  };

  // Responses for different user selections
  const botResponses = {
    // Admin responses
    users: {
      text: 'In the User Management section, you can:',
      options: [
        { text: 'Add new users', value: 'add_users' },
        { text: 'Edit user permissions', value: 'edit_permissions' },
        { text: 'Deactivate accounts', value: 'deactivate_accounts' }
      ]
    },
    commissions: {
      text: 'For Commission settings, you can:',
      options: [
        { text: 'Create new commissions', value: 'create_commission' },
        { text: 'Assign members', value: 'assign_members' },
        { text: 'Configure commission rules', value: 'configure_rules' }
      ]
    },
    reports: {
      text: 'In the Reports section, you can:',
      options: [
        { text: 'Generate commission reports', value: 'generate_reports' },
        { text: 'View meeting statistics', value: 'meeting_stats' },
        { text: 'Export data', value: 'export_data' }
      ]
    },
    settings: {
      text: 'System settings allow you to:',
      options: [
        { text: 'Configure notification preferences', value: 'notifications_settings' },
        { text: 'Customize dashboard appearance', value: 'customize_appearance' },
        { text: 'Manage system backups', value: 'backup_settings' }
      ]
    },
    
    // Commission president responses
    schedule: {
      text: 'To schedule meetings:',
      options: [
        { text: 'Create new meeting', value: 'create_meeting' },
        { text: 'Edit existing meetings', value: 'edit_meeting' },
        { text: 'Set up recurring meetings', value: 'recurring_meeting' }
      ]
    },
    members: {
      text: 'For managing commission members:',
      options: [
        { text: 'View current members', value: 'view_members' },
        { text: 'Assign roles', value: 'assign_roles' },
        { text: 'Invite new members', value: 'invite_members' }
      ]
    },
    
    // Member responses
    meetings: {
      text: 'For upcoming meetings:',
      options: [
        { text: 'View meeting calendar', value: 'calendar' },
        { text: 'RSVP to meetings', value: 'rsvp' },
        { text: 'Access meeting materials', value: 'materials' }
      ]
    },
    notifications: {
      text: 'For notifications:',
      options: [
        { text: 'Configure email alerts', value: 'email_alerts' },
        { text: 'Manage notification types', value: 'notification_types' },
        { text: 'Set notification frequency', value: 'notification_frequency' }
      ]
    },
    
    // Secretary responses
    minutes: {
      text: 'To add meeting minutes:',
      options: [
        { text: 'Create new minutes', value: 'create_minutes' },
        { text: 'Use minutes templates', value: 'minutes_templates' },
        { text: 'Distribute minutes', value: 'distribute_minutes' }
      ]
    },
    agenda: {
      text: 'For preparing agendas:',
      options: [
        { text: 'Create new agenda', value: 'create_agenda' },
        { text: 'Use agenda templates', value: 'agenda_templates' },
        { text: 'Share agenda with members', value: 'share_agenda' }
      ]
    },
    
    // General responses
    overview: {
      text: 'The dashboard overview shows:',
      options: [
        { text: 'Meeting summaries', value: 'meeting_summaries' },
        { text: 'Recent activities', value: 'recent_activities' },
        { text: 'Important statistics', value: 'statistics' }
      ]
    },
    profile: {
      text: 'In your profile settings, you can:',
      options: [
        { text: 'Update personal information', value: 'update_info' },
        { text: 'Change password', value: 'change_password' },
        { text: 'Set notification preferences', value: 'notification_prefs' }
      ]
    },
    help: {
      text: 'For general help:',
      options: [
        { text: 'View user guide', value: 'user_guide' },
        { text: 'Contact support', value: 'contact_support' },
        { text: 'Watch tutorial videos', value: 'tutorials' }
      ]
    }
  };

  // Final level responses (no more options)
  const finalResponses = {
    // User management final responses
    add_users: 'To add new users, go to Users > Add User and fill out the required information. New users will receive an email invitation to set up their account.',
    edit_permissions: 'To edit user permissions, select a user from the Users list, click "Edit" and adjust their role and permission settings as needed.',
    deactivate_accounts: 'To deactivate accounts, find the user in the Users list, click the options menu (three dots) and select "Deactivate Account".',
    
    // Commission settings final responses
    create_commission: 'To create a new commission, navigate to Commissions > Add New and provide the commission details, including name, purpose, and initial members.',
    assign_members: 'To assign members to commissions, go to Commissions > Select a commission > Members tab > Add Members.',
    configure_rules: 'Commission rules can be configured under Commissions > Select a commission > Settings > Rules & Procedures.',
    
    // Common final responses
    create_meeting: 'To create a meeting, go to Meetings > Schedule New Meeting. Fill out the date, time, location, and agenda items.',
    calendar: 'Your meeting calendar is available on the dashboard homepage or under the Meetings > Calendar section.',
    user_guide: 'The complete user guide is available under Help > User Documentation. You can also download a PDF version for offline reference.',
    
    // Default response for any unmatched option
    default: "I don't have specific information about that option yet. You can contact our support team for more assistance."
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Get user info on component mount
  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name || 'User');
      setUserRole(user.role || 'default');
    }
  }, []);  // Initialize chat when opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // First show welcome message
      setMessages([{ 
        type: 'bot', 
        text: `Hello ${userName}! I'm your SmartMeet assistant.` 
      }]);
      
      // After a short delay, show role-specific options
      setTimeout(() => {
        const role = userRole || 'default';
        const initialMessageSet = initialMessages[role] || initialMessages.default;
        setMessages(prev => [...prev, ...initialMessageSet]);
      }, 800);
    }
  }, [isOpen, userRole, userName, messages.length, initialMessages]);

  const toggleChat = () => {
    if (!isToggling) {
      setIsToggling(true);
      setIsOpen(!isOpen);
      
      // Allow toggle again after a short delay
      setTimeout(() => {
        setIsToggling(false);
      }, 300);
    }
  };

  const handleOptionClick = (option) => {
    // Add user message
    const newMessages = [...messages, { type: 'user', text: option.text }];
    
    // Find response for the selected option
    const response = botResponses[option.value];
    const finalResponse = finalResponses[option.value];
    
    // If there's a structured response with more options
    if (response) {
      newMessages.push({
        type: 'bot',
        text: response.text,
        options: response.options
      });
    }
    // If there's a final text response with no more options
    else if (finalResponse) {
      newMessages.push({
        type: 'bot',
        text: finalResponse,
        // Add generic options to continue the conversation
        options: [
          { text: 'Back to main menu', value: 'main_menu' },
          { text: 'Thank you!', value: 'thanks' }
        ]
      });
    }
    // Fallback response
    else {
      newMessages.push({
        type: 'bot',
        text: finalResponses.default,
        options: [{ text: 'Back to main menu', value: 'main_menu' }]
      });
    }
    
    setMessages(newMessages);
    
    // Handle special cases
    if (option.value === 'main_menu') {
      // Reset to initial messages for user's role
      setTimeout(() => {
        const role = userRole || 'default';
        setMessages(initialMessages[role] || initialMessages.default);
      }, 500);
    } else if (option.value === 'thanks') {
      // Add a thank you response
      setTimeout(() => {
        setMessages([...newMessages, {
          type: 'bot',
          text: "You're welcome! Is there anything else I can help you with?",
          options: [{ text: 'Back to main menu', value: 'main_menu' }]
        }]);
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { type: 'user', text: inputValue }];
    
    // Add bot response based on input
    // This is a simple keyword matching system - you can expand this as needed
    const lowerInput = inputValue.toLowerCase();
    let responseAdded = false;
    
    // Check for common keywords and add appropriate response
    if (lowerInput.includes('meeting') || lowerInput.includes('schedule')) {
      newMessages.push({
        type: 'bot',
        text: 'Looking for information about meetings?',
        options: [
          { text: 'Schedule new meeting', value: 'create_meeting' },
          { text: 'View upcoming meetings', value: 'meetings' },
          { text: 'Meeting minutes', value: 'minutes' }
        ]
      });
      responseAdded = true;
    } else if (lowerInput.includes('profile') || lowerInput.includes('account')) {
      newMessages.push({
        type: 'bot',
        text: 'Need help with your profile?',
        options: [
          { text: 'Update profile info', value: 'update_info' },
          { text: 'Change password', value: 'change_password' },
          { text: 'Notification settings', value: 'notification_prefs' }
        ]
      });
      responseAdded = true;
    } else if (lowerInput.includes('help') || lowerInput.includes('guide')) {
      newMessages.push({
        type: 'bot',
        text: 'How can I help you?',
        options: botResponses.help.options
      });
      responseAdded = true;
    }
    
    // Default response if no keyword matches
    if (!responseAdded) {
      newMessages.push({
        type: 'bot',
        text: "I'm not sure I understand. Could you try one of these topics?",
        options: initialMessages[userRole || 'default'][0].options
      });
    }
    
    setMessages(newMessages);
    setInputValue('');
  };  return (
    <>
      <div className="chatbot-icon" onClick={toggleChat}>
        <FaRobot size={24} />
      </div>
      
      <div className={`chatbot-container fade-in ${isOpen ? 'visible' : ''}`}>
        <div className="chatbot-header">
          <h5>SmartMeet Assistant</h5>
          <button className="close-btn" onClick={toggleChat}>
            <FaTimes />
          </button>
        </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.type === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                {msg.text}
                
                {msg.options && msg.type === 'bot' && (
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
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="chatbot-input">
            <input
              type="text"
              placeholder="Type your question here..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit" className="send-btn">
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default NavbarChatbot;
