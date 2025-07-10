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
    <div className="position-relative w-100" style={{ backgroundColor: '#f8f9fa' }}>
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
                  Revolutionizing
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
                <span className="text-gradient-primary">Meeting Management</span>
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
      `}</style>
    </div>
  );
};

export default About;