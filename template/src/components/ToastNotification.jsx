// src/components/ToastNotification.jsx


import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ToastNotification({ message, type = 'info' }) {
  useEffect(() => {
    if (message) {
      toast(message, {
        type: type,
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  }, [message, type]);

  return null;
}

export default ToastNotification;
