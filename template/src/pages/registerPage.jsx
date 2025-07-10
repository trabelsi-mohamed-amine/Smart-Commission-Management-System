import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Enregistrement de l'utilisateur
      const registerResponse = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
      });

      if (registerResponse.data.message) {
        setSuccess("Registration successful! Logging you in...");
          // 2. Connexion automatique
        try {
          setSuccess("Registration successful! Logging you in...");
          
          // Wait a short time to ensure the user record is fully created
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const loginResponse = await axios.post("http://127.0.0.1:8000/api/login", {
            email,
            password
          });

          // Stockage du token et des infos utilisateur
          localStorage.setItem('token', loginResponse.data.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
          
          // Redirection vers le dashboard
          navigate("/dashboard");
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          
          // Show a more specific message if possible
          if (loginError.response && loginError.response.data && loginError.response.data.message) {
            setSuccess(`Registration successful! Please login. (${loginError.response.data.message})`);
          } else {
            setSuccess("Registration successful! Please login manually.");
          }
          
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } else {
        setError("Invalid registration response. Please try again.");
      }    } catch (err) {
      console.error("Registration error:", err);
      setLoading(false);
      
      if (err.response && err.response.data.errors) {
        // Format validation errors
        if (typeof err.response.data.errors === 'object') {
          const errorMsgs = Object.values(err.response.data.errors).flat();
          setError(errorMsgs.join(', '));
        } else {
          setError(err.response.data.errors);
        }
      } else if (err.response && err.response.data.error) {
        // Display specific error from server
        setError(err.response.data.error);
      } else if (err.response && err.response.data.message) {
        // Display specific message from server
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-image">
          <h2>Join SmartMeet</h2>
          <p>Create your account to start managing meetings and commissions efficiently.</p>
        </div>
        
        <div className="register-content">
          <div className="logo-watermark">
            <img src="/img/smart.png" alt="Logo" />
          </div>
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Fill in your details to get started</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <FaUser className="me-2" />
                Full Name
              </label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="form-control" 
                placeholder="John Doe" 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="me-2" />
                Email Address
              </label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="form-control" 
                placeholder="your@email.com" 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="me-2" />
                Password
              </label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="form-control" 
                placeholder="At least 6 characters" 
                required
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="register-btn" 
              disabled={loading}
            >
              <FaUserPlus className="me-2" />
              {loading ? "Registering..." : "Create Account"}
            </button>

            {error && <div className="alert alert-danger mt-3">{JSON.stringify(error)}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}
          </form>

          <div className="register-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .register-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .register-image {
          background: linear-gradient(rgba(26, 54, 93, 0.85), rgba(26, 54, 93, 0.85)),
                      url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          color: white;
          text-align: center;
        }

        .register-content {
          padding: 3rem;
        }

        .register-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a365d;
          text-align: center;
        }

        .register-subtitle {
          font-size: 1rem;
          color: #718096;
          margin-bottom: 2rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #4a5568;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .register-btn {
          background: linear-gradient(135deg, #00BFFF, #0066FF);
          color: white;
          border: none;
          border-radius: 30px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          width: 100%;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 110, 255, 0.2);
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 110, 255, 0.3);
          background: linear-gradient(135deg, #0066FF, #00BFFF);
        }

        .register-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: #718096;
        }

        .register-footer a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .register-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .register-card {
            grid-template-columns: 1fr;
          }
          
          .register-image {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;