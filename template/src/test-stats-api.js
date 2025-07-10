// Test script for stats API endpoints
const testStatsEndpoints = async () => {
  console.log("=== Testing Stats API Endpoints ===");
  
  // Try the non-authenticated endpoint first
  console.log("\n1. Testing non-authenticated endpoint...");
  try {
    const response = await fetch('http://localhost:8000/api/stats-test');
    if (response.ok) {
      const data = await response.json();
      console.log("✓ Non-authenticated endpoint working");
      console.log("Data source:", data.data_source);
      console.log("Sample data:", {
        total_meetings: data.total_meetings,
        total_commissions: data.total_commissions,
        commission_members: data.commission_members
      });
    } else {
      console.error("✗ Error status:", response.status);
      const text = await response.text();
      console.error("Response:", text);
    }
  } catch (error) {
    console.error("✗ Fetch error:", error.message);
  }
  
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  console.log("\n2. Token available:", !!token);
  
  if (token) {
    // Test the token-test endpoint
    console.log("\n3. Testing token-test endpoint...");
    try {
      const response = await fetch('http://localhost:8000/api/token-test', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("✓ Token test successful");
        console.log("Token received by server:", data.token_received);
        console.log("Auth header received:", data.auth_header);
      } else {
        console.error("✗ Error status:", response.status);
      }
    } catch (error) {
      console.error("✗ Fetch error:", error.message);
    }
    
    // Test the authenticated endpoint
    console.log("\n4. Testing authenticated stats endpoint...");
    try {
      const response = await fetch('http://localhost:8000/api/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("✓ Authenticated endpoint working");
        console.log("Data source:", data.data_source);
        console.log("Auth status:", data.auth_status);
        console.log("User role:", data.user_role);
        console.log("Sample data:", {
          total_meetings: data.total_meetings,
          total_commissions: data.total_commissions
        });
      } else {
        console.error("✗ Error status:", response.status);
        const text = await response.text();
        console.error("Response:", text);
      }
    } catch (error) {
      console.error("✗ Fetch error:", error.message);
    }
  }
  
  console.log("\n=== Testing Complete ===");
};

// Run the tests
testStatsEndpoints();
