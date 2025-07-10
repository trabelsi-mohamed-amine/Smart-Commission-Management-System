import React from 'react';
import { motion } from 'framer-motion';

const Service = () => {
  const services = [
    {
      id: 1,
      title: "Project Management",
      description: "Comprehensive project coordination and tracking for efficient team collaboration.",
      icon: "📊",
      color: "#3B82F6" // blue-500
    },
    {
      id: 2,
      title: "Financial Management",
      description: "Streamlined financial oversight and budget tracking for your projects.",
      icon: "💰", 
      color: "#10B981" // emerald-500
    },
    {
      id: 3,
      title: "Online Marketing",
      description: "Digital marketing strategies to enhance your project visibility.",
      icon: "📢",
      color: "#F59E0B" // amber-500
    }
  ];

  return (
    <div style={{
      padding: '5rem 1rem',
      background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Courbe décorative */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
        zIndex: 0
      }}>
        <svg viewBox="0 0 500 200" preserveAspectRatio="none" style={{
          width: '100%',
          height: '100%'
        }}>
          <path 
            d="M0,100 C150,200 350,0 500,100 L500,0 L0,0 Z" 
            fill="#3b82f6"
          />
        </svg>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* En-tête avec le style comme SmartMeet Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ 
            textAlign: 'center', 
            marginBottom: '3rem'
          }}
        >
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Our <span style={{
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Premium Services</span>
          </h1>
          <div style={{
            width: '6rem',
            height: '0.25rem',
            margin: '1rem auto 0',
            background: 'linear-gradient(90deg, #60a5fa, #8b5cf6)',
            borderRadius: '9999px'
          }}></div>
        </motion.div>
        
        {/* Grille de services */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.15
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              style={{
                position: 'relative',
                height: '100%',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                borderTop: `4px solid ${service.color}`,
                transition: 'all 0.3s ease'
              }}
            >
              {/* Icône */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '1.5rem'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: `${service.color}20`, // 20% opacity
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem'
                }}>
                  {service.icon}
                </div>
              </div>
              
              {/* Contenu */}
              <div style={{ 
                padding: '0 1.5rem 1.5rem',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.75rem'
                }}>{service.title}</h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '1.5rem',
                  lineHeight: '1.5'
                }}>{service.description}</p>
                
                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: service.color,
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Learn more
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ marginLeft: '0.5rem', transition: 'transform 0.3s ease' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;