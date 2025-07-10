import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    // Clean up stored user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Countdown for UX feedback
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: '100vh' }}>
      <div className="text-center p-5 bg-light rounded shadow">
        <div className="spinner-border text-primary mb-4" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mb-3">Logging out...</h3>
        <p className="text-muted">You'll be redirected to the homepage in {countdown} seconds</p>
      </div>
    </div>
  );
}

export default Logout;
