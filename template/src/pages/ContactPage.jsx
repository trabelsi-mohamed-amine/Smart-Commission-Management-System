import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaDownload, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contacts`, formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent successfully! We will get back to you soon.');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section - Design moderne avec animation */}
      <div className="carousel-container position-relative">
        <div 
          className="carousel-slide position-relative" 
          style={{ 
            background: `linear-gradient(rgba(26, 54, 93, 0.85), rgba(26, 54, 93, 0.85)), url(/img/meeting-hero.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '60vh',
            minHeight: '400px'
          }}
        >
          <div className="container h-100 d-flex align-items-center">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white carousel-content"
            >
              <h5 className="text-uppercase mb-3 carousel-subtitle">
                Contact SmartMeet
              </h5>
              <h1 className="display-4 mb-4 carousel-title">
                Get in Touch With Us
              </h1>
              <p className="fs-5 mb-5 carousel-text">
                Have questions about SmartMeet? Our team is ready to help you streamline your meetings and commission management.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Animated waves at bottom */}
        <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden">
          <svg 
            viewBox="0 0 500 150" 
            preserveAspectRatio="none" 
            className="carousel-wave"
          >
            <path 
              d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" 
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="w-100 py-5 bg-light">
        <div className="container">
          {/* Section Title avec le même style que About */}
          <motion.div 
            className="text-center mb-5 pb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="display-5 fw-bold mb-3 position-relative d-inline-block">
              <span className="position-relative">
                Contact
                <svg 
                  viewBox="0 0 200 20" 
                  className="position-absolute bottom-0 start-0 w-100"
                  style={{ height: '6px' }}
                >
                  <path 
                    d="M0,10 C30,15 70,5 100,10 C130,15 170,5 200,10" 
                    stroke="#3b82f6" 
                    strokeWidth="2" 
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br className="d-md-none" />
              <span className="text-gradient-primary ms-md-3">Information</span>
            </h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Reach out to us through any of these channels or fill out the form and we'll get back to you promptly.
            </p>
          </motion.div>

          <div className="row g-4 justify-content-center">
            {/* Contact Info Card - Style moderne */}
            <motion.div 
              className="col-lg-4 col-md-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="h-100 p-4 p-lg-5 bg-white rounded-4 shadow-sm border-0 position-relative overflow-hidden">
                {/* Décoration d'arrière-plan */}
                <div 
                  className="position-absolute top-0 end-0 bg-primary opacity-10"
                  style={{ width: '150px', height: '150px', borderRadius: '50%', transform: 'translate(30%, -30%)' }}
                />
                
                <h3 className="text-primary fw-bold mb-4 position-relative">
                  Contact Details
                </h3>
                
                <div className="d-flex align-items-start mb-4">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 flex-shrink-0 me-4">
                    <FaMapMarkerAlt className="fs-5" />
                  </div>
                  <div>
                    <h5 className="text-dark mb-1">Our Office</h5>
                    <p className="mb-0">
                      <a
                        href="https://www.google.com/maps/place/Smart+Skills,+Rue+Hédi+Cheker,+Le+Kef"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark text-decoration-none hover-text-primary"
                      >
                        El-kef: Rue Hédi Cheker 7100 Kef
                      </a>
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 flex-shrink-0 me-4">
                    <FaPhoneAlt className="fs-5" />
                  </div>
                  <div>
                    <h5 className="text-dark mb-1">Phone Number</h5>
                    <p className="mb-0">
                      <a href="tel:+21636368883" className="text-dark text-decoration-none hover-text-primary">
                        +216 36 368 883
                      </a>
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 flex-shrink-0 me-4">
                    <FaEnvelope className="fs-5" />
                  </div>
                  <div>
                    <h5 className="text-dark mb-1">Email Address</h5>
                    <p className="mb-0">
                      <a href="mailto:contact@smartskills.tn" className="text-dark text-decoration-none hover-text-primary">
                        contact@smartskills.tn
                      </a>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-2">
                <a 
                href="https://smartskills.tn/wp-content/uploads/2024/02/CATALOGUE-SMARTSKILLS_2024.pdf" 
                target="_blank" rel="noopener noreferrer" 
                className="btn btn-modern d-inline-flex align-items-center">
                   <FaDownload className="me-2" /> Download Catalog
                   </a>
                </div>
              </div>
            </motion.div>

            {/* Map Card - Style moderne */}
            <motion.div 
              className="col-lg-4 col-md-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="h-100 bg-white rounded-4 shadow-sm overflow-hidden border-0">
                <div className="position-relative h-100" style={{ minHeight: '400px' }}>
                  <iframe
                    className="w-100 h-100"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.4532366304247!2d8.704378475273744!3d36.179857602423226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fba44b0b834589%3A0xbc963c0028a43319!2sSmart%20Skills!5e0!3m2!1sen!2sbd!4v1744312064281!5m2!1sen!2sbd"
                    style={{ border: 'none' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Smart Skills Map"
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-primary bg-opacity-75 text-white text-center">
                    Click to view on Google Maps
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form Card - Style moderne */}
            <motion.div 
              className="col-lg-4 col-md-12"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="h-100 p-4 p-lg-5 bg-white rounded-4 shadow-sm border-0">
                <h3 className="text-primary fw-bold mb-4">Send a Message</h3>
                
                {success && (
                  <div className="alert alert-success">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control border-2 rounded-3" 
                          id="name" 
                          placeholder="Your Name" 
                          required 
                        />
                        <label htmlFor="name" className="text-muted">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control border-2 rounded-3" 
                          id="email" 
                          placeholder="Your Email" 
                          required 
                        />
                        <label htmlFor="email" className="text-muted">Your Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input 
                          type="text" 
                          name="subject" 
                          value={formData.subject}
                          onChange={handleChange}
                          className="form-control border-2 rounded-3" 
                          id="subject" 
                          placeholder="Subject" 
                          required 
                        />
                        <label htmlFor="subject" className="text-muted">Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea 
                          name="message" 
                          value={formData.message}
                          onChange={handleChange}
                          className="form-control border-2 rounded-3" 
                          placeholder="Leave a message here" 
                          id="message" 
                          style={{ height: '150px' }} 
                          required
                        ></textarea>
                        <label htmlFor="message" className="text-muted">Your Message</label>
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <motion.button
                        className="btn btn-modern w-100 py-3 d-flex align-items-center justify-content-center fw-bold"
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="spinner-border spinner-border-sm me-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message <FaPaperPlane className="ms-2" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
{/* Styles */}
<style jsx>{`
        .carousel-subtitle {
          letter-spacing: 2px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }
        .carousel-title {
          font-weight: 700;
          line-height: 1.2;
        }
        .carousel-text {
          color: rgba(255,255,255,0.9);
          max-width: 600px;
        }
        .carousel-wave {
          height: 80px;
          fill: #f8f9fa;
        }
        .form-control.border-2 {
          border-width: 2px !important;
          border-color: #dee2e6 !important;
        }
        .form-control.border-2:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
        }
        @media (max-width: 768px) {
          .carousel-wave {
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;