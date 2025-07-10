// src/components/Notification.jsx
import React from 'react';

const Notification = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`p-4 rounded-md shadow-md text-white mb-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {message}
    </div>
  );
};

export default Notification;
