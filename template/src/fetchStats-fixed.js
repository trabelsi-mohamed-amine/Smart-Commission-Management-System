// Enhanced fetchStats function that prioritizes authenticated data
const fetchStats = async (setLoading, setStats, setNextMeetings) => {
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
          
          // Update stats state with the data
          setStats(statsData);
          
          // Also fetch next meetings data if we have authenticated access
          try {
            const meetingsResponse = await fetch('http://localhost:8000/api/next-meetings', { headers });
            if (meetingsResponse.ok) {
              const meetingsData = await meetingsResponse.json();
              console.log('✓ Next meetings data received');
              setNextMeetings(meetingsData);
            } else {
              console.error('Meetings API error status:', meetingsResponse.status);
            }
          } catch (meetingsError) {
            console.error('Error fetching meetings:', meetingsError);
          }
          
          // Successfully got authenticated data, exit early
          setLoading(false);
          return;
        } else {
          console.error('Auth stats API error status:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (authError) {
        console.error('Error during authenticated request:', authError);
      }
    }
    
    // If we get here, either authentication failed or we don't have a token
    // Fall back to the non-authenticated endpoint
    console.warn('Falling back to non-authenticated endpoint...');
    try {
      const response = await fetch('http://localhost:8000/api/stats-test');
      if (response.ok) {
        statsData = await response.json();
        console.log('Using real non-authenticated data:', statsData.data_source);
        setStats(statsData);
      } else {
        console.error('Test stats API error status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch statistics: ${response.status}`);
      }
    } catch (testError) {
      console.error('Error during test endpoint request:', testError);
      throw testError;
    }
  } catch (error) {
    console.error('Error in fetchStats:', error);
  } finally {
    setLoading(false);
  }
};

export default fetchStats;
