import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaTrash, FaCheck, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AdminContactsPage.css';

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return token;
  };

  const fetchContacts = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const markAsRead = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/contacts/${id}/mark-as-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, read: true } : contact
      ));
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    const token = getToken();
    if (!token) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(contacts.filter(contact => contact.id !== id));
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <FaSpinner className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="admin-contacts-page py-5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="row"
        >
          <div className="col-12">
            <h2 className="mb-4 display-6 fw-bold text-primary">Contact Messages</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="card shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th scope="col" className="px-4 py-3">Name</th>
                        <th scope="col" className="px-4 py-3">Email</th>
                        <th scope="col" className="px-4 py-3">Subject</th>
                        <th scope="col" className="px-4 py-3">Message</th>
                        <th scope="col" className="px-4 py-3">Date</th>
                        <th scope="col" className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <motion.tr 
                          key={contact.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={!contact.read ? 'bg-light' : ''}
                        >
                          <td className="px-4 py-3">{contact.name}</td>
                          <td className="px-4 py-3">
                            <a href={`mailto:${contact.email}`} className="text-decoration-none">
                              {contact.email}
                            </a>
                          </td>
                          <td className="px-4 py-3">{contact.subject}</td>
                          <td className="px-4 py-3">
                            <div style={{ maxWidth: '300px' }} className="text-truncate">
                              {contact.message}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="d-flex gap-2">
                              {!contact.read && (
                                <button
                                  onClick={() => markAsRead(contact.id)}
                                  className="btn btn-sm btn-outline-success"
                                  title="Mark as read"
                                >
                                  <FaCheck />
                                </button>
                              )}
                              <button
                                onClick={() => deleteContact(contact.id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete message"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                      
                      {contacts.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <FaEnvelope className="text-muted me-2" />
                            No messages found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminContactsPage;
