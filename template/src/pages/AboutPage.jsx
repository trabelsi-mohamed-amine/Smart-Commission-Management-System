import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Team from "../components/Team";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const About = () => {
  const features = [
    "Commission Management",
    "Simplified Meeting Scheduling",
    "International Certificate",
    "Automated Minutes Generation",
    "Effective Tracking and Collaboration",
    "Intuitive Web Application"
  ];

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Meeting Participation',
        data: [120, 135, 148, 165, 152, 140, 155, 168, 172, 160, 175, 182],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { 
        enabled: true,
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: { 
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 11 } }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="about-page">
      {/* Hero Section - Similaire au carousel d'accueil */}
      <div className="carousel-container position-relative">
        <div 
          className="carousel-slide position-relative" 
          style={{ 
            background: `linear-gradient(rgba(26, 54, 93, 0.85), rgba(26, 54, 93, 0.85)), url(/img/meeting-hero.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80vh',
            minHeight: '500px'
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
                About SmartMeet
              </h5>
              <h1 className="display-4 mb-4 carousel-title">
                Revolutionizing Meeting Management
              </h1>
              <p className="fs-5 mb-5 carousel-text">
                Discover how SmartMeet transforms your meeting experience with innovative solutions for commission management and collaboration.
              </p>
              <div className="d-flex gap-3 carousel-buttons">
                <motion.a
                  href="/contact"
                  className="btn btn-primary py-3 px-4 rounded-pill carousel-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.a>
                <motion.a
  href="/features"
  className="btn carousel-button"
  whileHover={{ 
    scale: 1.05,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }}
  whileTap={{ scale: 0.95 }}
  style={{
    position: 'relative',
    fontWeight: 600,
    letterSpacing: '0.8px',
    minWidth: '160px',
    textAlign: 'center',
    borderRadius:  '50px !important',
    padding: '12px 30px',
    overflow: 'hidden',
    zIndex: 1,
    border: '10px solid white',
    fontSize: '1rem',
    textTransform: 'uppercase',
    background: 'transparent',
    color: 'white',
    transition: 'all 0.3s ease',
   
  }}
>
  Our Features
</motion.a>
              </div>
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

      {/* Main Content Section - Similaire à l'accueil */}
      <div className="position-relative py-5 w-100" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container position-relative z-1">
          <div className="row g-5 align-items-center">
            {/* Left Column - Enlarged Chart Card */}
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="position-relative h-100 rounded-4 bg-white p-5 shadow-lg" style={{ minHeight: '400px' }}>
                <h3 className="text-primary fw-bold mb-4">Meeting Participation Analytics</h3>
                <div className="position-relative" style={{ height: '300px', marginBottom: '1.5rem' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="bg-blue-50 p-3 rounded-3">
                    <p className="text-muted mb-1 small">Monthly average</p>
                    <h4 className="text-primary mb-0">158 participants</h4>
                  </div>
                  <div className="bg-green-50 p-3 rounded-3">
                    <p className="text-muted mb-1 small">Growth rate</p>
                    <h4 className="text-success mb-0">+18%</h4>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column (Content) */}
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="position-relative mb-5">
                <h1 className="display-5 fw-bold mb-3">
                  <span className="d-inline-block position-relative">
                    About
                    <svg 
                      viewBox="0 0 200 20" 
                      className="position-absolute bottom-0 start-0 w-100"
                      style={{ height: '8px' }}
                    >
                      <path 
                        d="M0,10 C30,15 70,5 100,10 C130,15 170,5 200,10" 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <br />
                  <span className="text-gradient-primary">SmartMeet</span>
                </h1>
              </div>

              <p className="mb-4 lead text-muted">
                SmartMeet is an innovative solution that streamlines commission management, meeting scheduling, and minutes generation, providing a collaborative and efficient experience for teams.
              </p>
              
              {/* Features Grid */}
              <div className="row gy-3 gx-4 mb-4">
                {features.map((feature, index) => (
                  <motion.div 
                    className="col-sm-6"
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 bg-primary text-white rounded-3 p-2 me-3">
                        <FaCheck className="fs-6" />
                      </div>
                      <p className="mb-0">{feature}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Join Us Button */}
              <motion.a
                href="/contact"
                className="btn-join-us"
                whileHover={{ 
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0, 110, 255, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us <FaArrowRight className="ms-2" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
 {/* Stats Section */}
 <div className="w-100 bg-primary text-white py-5 px-0">
        <div className="container">
          <div className="row g-4">
            {[
              { number: "50+", label: "Commissions managed" },
              { number: "1000+", label: "Meetings organized" },
              { number: "95%", label: "Client satisfaction" },
              { number: "24/7", label: "Support available" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="col-lg-3 col-md-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="display-4 fw-bold mb-2">{stat.number}</h2>
                <p className="mb-0 text-white-50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Team Section - Utilisation du composant existant */}
      <Team />

     

      {/* Styles */}
      <style jsx>{`
        .text-gradient-primary {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .btn-join-us {
          background: linear-gradient(135deg, #00BFFF, #0066FF);
          color: white;
          border-radius: 30px;
          padding: 12px 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 110, 255, 0.2);
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .btn-join-us:hover {
          background: linear-gradient(135deg, #0066FF, #00BFFF);
          color: white;
        }
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
        @media (max-width: 768px) {
          .carousel-wave {
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;