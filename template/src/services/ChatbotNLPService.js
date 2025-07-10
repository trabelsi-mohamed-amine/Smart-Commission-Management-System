/**
 * Advanced NLP service for the SmartMeet Chatbot
 * 
 * This service provides more sophisticated message recognition 
 * and response generation for the SmartMeet AI Assistant.
 */

// Keywords and patterns for different categories
const keywordPatterns = {
  greeting: [
    'hello', 'hi', 'hey', 'greetings', 'good morning', 
    'good afternoon', 'good evening', 'howdy', 'welcome'
  ],
  farewell: [
    'bye', 'goodbye', 'see you', 'talk to you later', 'farewell',
    'have a good day', 'until next time'
  ],
  gratitude: [
    'thanks', 'thank you', 'appreciate it', 'grateful', 
    'thank you very much', 'thanks a lot'
  ],
  meeting: [
    'meeting', 'schedule', 'calendar', 'appointment', 'conference',
    'video call', 'session', 'gathering', 'assemble', 'convene'
  ],
  commission: [
    'commission', 'committee', 'group', 'team', 'department', 
    'division', 'unit', 'taskforce'
  ],
  user: [
    'user', 'account', 'profile', 'member', 'person', 'individual',
    'login', 'password', 'credentials', 'authentication'
  ],
  document: [
    'document', 'file', 'paper', 'report', 'minutes', 'transcript',
    'record', 'pdf', 'word', 'excel', 'upload', 'download'
  ],
  settings: [
    'setting', 'configuration', 'preference', 'option', 'customize',
    'personalize', 'adjust', 'modify', 'change', 'update'
  ],
  help: [
    'help', 'assist', 'support', 'guide', 'explain', 'tutorial', 'how to',
    'instruction', 'direction', 'advice', 'tip', 'hint', 'suggestion'
  ]
};

// Intent classification based on keywords
const classifyIntent = (text) => {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const matches = {};
  
  // Count matches for each category
  Object.keys(keywordPatterns).forEach(category => {
    matches[category] = 0;
    keywordPatterns[category].forEach(keyword => {
      if (lowerText.includes(keyword)) {
        matches[category]++;
      }
    });
  });
  
  // Find category with most matches
  let topCategory = null;
  let topScore = 0;
  
  Object.keys(matches).forEach(category => {
    if (matches[category] > topScore) {
      topScore = matches[category];
      topCategory = category;
    }
  });
  
  // If no strong match, check for question pattern
  if (topScore === 0) {
    const questionWords = ['what', 'how', 'where', 'when', 'why', 'who', 'can', 'could', 'should', 'would'];
    const isQuestion = questionWords.some(word => words.includes(word)) || lowerText.includes('?');
    if (isQuestion) {
      return 'question';
    }
    return 'unknown';
  }
  
  return topCategory;
};

// Entity extraction from text
const extractEntities = (text) => {
  const lowerText = text.toLowerCase();
  const entities = {
    dates: [],
    times: [],
    names: [],
    numbers: []
  };
  
  // Simple date detection (this is a basic implementation)
  const datePatterns = [
    /\d{1,2}\/\d{1,2}\/\d{2,4}/g,               // MM/DD/YYYY or DD/MM/YYYY
    /\d{1,2}-\d{1,2}-\d{2,4}/g,                 // MM-DD-YYYY or DD-MM-YYYY
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)?(,?\s+\d{4})?/gi, // Month Day, Year
    /\d{1,2}(st|nd|rd|th)?\s+(of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)(,?\s+\d{4})?/gi, // Day of Month, Year
    /(next|this|last)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, // Relative days
    /(tomorrow|today|yesterday)/gi              // Relative days
  ];
  
  // Simple time detection
  const timePatterns = [
    /\d{1,2}:\d{2}\s*([ap]m)?/gi,              // HH:MM (am/pm)
    /\d{1,2}\s*([ap]m)/gi,                     // HH am/pm
    /(noon|midnight)/gi                         // Specific times
  ];
  
  // Extract dates
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      entities.dates.push(...matches);
    }
  });
  
  // Extract times
  timePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      entities.times.push(...matches);
    }
  });
  
  // Extract numbers
  const numberMatches = text.match(/\d+/g);
  if (numberMatches) {
    entities.numbers = numberMatches;
  }
  
  return entities;
};

// Generate context-aware responses based on intent and entities
export const processMessage = (message, userRole = 'user', userName = 'User') => {
  const intent = classifyIntent(message);
  const entities = extractEntities(message);
  
  const baseResponses = {
    greeting: [
      `Hello ${userName}! How can I assist you with SmartMeet today?`,
      `Hi there, ${userName}! What would you like to know about SmartMeet?`,
      `Welcome to the SmartMeet Assistant! I'm here to help you navigate the platform.`
    ],
    farewell: [
      `Goodbye, ${userName}! Feel free to come back if you need more assistance.`,
      `Have a great day, ${userName}! I'm here if you need anything else.`,
      `See you later! Don't hesitate to ask if you have more questions.`
    ],
    gratitude: [
      `You're welcome! Is there anything else I can help you with?`,
      `Happy to help! Let me know if you need assistance with anything else.`,
      `No problem at all. That's what I'm here for!`
    ],
    unknown: [
      `I'm not sure I understood that. Could you rephrase your question?`,
      `I didn't quite catch that. Can you try asking in a different way?`,
      `I'm still learning and didn't understand your request. Could you be more specific?`
    ]
  };
  
  // Role-specific responses for different intents
  const roleResponses = {
    meeting: {
      administrator: [
        `As an administrator, you can manage all meetings across commissions. Would you like to know how to schedule a new meeting, view upcoming meetings, or manage existing ones?`,
        `With your admin access, you can oversee all meeting activities. You can create new meetings, edit existing ones, or view analytics on meeting patterns.`
      ],
      commission_manager: [
        `As a commission president, you can schedule and manage meetings for your commission. Would you like to create a new meeting or manage your upcoming meetings?`,
        `You can set up meetings, create agendas, and invite participants from your commission. Would you like to know how to do any of these tasks?`
      ],
      commission_member: [
        `As a commission member, you can view your upcoming meetings and access meeting materials. Would you like to see your scheduled meetings or learn how to participate in them?`,
        `You can join scheduled meetings, view related documents, and contribute to meeting discussions. Would you like to know how to do any of these?`
      ]
    },
    commission: {
      administrator: [
        `As an administrator, you have full control over commissions. You can create, edit, delete commissions, and manage their members.`,
        `You can oversee all commissions, add or remove members, and adjust commission settings as needed.`
      ],
      commission_manager: [
        `As a commission president, you can manage your commission's members, settings, and activities.`,
        `You have authority over your commission, including member management and commission configuration.`
      ],
      commission_member: [
        `As a commission member, you can view commission details, see other members, and participate in commission activities.`,
        `You're part of the commission team and can access shared resources and participate in meetings.`
      ]
    }
  };
  
  // Select appropriate response based on intent and user role
  if (intent in baseResponses) {
    // For basic intents like greetings, farewells, etc.
    const responses = baseResponses[intent];
    return responses[Math.floor(Math.random() * responses.length)];
  } else if (intent in roleResponses && userRole in roleResponses[intent]) {
    // For role-specific responses
    const responses = roleResponses[intent][userRole];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Default response with extracted entities if available
  if (entities.dates.length > 0 || entities.times.length > 0) {
    return `I noticed you mentioned ${entities.dates.join(', ')} ${entities.times.join(', ')}. How can I help you with this date/time?`;
  }
  
  // Generic fallback response
  return baseResponses.unknown[Math.floor(Math.random() * baseResponses.unknown.length)];
};

// Custom question analyzer
export const analyzeQuestion = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  // Common question structures
  const howToPattern = /how (do|can|to|would) .* (create|make|schedule|set up|configure|use|access|find|get|view|see|join|participate|manage)/i;
  const whereIsPattern = /where (is|are|can i find|to find|to see)/i;
  const whatIsPattern = /what (is|are|does)/i;
  
  if (howToPattern.test(question)) {
    return 'how_to';
  } else if (whereIsPattern.test(question)) {
    return 'location';
  } else if (whatIsPattern.test(question)) {
    return 'definition';
  }
  
  return 'general';
};

// Knowledge base search function
export const searchKnowledgeBase = (query, userRole) => {
  // This would connect to a real knowledge base in a production environment
  // For now, we'll return mock responses based on query patterns
  const knowledge = {
    how_to: {
      meeting_schedule: {
        administrator: "To schedule a meeting as an administrator, go to the Meetings section, click '+ New Meeting', fill in the meeting details including title, date, time, and select the commission. You can also add agenda items and attach documents.",
        commission_manager: "To schedule a meeting as a commission president, navigate to your commission page, select 'Meetings' tab, and click 'Schedule New Meeting'. Fill in all required information and send invitations to members.",
        commission_member: "As a commission member, you can't directly schedule commission meetings. Please contact your commission president if you need to propose a meeting."
      },
      document_upload: {
        all: "To upload documents, go to the relevant meeting or commission page, find the 'Documents' section, and click the 'Upload' button. You can drag and drop files or browse to select them."
      },
      password_change: {
        all: "To change your password, click your profile picture in the top-right corner, select 'Account Settings', then go to the 'Security' tab where you can update your password."
      }
    },
    location: {
      meeting_minutes: {
        all: "Meeting minutes can be found in the 'Transcripts' section. You can filter by commission or date to find specific meeting records."
      },
      notification_settings: {
        all: "Notification settings are in your profile menu. Click your profile picture, select 'Account Settings', then go to the 'Notifications' tab."
      }
    },
    definition: {
      commission: {
        all: "A commission is a formal group created to oversee specific areas or projects. Each commission has a president and members with specific roles and responsibilities."
      },
      meeting_types: {
        all: "SmartMeet supports several meeting types: Regular (scheduled recurring meetings), Special (one-time meetings for specific topics), Emergency (urgent issues requiring immediate attention), and Working Sessions (informal collaborative meetings)."
      }
    }
  };
  
  // Identify relevant knowledge entries based on query
  const questionType = analyzeQuestion(query);
  
  if (query.includes('schedule') && query.includes('meeting')) {
    return knowledge.how_to.meeting_schedule[userRole] || knowledge.how_to.meeting_schedule.all || "I don't have specific information about scheduling meetings for your role.";
  } 
  else if ((query.includes('upload') || query.includes('add')) && query.includes('document')) {
    return knowledge.how_to.document_upload.all;
  }
  else if (query.includes('password') && (query.includes('change') || query.includes('update'))) {
    return knowledge.how_to.password_change.all;
  }
  else if (query.includes('minutes') || (query.includes('meeting') && query.includes('notes'))) {
    return knowledge.location.meeting_minutes.all;
  }
  else if (query.includes('notification') && query.includes('settings')) {
    return knowledge.location.notification_settings.all;
  }
  else if (query.includes('what') && query.includes('commission')) {
    return knowledge.definition.commission.all;
  }
  else if (query.includes('type') && query.includes('meeting')) {
    return knowledge.definition.meeting_types.all;
  }
  
  // Default response if no match
  return null;
};

export default {
  processMessage,
  analyzeQuestion,
  searchKnowledgeBase
};
