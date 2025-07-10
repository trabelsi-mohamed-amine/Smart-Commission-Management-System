// Enhanced fetchStats function that prioritizes authenticated data
const fetchStats = async () => {
  setLoading(true);
  try {
    // Get token for authenticated requests
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    console.log('Fetching stats, token available:', !!token);
    
    let statsData = null;
    
    if (token) {
      try {
        // Go directly to the authenticated stats endpoint
        const response = await fetch('http://localhost:8000/api/stats', { 
          headers,
          redirect: 'error'
        });
        
        if (response.ok) {
          statsData = await response.json();
          console.log('✓ Using real authenticated data from database');
          
          // Confirm we're using the right data source
          if (statsData.data_source === 'authenticated_api') {
            console.log('✓ Authenticated as:', statsData.user_role);
          } else {
            console.warn('⚠️ Unexpected data source:', statsData.data_source);
          }
          } else {
            console.error('Auth stats API error status:', response.status);
            const errorText = await response.text();
            console.error('Error response:', errorText);
          }
        } else {
          console.error('Token test failed:', testResponse.status);
        }
      } catch (authError) {
        console.error('Error during authenticated request:', authError);
      }
    }
    
    // If auth request failed or we don't have a token, try the test endpoint
    if (!statsData) {
      console.warn('Falling back to non-authenticated endpoint...');
      const response = await fetch('http://localhost:8000/api/stats-test');
      if (response.ok) {
        statsData = await response.json();
        console.log('Using non-authenticated data source:', statsData.data_source);
      } else {
        console.error('Test stats API error status:', response.status);
        const testErrorText = await response.text();
        console.error('Test error response:', testErrorText);
        throw new Error(`Failed to fetch statistics: ${response.status}`);
      }
    }
    
    console.log('Stats data received:', statsData);
    setStats(statsData);
    
    // Fetch next meetings
    if (token) {
      const meetingsResponse = await fetch('http://localhost:8000/api/next-meetings', { headers });
      if (meetingsResponse.ok) {
        const meetingsData = await meetingsResponse.json();
        console.log('Next meetings data received');
        setNextMeetings(meetingsData);
      } else {
        console.error('Meetings API error status:', meetingsResponse.status);
      }
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  } finally {
    setLoading(false);
  }
};
