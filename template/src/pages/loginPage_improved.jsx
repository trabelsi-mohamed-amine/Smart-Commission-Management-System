import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";

const LoginPage = () => {
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
    
    console.log("Login attempt with:", { email });
  
    try {
      // First, check server connectivity with a simple request
      try {
        await axios.get("http://127.0.0.1:8000/api/debug-log");
        console.log("Server connectivity check: OK");
      } catch (connectivityError) {
        console.error("Server connectivity check failed:", connectivityError);
        throw new Error("Server is not responding. Please try again later.");
      }
      
      // Now attempt login with credentials validation
      if (!email.trim() || !password.trim()) {
        throw new Error("Email and password are required");
      }
      
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("Login response:", response.data);
  
      if (response.data.token && response.data.user) {
        setSuccess("Connexion réussie !");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        console.warn("Unexpected response format:", response.data);
        setError("Réponse inattendue. Réessayez.");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.message === "Server is not responding. Please try again later.") {
        setError(err.message);
      } else if (err.response?.status === 404 || err.response?.data?.message === "Utilisateur non trouvé") {
        // User not found, redirect to register
        console.log("User not found, redirecting to register");
        navigate("/register", {
          state: {
            email,
            password,
          },
        });
      } else if (err.response?.status === 401) {
        setError("Mot de passe incorrect");
      } else if (err.response?.data?.error) {
        setError(`Erreur: ${err.response.data.error}`);
      } else if (err.response?.status === 500) {
        setError("Erreur interne du serveur. Veuillez réessayer plus tard.");
      } else {
        setError("Une erreur s'est produite. Réessayez.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <h2>Welcome Back!</h2>
          <p>Login to access your personalized dashboard and manage your meetings efficiently.</p>
        </div>
        
        <div className="login-content">
          <div className="logo-watermark">
            <img src="/img/smart.png" alt="Logo" />
          </div>
          
          <div className="form-wrapper">
            <h2 className="login-title">Sign In</h2>
            <p className="login-subtitle">Enter your credentials to access your account</p>
            
            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-btn" 
                disabled={loading}
              >
                <FaSignInAlt className="me-2" />
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {success && <div className="alert alert-success mt-3">{success}</div>}
            </form>

            <div className="login-footer">
              Don't have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
      </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .login-image {
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

        .login-content {
          padding: 3rem;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a365d;
          text-align: center;
        }

        .login-subtitle {
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

        .login-btn {
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

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 110, 255, 0.3);
          background: linear-gradient(135deg, #0066FF, #00BFFF);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: #718096;
        }

        .login-footer a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }
        
        .alert {
          padding: 0.75rem 1.25rem;
          margin-top: 1rem;
          border: 1px solid transparent;
          border-radius: 0.25rem;
        }
        
        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }
        
        .alert-success {
          color: #155724;
          background-color: #d4edda;
          border-color: #c3e6cb;
        }
        
        .mt-3 {
          margin-top: 1rem;
        }
        
        .me-2 {
          margin-right: 0.5rem;
        }

        @media (max-width: 768px) {
          .login-card {
            grid-template-columns: 1fr;
          }
          
          .login-image {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
