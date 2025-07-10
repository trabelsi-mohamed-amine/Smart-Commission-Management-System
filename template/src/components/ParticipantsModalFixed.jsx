import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';

const ParticipantsModal = ({ show, handleClose, meetingId, meetingTitle }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // Filter for available users

  // Define callback functions first before using them in useEffect
  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://127.0.0.1:8000/api/meetings/${meetingId}/participants`, config);
      
      setParticipants(response.data.participants || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError('Failed to load participants');
      setLoading(false);
    }
  }, [meetingId]);

  const fetchAvailableUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setError('Authentication token required');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log('Fetching available participants with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('http://127.0.0.1:8000/api/meetings/available-participants', config);
      console.log('Available users response:', response.data);
      
      // Filter out users who are already participants
      const filteredUsers = response.data.filter(user => 
        !participants.some(participant => participant.id === user.id)
      );
      
      console.log('Filtered available users:', filteredUsers.length);
      setAvailableUsers(filteredUsers);
    } catch (err) {
      console.error('Error fetching available users:', err);
      // Display the error in the UI instead of silently failing
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error data:', err.response.data);
        console.error('Response error status:', err.response.status);
        setError(`Failed to load available users: ${err.response.status} ${err.response.data.message || ''}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response received when fetching available users. Server might be down.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error setting up request: ${err.message}`);
      }
    }
  }, [participants]);
  
  // User info effect
  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
  }, []);
  
  // Main effect for fetching data
  useEffect(() => {
    if (show && meetingId) {
      fetchParticipants();
      fetchAvailableUsers();
    }
    // Clear success message when modal is closed
    if (!show) {
      setSuccessMessage('');
    }
  }, [show, meetingId, fetchParticipants, fetchAvailableUsers]);

  const handleAddParticipant = async () => {
    try {
      if (!selectedUser) return;

      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(
        `http://127.0.0.1:8000/api/meetings/${meetingId}/participants`, 
        { user_id: selectedUser },
        config
      );

      setSuccessMessage('Participant ajouté avec succès');
      setSelectedUser('');
      fetchParticipants();
      fetchAvailableUsers();
    } catch (err) {
      console.error('Error adding participant:', err);
      setError('Failed to add participant');
    }
  };

  const handleRemoveParticipant = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(
        `http://127.0.0.1:8000/api/meetings/${meetingId}/participants/${userId}`,
        config
      );

      setSuccessMessage('Participant retiré avec succès');
      fetchParticipants();
      fetchAvailableUsers();
    } catch (err) {
      console.error('Error removing participant:', err);
      setError('Failed to remove participant');
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Participants - {meetingTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            {successMessage && (
              <Alert variant="success" className="mb-3" onClose={() => setSuccessMessage('')} dismissible>
                {successMessage}
              </Alert>
            )}
              {(['administrator', 'commission_manager'].includes(userRole)) && (
              <div className="mb-4">            
                <h6 className="d-flex align-items-center gap-2">
                  <i className="fas fa-plus-circle text-success"></i> 
                  Ajouter un participant
                </h6>
                <div className="alert alert-light border mb-3">
                  <small>
                    <i className="fas fa-info-circle text-info me-1"></i>
                    Vous pouvez ajouter des administrateurs, des gestionnaires de commission et des membres de commission en tant que participants à cette réunion.
                  </small>
                </div>
                <div className="mb-2">
                  <Form.Label>Filtrer par rôle:</Form.Label>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Check
                      type="radio"
                      label="Tous"
                      name="roleFilter"
                      id="role-all"
                      checked={roleFilter === 'all'}
                      onChange={() => setRoleFilter('all')}
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Administrateurs"
                      name="roleFilter"
                      id="role-admin"
                      checked={roleFilter === 'administrator'}
                      onChange={() => setRoleFilter('administrator')}
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Managers"
                      name="roleFilter"
                      id="role-manager"
                      checked={roleFilter === 'commission_manager'}
                      onChange={() => setRoleFilter('commission_manager')}
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Membres"
                      name="roleFilter"
                      id="role-member"
                      checked={roleFilter === 'commission_member'}
                      onChange={() => setRoleFilter('commission_member')}
                      inline
                    />
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  <Form.Select 
                    value={selectedUser} 
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="flex-grow-1"
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    {availableUsers
                      .filter(user => roleFilter === 'all' || user.role === roleFilter)
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role === 'administrator' ? 'Admin' : 
                                        user.role === 'commission_manager' ? 'Manager' : 'Membre'})
                        </option>
                      ))}
                  </Form.Select>
                  <Button 
                    variant="primary"
                    onClick={handleAddParticipant}
                    disabled={!selectedUser}
                  >
                    <FaUserPlus className="me-1" /> Ajouter
                  </Button>
                </div>
              </div>
            )}            <div className="participants-list mt-4">
              <h5 className="border-bottom pb-2 mb-3">Liste des participants</h5>
              {participants.length === 0 ? (
                <div className="alert alert-info">Aucun participant pour cette réunion.</div>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      {(['administrator', 'commission_manager'].includes(userRole)) && (
                        <th>Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant.id}>
                        <td>{participant.name}</td>
                        <td>{participant.email}</td>
                        <td>
                          <span className={`badge bg-${participant.role === 'administrator' ? 'danger' : 
                                                participant.role === 'commission_manager' ? 'warning' : 'success'}`}>
                            {participant.role === 'administrator' ? 'Admin' : 
                              participant.role === 'commission_manager' ? 'Manager' : 'Membre'}
                          </span>
                        </td>
                        {(['administrator', 'commission_manager'].includes(userRole)) && (
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveParticipant(participant.id)}
                            >
                              <FaUserMinus />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
            {!loading && !error && participants.length > 0 && (
              <small className="text-muted">Nombre total de participants: {participants.length}</small>
            )}
          </div>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ParticipantsModal;
