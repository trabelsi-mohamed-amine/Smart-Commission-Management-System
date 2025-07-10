import { useState, useEffect } from 'react';
import { FaCalendarCheck, FaUsers, FaCalendar, FaSearch } from 'react-icons/fa';

function Dashboard() {
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [nextMeetings, setNextMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize stats with minimal empty values
  const [stats, setStats] = useState({
    total_meetings: 0,
    total_commissions: 0
  });
  
  // Simplified function to fetch statistics from backend
  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get token for authenticated requests
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Single endpoint for all users
      const response = await fetch('http://localhost:8000/api/stats', { headers });
      
      if (response.ok) {
        const statsData = await response.json();
        console.log('Stats loaded successfully');
        setStats(statsData);
        
        // Get next meetings data
        if (token) {
          const meetingsResponse = await fetch('http://localhost:8000/api/next-meetings', { headers });
          if (meetingsResponse.ok) {
            const meetingsData = await meetingsResponse.json();
            setNextMeetings(meetingsData);
          }
        }
      } else {
        console.error('Stats API error:', response.status);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
      setUserRole(user.role);
      setUserName(user.name);
    }
  }, []);
  
  // Separate useEffect for stats to ensure userRole is set
  useEffect(() => {
    if (userRole) {
      fetchStats();
      // Refresh stats every minute
      const intervalId = setInterval(fetchStats, 60000);
      return () => clearInterval(intervalId);
    }
  }, [userRole]);

  // Filter meetings based on search term
  const filteredMeetings = nextMeetings.filter(meeting => 
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.commission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(meeting.date).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Dashboard</h1>
        <div className="text-muted">
          <small>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</small>
        </div>
      </div>
      
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body bg-primary bg-gradient text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="card-title mb-1">Welcome, {userName || 'User'}!</h4>
              <p className="card-text mb-0">
                You are logged in as a <strong>{userRole.replace('_', ' ').toUpperCase()}</strong>
              </p>
            </div>
            <div className="d-none d-md-block">
              <i className="fas fa-chart-line fa-3x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading statistics...</span>
          </div>
          <p className="mt-2 text-muted">Loading dashboard data...</p>
        </div>
      )}
      
      {!loading && (
        <>
          {/* Simplified Stats Row - Same for all users */}
          <div className="row">
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="card text-white bg-primary h-100">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="card-title">Total Meetings</h5>
                    <p className="card-text fs-3 fw-bold">{stats.total_meetings}</p>
                  </div>
                  <div className="ms-3"><FaCalendarCheck size={30} /></div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 mb-4">
              <div className="card text-white bg-warning h-100">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="card-title">Total Commissions</h5>
                    <p className="card-text fs-3 fw-bold">{stats.total_commissions}</p>
                  </div>
                  <div className="ms-3"><FaUsers size={30} /></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Meetings Table - Same for all users */}
          <div className="card mb-4 mt-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Upcoming Meetings</h5>
            </div>
            <div className="card-body">
              {nextMeetings && nextMeetings.length > 0 ? (
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
                          placeholder="Search meetings..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Commission</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeetings.map((meeting) => (
                        <tr key={meeting.id}>
                          <td>{meeting.title}</td>
                          <td>{meeting.commission_name}</td>
                          <td>{new Date(meeting.date).toLocaleDateString()}</td>
                          <td>{meeting.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredMeetings.length === 0 && (
                    <p className="text-center text-muted">No meetings match your search</p>
                  )}
                </>
              ) : (
                <p className="text-muted text-center">No upcoming meetings</p>
              )}
            </div>
          </div>

          {/* Quick Actions - Same for all users */}
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-grid">
                    <a href="/dashboard/meetings" className="btn btn-primary mb-2">Manage Meetings</a>
                    {userRole === 'administrator' && (
                      <a href="/dashboard/users" className="btn btn-info mb-2">Manage Users</a>
                    )}
                    <a href="/dashboard/commissions" className="btn btn-warning mb-2">View Commissions</a>
                    <a href="/dashboard/meetings/calendar" className="btn btn-success mb-2">Meeting Calendar</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
