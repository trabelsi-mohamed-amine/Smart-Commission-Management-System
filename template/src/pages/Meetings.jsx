import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MeetingParticipation from '../components/MeetingParticipation';
import ParticipantsModal from '../components/ParticipantsModal';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarPlus, FaSearch, FaUsers } from 'react-icons/fa';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    commission_id: '',
    date: '',
    time: ''
  });
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState('');  
  const [isLoading, setIsLoading] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
  }, []);
  
  // Separate useEffect for fetching data after userRole is set
  useEffect(() => {
    if (userRole) {
      // Initial data fetch
      fetchMeetings();
      fetchCommissions();
      
      // Set up periodic refresh to ensure data stays updated
      const refreshInterval = setInterval(() => {
        console.log('Auto-refreshing meeting data...');
        fetchMeetings();
      }, 30000); // Refresh every 30 seconds
      
      // Clean up interval on component unmount
      return () => clearInterval(refreshInterval);
    }
  }, [userRole]);
  
  // Enhanced function to fetch meetings with better error handling
  function fetchMeetings() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found - user may not be logged in');
      return;
    }
    
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Show loading state
    setIsLoading(true);
    
    console.log('Fetching meetings with auth token...');
    
    axios.get('http://127.0.0.1:8000/api/meetings', config)
      .then(response => {
        // Data now includes participation status and counts
        console.log('Meetings fetched successfully:', response.data);
        
        // Check if response contains the expected data
        if (Array.isArray(response.data)) {
          console.log('-------- Current Meeting Status --------');
          // Process each meeting for debugging
          response.data.forEach(meeting => {
            console.log(`Meeting ${meeting.id}: ${meeting.title}`);
            console.log(`- Participant count: ${meeting.participant_count}`);
            console.log(`- User status: ${meeting.current_user_status}`);
          });
          console.log('--------------------------------------');
          
          // Add cache busting timestamp to force React to re-render with new data
          const meetingsWithTimestamp = response.data.map(meeting => ({
            ...meeting,
            _timestamp: new Date().getTime() // Force React to see this as new data
          }));
          
          setMeetings(meetingsWithTimestamp);
        } else {
          console.error('Invalid response format:', response.data);
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des réunions :', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const fetchCommissions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/commissions');
      setCommissions(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commissions :', error);
    }
  };

  const handleInputChange = (e) => {
    setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdateMeeting = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingMeeting) {
        response = await axios.put(`http://127.0.0.1:8000/api/meetings/${editingMeeting.id}`, newMeeting);
        setMeetings(meetings.map(m => m.id === response.data.id ? response.data : m));
      } else {
        response = await axios.post('http://127.0.0.1:8000/api/meetings', newMeeting);
        setMeetings([...meetings, response.data]);
      }

      setNewMeeting({
        title: '',
        description: '',
        commission_id: '',
        date: '',
        time: ''
      });
      setEditingMeeting(null);
      setShowForm(false);
      showNotification(editingMeeting ? 'Réunion mise à jour avec succès' : 'Nouvelle réunion créée avec succès', 'success');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      handleAxiosError(error, "Erreur lors de l'enregistrement de la réunion");
    }
  };

  const handleEditMeeting = (meeting) => {
    setNewMeeting({
      title: meeting.title,
      description: meeting.description || '',
      commission_id: meeting.commission_id,
      date: meeting.date,
      time: meeting.time
    });
    setEditingMeeting(meeting);
    setShowForm(true);
  };
  
  const handleDeleteMeeting = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette réunion ?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/meetings/${id}`);
      setMeetings(meetings.filter(m => m.id !== id));
      showNotification('Réunion supprimée avec succès', 'success');
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      handleAxiosError(error, "Erreur lors de la suppression de la réunion");
    }
  };
  
  // Helper function for handling Axios errors
  const handleAxiosError = (error, defaultMessage) => {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      
      // Show specific error message if available
      const backendMessage = error.response.data?.message || error.response.data?.error;
      if (backendMessage) {
        showNotification(`Erreur: ${backendMessage}`, 'error');
        return;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request - No response received:', error.request);
      showNotification('Erreur de connexion au serveur. Veuillez vérifier votre connexion réseau.', 'error');
      return;
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    
    // Default error message if nothing specific was caught
    showNotification(defaultMessage + '. Veuillez réessayer.', 'error');
  };
  
  // New function to handle joining a meeting
  const handleJoinMeeting = async (meetingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found - user not logged in');
        showNotification('Vous devez être connecté pour rejoindre une réunion', 'error');
        return;
      }
      
      console.log(`Attempting to join meeting ${meetingId}`);
      
      // Set up headers with token
      const config = { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
      
      // Get CSRF token if your app uses it
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Add CSRF token to headers if it exists
      if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
      }
      
      // Make API call - using the endpoint for adding participant with current user
      const response = await axios.post(
        `http://127.0.0.1:8000/api/meetings/${meetingId}/join`,
        {}, // Empty body since the backend will use the authenticated user
        config
      );
      
      console.log('Join meeting response:', response.data);
      showNotification(response.data.message || 'Vous avez rejoint la réunion avec succès', 'success');
      
      // Update the meeting data to reflect the new participant status
      fetchMeetings();
    } catch (error) {
      console.error('Erreur lors de la participation à la réunion:', error);
      handleAxiosError(error, 'Erreur lors de la participation à la réunion');
    }
  };
  
  const handleLeaveMeeting = async (meetingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found - user not logged in');
        showNotification('Vous devez être connecté pour quitter une réunion', 'error');
        return;
      }
      
      console.log(`Attempting to leave meeting ${meetingId}`);
      // Set up headers with token
      const config = { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        // Removed withCredentials as it might cause CORS issues
      };
      
      // Get CSRF token if your app uses it
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Add CSRF token to headers if it exists
      if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
      }
      
      // Make API call
      const response = await axios.delete(`http://127.0.0.1:8000/api/meetings/${meetingId}/leave`, config);
      
      console.log('Leave meeting response:', response.data);
      showNotification(response.data.message || 'Vous avez quitté la réunion avec succès', 'success');
      
      // Update the meeting data to reflect the new participant status
      fetchMeetings();
    } catch (error) {
      console.error('Erreur lors du départ de la réunion:', error);
      handleAxiosError(error, 'Erreur lors du départ de la réunion');
    }
  };

  const showNotification = (message, type) => {
    const infoMsg = document.createElement('div');
    infoMsg.textContent = message;
    infoMsg.style.position = 'fixed';
    infoMsg.style.top = '20px';
    infoMsg.style.right = '20px';
    infoMsg.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    infoMsg.style.color = 'white';
    infoMsg.style.padding = '10px 20px';
    infoMsg.style.borderRadius = '4px';
    infoMsg.style.zIndex = '1050';
    document.body.appendChild(infoMsg);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
      if (document.body.contains(infoMsg)) {
        document.body.removeChild(infoMsg);
      }
    }, 3000);
  };
  
  const handleShowParticipants = (meeting) => {
    setSelectedMeeting(meeting);
    setShowParticipantsModal(true);
  };
  
  const handleCloseParticipantsModal = () => {
    setShowParticipantsModal(false);
  };

  // Filter meetings based on search term
  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (meeting.description && meeting.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    meeting.date.includes(searchTerm) ||
    meeting.time.includes(searchTerm) ||
    (commissions.find(c => c.id === meeting.commission_id)?.name || '')
      .toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper for button hover styles
  const getHoverStyles = (baseColor) => ({
    backgroundColor: 'white',
    color: baseColor,
    borderColor: baseColor,
    transition: 'all 0.3s'
  });

  // Helper for button hover events
  const handleButtonHover = (e, color) => {
    e.currentTarget.style.backgroundColor = color;
    e.currentTarget.style.color = 'white';
  };

  const handleButtonLeave = (e, color) => {
    e.currentTarget.style.backgroundColor = 'white';
    e.currentTarget.style.color = color;
  };

  return (
    <div className="py-4">
      <h2 className="mb-4">Gestion des Réunions</h2>
      <div className="d-flex justify-content-end mb-3">
        {userRole !== 'commission_member' && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingMeeting(null);
              setNewMeeting({
                title: '',
                description: '',
                commission_id: '',
                date: '',
                time: ''
              });
              setShowForm(!showForm);
            }}
            style={getHoverStyles('#0d6efd')}
            onMouseOver={(e) => handleButtonHover(e, '#0d6efd')}
            onMouseOut={(e) => handleButtonLeave(e, '#0d6efd')}
          >
            {showForm ? 'Fermer le formulaire' : <><FaPlus className="me-1" /> Ajouter une réunion</>}
          </button>
        )}
      </div>
      
      {showForm && userRole !== 'commission_member' && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              {editingMeeting ? 'Modifier la Réunion' : 'Nouvelle Réunion'}
            </h5>

            <form onSubmit={handleCreateOrUpdateMeeting}>
              <div className="mb-3">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={newMeeting.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={newMeeting.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Commission</label>
                <select
                  className="form-select"
                  name="commission_id"
                  value={newMeeting.commission_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Sélectionner une commission --</option>
                  {commissions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={newMeeting.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Heure</label>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={newMeeting.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-success me-2"
                style={getHoverStyles('#198754')}
                onMouseOver={(e) => handleButtonHover(e, '#198754')}
                onMouseOut={(e) => handleButtonLeave(e, '#198754')}
              >
                {editingMeeting ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingMeeting(null);
                  setShowForm(false);
                }}
                style={getHoverStyles('#6c757d')}
                onMouseOver={(e) => handleButtonHover(e, '#6c757d')}
                onMouseOut={(e) => handleButtonLeave(e, '#6c757d')}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher des réunions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Commission</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeetings.length > 0 ? (
                  filteredMeetings.map(meeting => (
                    <tr key={meeting.id}>
                      <td>{meeting.title}</td>
                      <td>{meeting.description || 'Aucune'}</td>
                      <td>{commissions.find(c => c.id === meeting.commission_id)?.name || 'Non attribuée'}</td>
                      <td>{meeting.date}</td>
                      <td>{meeting.time}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          {userRole !== 'commission_member' && (
                            <>
                              <button
                                className="btn btn-sm btn-warning me-1"
                                onClick={() => handleEditMeeting(meeting)}
                                style={getHoverStyles('#ffc107')}
                                onMouseOver={(e) => handleButtonHover(e, '#ffc107')}
                                onMouseOut={(e) => handleButtonLeave(e, '#ffc107')}
                              >
                                <FaEdit className="me-1" /> Modifier
                              </button>
                              <button
                                className="btn btn-sm btn-danger me-1"
                                onClick={() => handleDeleteMeeting(meeting.id)}
                                style={getHoverStyles('#dc3545')}
                                onMouseOver={(e) => handleButtonHover(e, '#dc3545')}
                                onMouseOut={(e) => handleButtonLeave(e, '#dc3545')}
                              >
                                <FaTrash className="me-1" /> Supprimer
                              </button>
                            </>
                          )}
                          {['commission_member', 'commission_manager', 'administrator'].includes(userRole) && (
                            <>
                              {meeting.current_user_status === 'joined' ? (
                                <button
                                  className="btn btn-sm me-1"
                                  onClick={() => handleLeaveMeeting(meeting.id)}
                                  title="Quitter la réunion"
                                  style={getHoverStyles('#dc3545')}
                                  onMouseOver={(e) => handleButtonHover(e, '#dc3545')}
                                  onMouseOut={(e) => handleButtonLeave(e, '#dc3545')}
                                >
                                  Quitter
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm me-1"
                                  onClick={() => handleJoinMeeting(meeting.id)}
                                  title="Rejoindre la réunion"
                                  style={getHoverStyles('#28a745')}
                                  onMouseOver={(e) => handleButtonHover(e, '#28a745')}
                                  onMouseOut={(e) => handleButtonLeave(e, '#28a745')}
                                >
                                  Rejoindre
                                </button>
                              )}
                            </>
                          )}
                          <button
                            className="btn btn-sm me-1 btn-info"
                            onClick={() => handleShowParticipants(meeting)}
                            title="Gérer les participants"
                            style={getHoverStyles('#17a2b8')}
                            onMouseOver={(e) => handleButtonHover(e, '#17a2b8')}
                            onMouseOut={(e) => handleButtonLeave(e, '#17a2b8')}
                          >
                            <FaUsers className="me-1" /> Participants {meeting.participant_count > 0 ? 
                              <span className="badge bg-info text-white ms-1">{meeting.participant_count}</span> : ''}
                          </button>
                          
                          <Link
                            to={`/dashboard/meeting-transcript/${meeting.id}`}
                            className="btn btn-sm btn-info"
                            style={getHoverStyles('#0dcaf0')}
                            onMouseOver={(e) => handleButtonHover(e, '#0dcaf0')}
                            onMouseOut={(e) => handleButtonLeave(e, '#0dcaf0')}
                          >
                            <FaEye className="me-1" /> Transcript
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      Aucune réunion trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      
      {selectedMeeting && (
        <ParticipantsModal 
          show={showParticipantsModal}
          handleClose={handleCloseParticipantsModal}
          meetingId={selectedMeeting.id}
          meetingTitle={selectedMeeting.title}
        />
      )}
    </div>
  );
};

export default Meetings;
