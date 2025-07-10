import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileDownload, FaFilePdf, FaSave, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
// Import jsPDF with legacy constructor to ensure compatibility
import jsPDF from "jspdf";
import 'jspdf-autotable';

// Helper function for authenticated API requests
const api = {
  get: async (url) => {
    const token = localStorage.getItem('token');
    return axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  post: async (url, data) => {
    const token = localStorage.getItem('token');
    return axios.post(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  put: async (url, data) => {
    const token = localStorage.getItem('token');
    return axios.put(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  delete: async (url) => {
    const token = localStorage.getItem('token');
    return axios.delete(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }
};

const MeetingTranscript = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState({
    meeting_id: id,
    title: '',
    content: '',
    summary: '',
    decisions: '',
    actions: '',
    status: 'en attente',
  });
  const [userRole, setUserRole] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [existingTranscript, setExistingTranscript] = useState(null);
  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
    
    const fetchData = async () => {
      try {
        // Fetch meeting details
        const meetingRes = await api.get(`http://127.0.0.1:8000/api/meetings/${id}`);
        setMeeting(meetingRes.data);
        setTranscript(prev => ({ 
          ...prev, 
          title: `Transcript: ${meetingRes.data.title}` 
        }));

        // Check if meeting transcript already exists
        try {
          const transcriptsRes = await api.get(`http://127.0.0.1:8000/api/meeting-transcripts/by-meeting/${id}`);
          if (transcriptsRes.data && transcriptsRes.data.length > 0) {
            setExistingTranscript(transcriptsRes.data[0]);
            setTranscript({
              meeting_id: id,
              title: transcriptsRes.data[0].title || `Transcript: ${meetingRes.data.title}`,
              content: transcriptsRes.data[0].content || '',
              summary: transcriptsRes.data[0].summary || '',
              decisions: transcriptsRes.data[0].decisions || '',
              actions: transcriptsRes.data[0].actions || '',
              status: transcriptsRes.data[0].status,
            });
            setIsEditing(userRole === 'commission_member' && transcriptsRes.data[0].status === 'en attente');
          } else {
            setIsEditing(userRole === 'commission_member' || userRole === 'commission_manager');
          }
        } catch (error) {
          // If there's an error or no transcript exists yet, continue with defaults
          console.log("No transcript found for this meeting, creating new", error);
          setIsEditing(userRole === 'commission_member' || userRole === 'commission_manager');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading meeting data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTranscript(prev => ({
      ...prev,
      [name]: value
    }));
  };  const handleSave = async () => {
    try {
      const payload = {
        ...transcript,
        meeting_id: id
      };
      
      // For rejected transcripts, commission members should use the resubmit endpoint
      if (existingTranscript && userRole === 'commission_member' && existingTranscript.status === 'rejeté') {
        const { data } = await api.put(
          `http://127.0.0.1:8000/api/meeting-transcripts/${existingTranscript.id}/resubmit`,
          payload
        );
        setExistingTranscript(data.data);
        toast.success('Transcript resubmitted successfully');
      } else if (existingTranscript) {
        const { data } = await api.put(
          `http://127.0.0.1:8000/api/meeting-transcripts/${existingTranscript.id}`, 
          payload
        );
        setExistingTranscript(data.data);
        toast.success('Transcript updated successfully');
      } else {
        const { data } = await api.post(
          'http://127.0.0.1:8000/api/meeting-transcripts', 
          payload
        );
        setExistingTranscript(data.data);
        toast.success('Transcript created successfully');
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving transcript:', error);
      
      // Show more detailed error message
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Authentication error. Please log in again.');
        } else if (error.response.status === 422) {
          // Validation errors
          const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
          toast.error(`Validation failed: ${errorMessages}`);
        } else {
          toast.error(`Failed to save transcript (Error ${error.response.status})`);
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to save transcript');
      }
    }
  };  const handleValidate = async (status) => {
    if (!existingTranscript) return;
    
    try {
      // Use the api helper for consistency
      await api.put(
        `http://127.0.0.1:8000/api/meeting-transcripts/${existingTranscript.id}/validate`, 
        { status: status }
      );
      
      setTranscript(prev => ({ ...prev, status }));
      setExistingTranscript(prev => ({ ...prev, status }));      
      toast.success(`Transcript ${status === 'approuvé' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error validating transcript:', error);
      
      // Show more detailed error message
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Authentication error. Please log in again.');
        } else if (error.response.status === 403) {
          toast.error('You do not have permission to validate transcripts. Only administrators can perform this action.');
        } else {
          toast.error(`Failed to update transcript status (Error ${error.response.status})`);
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to update transcript status');
      }
    }
  };  
    const generatePDF = () => {
    try {
      console.log("Starting PDF generation...");
      
      // Create a PDF document
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Add title and status
      doc.setFontSize(22);
      doc.text("Meeting Transcript", 20, 20);
      
      // Add status indicator
      let statusText = '';
      let statusColor = '';
      if (transcript.status === 'approuvé') {
        statusText = 'APPROVED';
        statusColor = [39, 174, 96]; // green
      } else if (transcript.status === 'rejeté') {
        statusText = 'REJECTED';
        statusColor = [192, 57, 43]; // red
      } else {
        statusText = 'PENDING';
        statusColor = [243, 156, 18]; // yellow/orange
      }
      
      doc.setTextColor(...statusColor);
      doc.setFontSize(16);
      doc.text(statusText, 170, 20, { align: 'right' });
      doc.setTextColor(0, 0, 0); // Reset to black
      
      // Add line under title
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 25, 190, 25);
      
      // Add meeting info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Meeting Information:", 20, 35);
      doc.setFont('helvetica', 'normal');
      
      if (meeting) {
        doc.text(`Title: ${meeting.title}`, 25, 45);
        doc.text(`Date: ${meeting.date}`, 25, 52);
        doc.text(`Time: ${meeting.time}`, 25, 59);
      }
      
      // Add horizontal line
      doc.line(20, 65, 190, 65);
      
      let yPosition = 75;
      
      // Transcript title
      doc.setFont('helvetica', 'bold');
      doc.text(`${transcript.title}`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 10;
      
      // CONTENT section
      doc.setFont('helvetica', 'bold');
      doc.text("CONTENT:", 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 7;
      
      // Add content with text wrapping
      const contentLines = doc.splitTextToSize(
        transcript.content || "No content available", 
        170
      );
      
      // Check if content is too long and might go beyond page
      if (contentLines.length > 20) {
        // First portion on this page
        doc.text(contentLines.slice(0, 20), 20, yPosition);
        yPosition += 20 * 5; // Approximate height for 20 lines
        
        // Add ellipsis to indicate content continues
        doc.text("...", 20, yPosition);
        yPosition += 7;
      } else {
        doc.text(contentLines, 20, yPosition);
        yPosition += contentLines.length * 5 + 5; // Adjust based on number of lines
      }
      
      // SUMMARY section
      doc.setFont('helvetica', 'bold');
      doc.text("SUMMARY:", 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 7;
      
      const summaryLines = doc.splitTextToSize(
        transcript.summary || "No summary available", 
        170
      );
      doc.text(summaryLines, 20, yPosition);
      yPosition += summaryLines.length * 5 + 10;
      
      // DECISIONS section
      doc.setFont('helvetica', 'bold');
      doc.text("DECISIONS:", 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 7;
      
      const decisionsLines = doc.splitTextToSize(
        transcript.decisions || "No decisions recorded", 
        170
      );
      doc.text(decisionsLines, 20, yPosition);
      yPosition += decisionsLines.length * 5 + 10;
      
      // Check if we need a new page for ACTIONS
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // ACTIONS section
      doc.setFont('helvetica', 'bold');
      doc.text("ACTION ITEMS:", 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 7;
      
      const actionsLines = doc.splitTextToSize(
        transcript.actions || "No action items recorded", 
        170
      );
      doc.text(actionsLines, 20, yPosition);
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`, 
          105, 
          285, 
          { align: 'center' }
        );
      }
      
      console.log("Saving PDF...");
      
      // Save the PDF with a descriptive filename
      doc.save(`transcript-${meeting?.title || id}-${new Date().toLocaleDateString()}.pdf`);
      toast.success('PDF generated successfully');} catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(`Failed to generate PDF: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }  // Commission members can only edit their own transcripts that are pending or rejected
  const canEdit = (userRole === 'commission_member' || userRole === 'commission_manager') && 
    (!existingTranscript || existingTranscript.status === 'en attente' || existingTranscript.status === 'rejeté');
  
  // Only administrators can validate transcripts
  const canValidate = (userRole === 'administrator') && 
    existingTranscript && existingTranscript.status === 'en attente';

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" /> Back
          </button>
          <h2>Meeting Transcript</h2>
          {meeting && (
            <p className="text-muted">
              {meeting.title} - {meeting.date} at {meeting.time}
            </p>
          )}
        </div>
        <div>          {existingTranscript && (
            <button
              className="btn btn-success me-2"
              onClick={(e) => {
                e.preventDefault();
                console.log("PDF export button clicked");
                generatePDF();
              }}
            >
              <FaFilePdf className="me-2" /> Export to PDF
            </button>
          )}
          {canEdit && (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Editing" : "Edit Transcript"}
            </button>
          )}
        </div>
      </div>      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Transcript Details
            <span className={`ms-2 badge ${
              transcript.status === 'approuvé' ? 'bg-success' : 
              transcript.status === 'rejeté' ? 'bg-danger' : 
              'bg-warning'
            }`}>
              {transcript.status === 'approuvé' ? 'Approved' : 
               transcript.status === 'rejeté' ? 'Rejected' : 
               'Pending'}
            </span>
          </h5>
          {isEditing && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleSave}
            >
              <FaSave className="me-1" /> {existingTranscript && transcript.status === 'rejeté' ? 'Resubmit' : 'Save Changes'}
            </button>
          )}
        </div>        {existingTranscript && existingTranscript.status === 'rejeté' && existingTranscript.feedback && (
          <div className="alert alert-danger mx-3 mt-3">
            <strong>Feedback from Administrator:</strong><br/>
            {existingTranscript.feedback}
          </div>
        )}
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Title</label>
            {isEditing ? (
              <input
                type="text"
                className="form-control"
                name="title"
                value={transcript.title}
                onChange={handleChange}
              />
            ) : (
              <p className="form-control-plaintext">{transcript.title}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Transcript Content</label>
            {isEditing ? (
              <textarea
                className="form-control"
                name="content"
                value={transcript.content}
                onChange={handleChange}
                rows={10}
                placeholder="Enter the detailed transcript of the meeting..."
              />
            ) : (
              <div className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                {transcript.content || "No transcript content available."}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Summary</label>
            {isEditing ? (
              <textarea
                className="form-control"
                name="summary"
                value={transcript.summary}
                onChange={handleChange}
                rows={4}
                placeholder="Provide a brief summary of the meeting..."
              />
            ) : (
              <div className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                {transcript.summary || "No summary available."}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Decisions</label>
            {isEditing ? (
              <textarea
                className="form-control"
                name="decisions"
                value={transcript.decisions}
                onChange={handleChange}
                rows={4}
                placeholder="List the key decisions made during the meeting..."
              />
            ) : (
              <div className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                {transcript.decisions || "No decisions recorded."}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Action Items</label>
            {isEditing ? (
              <textarea
                className="form-control"
                name="actions"
                value={transcript.actions}
                onChange={handleChange}
                rows={4}
                placeholder="List action items, assignees and deadlines..."
              />
            ) : (
              <div className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                {transcript.actions || "No action items recorded."}
              </div>
            )}
          </div>
        </div>
      </div>      {canValidate && (
        <div className="card">
          <div className="card-header">
            <h5>Validation</h5>
          </div>
          <div className="card-body">
            <p>You can approve or reject this transcript.</p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={() => handleValidate('approuvé')}
              >
                <FaCheckCircle className="me-2" /> Approve Transcript
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleValidate('rejeté')}
              >
                <FaTimesCircle className="me-2" /> Reject Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingTranscript;
