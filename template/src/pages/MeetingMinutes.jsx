import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaEdit, FaTrashAlt, FaFilePdf } from 'react-icons/fa';

const MeetingMinutes = () => {
  const [minutes, setMinutes] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [form, setForm] = useState({
    id: null,
    meeting_id: '',
    summary: '',
    decisions: '',
    actions: '',
    status: 'en attente',
    file: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchMinutes = async () => {
    const res = await axios.get('/api/meeting-minutes');
    setMinutes(res.data);
  };

  const fetchMeetings = async () => {
    const res = await axios.get('/api/meetings'); // Assurez-vous que cette route existe
    setMeetings(res.data);
  };
  useEffect(() => {
    fetchMinutes();
    fetchMeetings();
    
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) formData.append(key, form[key]);
    }

    try {
      if (isEditing) {
        await axios.post(`/api/meeting-minutes/${form.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/api/meeting-minutes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchMinutes();
      resetForm();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      meeting_id: '',
      summary: '',
      decisions: '',
      actions: '',
      status: 'en attente',
      file: null,
    });
    setIsEditing(false);
  };

  const handleEdit = (minute) => {
    setForm({
      id: minute.id,
      meeting_id: minute.meeting_id,
      summary: minute.summary,
      decisions: minute.decisions,
      actions: minute.actions,
      status: minute.status,
      file: null,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/meeting-minutes/${id}`);
    fetchMinutes();
  };
  return (
    <div className="container py-4">
      <h2 className="mb-4">Meeting Minutes Management</h2>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Create New Meeting Minutes</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Select Meeting</label>
              <select 
                name="meeting_id" 
                value={form.meeting_id} 
                onChange={handleChange} 
                required 
                className="form-select"
              >
                <option value="">-- Select a meeting --</option>
                {meetings.map((meeting) => (
                  <option key={meeting.id} value={meeting.id}>
                    {meeting.title} - {meeting.date}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select 
                name="status" 
                value={form.status} 
                onChange={handleChange} 
                required 
                className="form-select"
                disabled={userRole !== 'commission_manager'}
              >
                <option value="en attente">Pending</option>
                <option value="approuvé">Approved</option>
                <option value="rejeté">Rejected</option>
              </select>
              {userRole !== 'commission_manager' && 
                <small className="text-muted">Only commission managers can change status</small>
              }
            </div>

            <div className="col-12">
              <label className="form-label">Summary</label>
              <textarea 
                name="summary" 
                value={form.summary} 
                onChange={handleChange} 
                placeholder="Meeting summary" 
                required 
                className="form-control" 
                rows={3}
              />
            </div>
            
            <div className="col-12">
              <label className="form-label">Decisions</label>
              <textarea 
                name="decisions" 
                value={form.decisions} 
                onChange={handleChange} 
                placeholder="Decisions made during the meeting" 
                required 
                className="form-control" 
                rows={3}
              />
            </div>
            
            <div className="col-12">
              <label className="form-label">Action Items</label>
              <textarea 
                name="actions" 
                value={form.actions} 
                onChange={handleChange} 
                placeholder="Action items and assignments" 
                required 
                className="form-control" 
                rows={3}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Attachment</label>
              <input 
                type="file" 
                name="file" 
                onChange={handleChange} 
                className="form-control" 
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary me-2">
                {isEditing ? 'Update' : 'Create'} Meeting Minutes
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Meeting Minutes List</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Meeting</th>
                  <th>Summary</th>
                  <th>Status</th>
                  <th>File</th>
                  <th width="250">Actions</th>
                </tr>
              </thead>
              <tbody>
                {minutes.length > 0 ? (
                  minutes.map((minute) => (
                    <tr key={minute.id}>
                      <td>{minute.meeting?.title || '---'}</td>
                      <td>{minute.summary}</td>
                      <td>
                        <span className={`badge ${
                          minute.status === 'approuvé' ? 'bg-success' : 
                          minute.status === 'rejeté' ? 'bg-danger' : 
                          'bg-warning'
                        }`}>
                          {minute.status === 'approuvé' ? 'Approved' : 
                           minute.status === 'rejeté' ? 'Rejected' : 
                           'Pending'}
                        </span>
                      </td>
                      <td>
                        {minute.file_path ? (
                          <a href={`/storage/${minute.file_path}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            <FaFilePdf className="me-1" /> View File
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button 
                            onClick={() => handleEdit(minute)} 
                            className="btn btn-sm btn-warning"
                            disabled={userRole === 'commission_member' && minute.status !== 'en attente' && minute.status !== 'rejeté'}
                          >
                            <FaEdit className="me-1" /> Edit
                          </button>
                          
                          <Link 
                            to={`/dashboard/meeting-transcript/${minute.meeting_id}`}
                            className="btn btn-sm btn-info"
                          >
                            <FaFileAlt className="me-1" /> Transcript
                          </Link>
                          
                          {userRole === 'commission_manager' && (
                            <button 
                              onClick={() => handleDelete(minute.id)} 
                              className="btn btn-sm btn-danger"
                            >
                              <FaTrashAlt className="me-1" /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3 text-muted">
                      No meeting minutes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3>Create Meeting Transcript</h3>
        <p className="text-muted">
          Select a meeting below to create or view its detailed transcript:
        </p>
        
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
          {meetings.map(meeting => (
            <div className="col" key={meeting.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{meeting.title}</h5>
                  <p className="card-text text-muted">
                    {meeting.date} at {meeting.time}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <Link 
                    to={`/dashboard/meeting-transcript/${meeting.id}`}
                    className="btn btn-outline-primary w-100"
                  >
                    <FaFileAlt className="me-2" /> 
                    {minutes.some(m => m.meeting_id === meeting.id) ? 'View Transcript' : 'Create Transcript'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingMinutes;
