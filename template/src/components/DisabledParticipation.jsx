import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This component displays participant information for a meeting
const MeetingParticipation = ({ meetingId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (meetingId) {
      fetchParticipants();
    }
  }, [meetingId]);

  const fetchParticipants = async () => {
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
  };

  if (loading) {
    return (
      <div className="alert alert-info mt-3">
        <p>Loading participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h5>Meeting Participants ({participants.length})</h5>
      {participants.length > 0 ? (
        <ul className="list-group">
          {participants.map(participant => (
            <li key={participant.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{participant.name}</strong> ({participant.role})
                <div className="text-muted small">
                  <em>{participant.email}</em>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No participants have joined yet.</p>
      )}
    </div>
  );
};

export default MeetingParticipation;
