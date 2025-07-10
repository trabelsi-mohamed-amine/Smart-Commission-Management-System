// This file checks if the authentication token is being properly passed to the API
console.log('Token in localStorage:', localStorage.getItem('token'));
console.log('User in localStorage:', localStorage.getItem('user'));

// Function to safely parse JSON
function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Invalid JSON:', e);
    return null;
  }
}

// Get user info
const userString = localStorage.getItem('user');
const user = safeJsonParse(userString);
console.log('User info:', user);

if (user) {
  console.log('User is logged in as:', user.role);
} else {
  console.log('User is not logged in or user data is invalid');
}

// Check token format
const token = localStorage.getItem('token');
if (token) {
  console.log('Token exists. First 10 chars:', token.substring(0, 10) + '...');
  
  // Check token parts (if JWT)
  const parts = token.split('.');
  if (parts.length === 3) {
    console.log('Token appears to be in JWT format with 3 parts');
  } else {
    console.log('Token is not in standard JWT format, has', parts.length, 'parts');
  }
} else {
  console.log('No token found in localStorage');
}

// Test authentication
async function testAuthentication() {
  console.log('Testing authentication...');
  
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    console.log('Sending request with headers:', headers);
    const response = await fetch('http://localhost:8000/api/token-test', { headers });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Authentication test response:', data);
    } else {
      console.error('Authentication test failed:', response.status);
      const text = await response.text();
      console.error('Error response:', text);
    }
  } catch (error) {
    console.error('Error testing authentication:', error);
  }
}

// Execute test
testAuthentication();
