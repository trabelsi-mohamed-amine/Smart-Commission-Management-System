import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import axios from 'axios';

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  if (location.pathname === '/join') {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        'http://localhost:8000/api/newsletter/subscribe', 
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      setSubmitMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setSubmitMessage(
        error.response?.data?.message || 
        'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <footer className="bg-gradient-dark text-light pt-5">
      <div className="container py-5">
        <div className="row g-5">
          {/* Quick Links */}
          <div className="col-lg-3 col-md-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white mb-4 fw-bold">
                <span className="text-gradient-primary">Quick</span> Links
              </h4>
              <div className="d-flex flex-column gap-3">
                {[
                  { path: "/about", name: "About Us" },
                  { path: "/service", name: "Services" },
                  { path: "/team", name: "Our Team" },
                  { path: "/contact", name: "Contact" }
                ].map((link) => (
                  <motion.div
                    key={link.path}
                    whileHover={{ x: 5 }}
                  >
                    <Link 
                      to={link.path} 
                      className="text-white-50 hover-primary text-decoration-none d-flex align-items-center gap-2"
                    >
                      <i className="fas fa-chevron-right text-white" style={{ fontSize: '0.7rem' }}></i>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white mb-4 fw-bold">
                <span className="text-gradient-primary">Contact</span> Info
              </h4>
              <div className="d-flex flex-column gap-3">
                {[
                  { 
                    icon: "map-marked-alt", 
                    content: <a href="https://www.google.com/maps/place/Smart+Skills,+Rue+Hédi+Cheker,+Le+Kef" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-white-50 hover-primary text-decoration-none d-flex align-items-center gap-2">
                              <i className="fas fa-map-marker-alt text-white"></i>
                              <span>Rue Hédi Cheker 7100 <br />LE Kef Tunisie</span>
                            </a> 
                  },
                  { 
                    icon: "phone", 
                    content: <a href="tel:+21636368883" 
                              className="text-white-50 hover-primary text-decoration-none d-flex align-items-center gap-2">
                              <i className="fas fa-phone-alt text-white"></i>
                              <span>+216 36 368 883</span>
                            </a> 
                  },
                  { 
                    icon: "envelope", 
                    content: <a href="mailto:contact@smartskills.tn" 
                              className="text-white-50 hover-primary text-decoration-none d-flex align-items-center gap-2">
                              <i className="fas fa-envelope text-white"></i>
                              <span>contact@smartskills.tn</span>
                            </a> 
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                  >
                    {item.content}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white mb-4 fw-bold">
                <span className="text-gradient-primary">News</span>letter
              </h4>
              <p className="text-white-50 mb-4">
                Recevez les dernières actualités de SmartMeet.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="position-relative">
                  <input
                    className="form-control bg-transparent border-secondary text-white rounded-pill ps-4 pe-5 py-3 w-100"
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ maxWidth: '300px' }}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-primary rounded-pill position-absolute end-0 top-0 mt-2 me-2 px-3 py-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <i className="fas fa-spinner fa-spin text-white"></i>
                    ) : (
                      <i className="fas fa-paper-plane text-white"></i>
                    )}
                  </motion.button>
                </div>
              </form>
              {submitMessage && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-2 small ${submitMessage.includes('Merci') ? 'text-success' : 'text-danger'}`}
                >
                  {submitMessage}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Social Media */}
          <div className="col-lg-3 col-md-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white mb-4 fw-bold">
                <span className="text-gradient-primary">Follow</span> Us
              </h4>
              <div className="d-flex flex-wrap gap-3 mb-4">
                {[
                  { name: 'facebook', icon: 'facebook-f' },
                  { name: 'twitter', icon: 'twitter' },
                  { name: 'linkedin', icon: 'linkedin-in' },
                  { name: 'instagram', icon: 'instagram' },
                  { name: 'youtube', icon: 'youtube' }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    whileHover={{ y: -5, scale: 1.1 }}
                    href={`https://${social.name}.com/smartskills`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-square rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <i className={`fab fa-${social.icon} text-white`}></i>
                  </motion.a>
                ))}
              </div>
              <div className="text-white-50">
                <p>Suivez-nous sur les réseaux sociaux.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container-fluid bg-dark-darker py-4 border-top border-secondary">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 text-white-50">
                © {new Date().getFullYear()} <span className="text-gradient-primary">SmartMeet</span>. Tous droits réservés.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <motion.a
                href="https://www.tac-tic.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white-50">Développé par </span>
                <span className="text-gradient-primary fw-bold">TAC-TIC</span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .bg-gradient-dark {
          background: linear-gradient(135deg, #1e3a8a 0%, #111827 100%);
        }
        .bg-dark-darker {
          background-color: #0f172a;
        }
        .hover-primary:hover {
          color: #3b82f6 !important;
          transform: translateX(5px);
        }
        .text-gradient-primary {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .btn-square {
          border-radius: 10px !important;
        }
        input::placeholder {
          color: #94a3b8 !important;
          opacity: 1;
        }
        input:-ms-input-placeholder {
          color: #94a3b8 !important;
        }
        input::-ms-input-placeholder {
          color: #94a3b8 !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;