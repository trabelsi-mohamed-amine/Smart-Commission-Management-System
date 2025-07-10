import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const MeetingCalendar = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchMeetings();
  }, []);
  
  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found - user may not be logged in');
        setIsLoading(false);
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://127.0.0.1:8000/api/meetings', config);
      
      if (Array.isArray(response.data)) {
        // Transform meetings data into FullCalendar format
        const calendarEvents = response.data.map(meeting => {
          // Combine date and time fields to create a proper date object
          const dateTime = `${meeting.date}T${meeting.time}`;
          
          // Create an end time 1 hour after start time (you can adjust as needed)
          const startDate = new Date(dateTime);
          const endDate = new Date(startDate);
          endDate.setHours(endDate.getHours() + 1);
          
          // Determine event color based on user's participation status
          const isParticipant = meeting.current_user_status === 'joined';
          
          // Use standard colors - blue for default, green for meetings user has joined
          let backgroundColor = '#17a2b8'; // Default blue for all meetings
          let borderColor = '#138496';
          
          if (isParticipant) {
            backgroundColor = '#28a745'; // Green for joined meetings
            borderColor = '#1e7e34';
          }
          
          return {
            id: meeting.id,
            title: meeting.title,
            start: dateTime,
            end: endDate.toISOString(),
            extendedProps: {
              description: meeting.description,
              commission_id: meeting.commission_id,
              participant_count: meeting.participant_count,
              isParticipant: isParticipant,
              isReadOnly: true
            },
            backgroundColor: backgroundColor,
            borderColor: borderColor
          };
        });
        
        setMeetings(calendarEvents);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEventClick = (clickInfo) => {
    // Display meeting details when clicking on an event
    const meeting = clickInfo.event;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
      <h5>${meeting.title}</h5>
      <p><strong>Description:</strong> ${meeting.extendedProps.description || 'No description'}</p>
      <p><strong>Date:</strong> ${new Date(meeting.start).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${new Date(meeting.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
      <p><strong>Participants:</strong> ${meeting.extendedProps.participant_count}</p>
      <p class="text-info"><i class="fas fa-info-circle"></i> View-only mode: Calendar displays meetings for reference only.</p>
    `;
    
    // Show the meeting details
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.setAttribute('role', 'dialog');
    
    modal.innerHTML = `
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Meeting Details</h5>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${modalContent.innerHTML}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    `;    document.body.appendChild(modal);
    
    // Close modal when clicking close button or outside the modal
    const closeBtn = modal.querySelector('.btn-close');
    const closeFooterBtn = modal.querySelector('.modal-footer .btn-secondary');
    
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    closeFooterBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };  
  
  return (
    <div className="meeting-calendar-container">
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Meeting Calendar</h5>
            <span className="badge bg-info">View Only</span>
          </div>
          <div className="card-body">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={meetings}
              eventClick={handleEventClick}
              height="auto"
              aspectRatio={1.35}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
            />
          </div>
         
        </div>
      )}
    </div>
  );
};

export default MeetingCalendar;
