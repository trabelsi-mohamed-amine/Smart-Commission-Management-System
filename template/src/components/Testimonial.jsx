import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Secretary",
    role: "Administrative Secretary",
    content: "SmartMeet made our commission meetings faster and more organized. The auto-generated minutes are a game changer!",
    img: "/img/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "HR Manager",
    role: "HR Director",
    content: "As a secretary, planning and sharing meetings has never been easier. Great tool for team collaboration!",
    img: "/img/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Commission Member",
    role: "Project Manager",
    content: "The platform helped us streamline internal communication and manage our schedules efficiently.",
    img: "/img/testimonial-3.jpg"
  },
  {
    id: 4,
    name: "Chairperson",
    role: "Board Chair",
    content: "We've saved hours of administrative work thanks to SmartMeet. Highly recommended for structured teams!",
    img: "/img/testimonial-4.jpg"
  }
];

const Testimonial = () => {
  const controls = useAnimation();
  const [isPaused, setIsPaused] = useState(false);
  const [currentTestimonials, setCurrentTestimonials] = useState([...testimonials]);

  useEffect(() => {
    let animation;
    
    const startAnimation = async () => {
      while (!isPaused) {
        await controls.start({
          x: '-100%',
          transition: { duration: 40, ease: "linear" }
        });
        
        setCurrentTestimonials(prev => {
          const [first, ...rest] = prev;
          return [...rest, first];
        });
        
        await controls.set({ x: '0%' });
      }
    };

    if (!isPaused) {
      startAnimation();
    }

    return () => {
      controls.stop();
    };
  }, [isPaused, controls]);

  return (
    <div className="position-relative w-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="position-relative mb-5 text-center">
          <h1 className="display-5 fw-bold mb-3">
            <span className="d-inline-block position-relative">
              What Our Clients Say
              <svg viewBox="0 0 200 20" className="position-absolute bottom-0 start-0 w-100" style={{ height: '8px' }}>
                <path d="M0,10 C30,15 70,5 100,10 C130,15 170,5 200,10" 
                      stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <br />
            <span className="text-gradient-primary">Testimonials</span>
          </h1>
        </div>
        
        <div className="overflow-hidden py-3 position-relative">
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(90deg, rgba(248,249,250,1) 0%, rgba(248,249,250,0) 5%, rgba(248,249,250,0) 95%, rgba(248,249,250,1) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}></div>
          
          <motion.div
            className="d-flex"
            animate={controls}
            style={{ width: 'max-content' }}
          >
            {currentTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${index}`}
                className="mx-3"
                style={{ maxWidth: '300px' }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsPaused(!isPaused)}
              >
                <div className="testimonial-item bg-white rounded-4 p-4 shadow h-100" 
                     style={{ 
                       borderBottom: "4px solid #3b82f6",
                       cursor: 'pointer'
                     }}>
                  <div className="d-flex align-items-center mb-4">
                    <img
                      src={testimonial.img}
                      className="img-fluid rounded-circle flex-shrink-0"
                      alt={testimonial.name}
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover',
                        border: "3px solid #e0e7ff"
                      }}
                    />
                    <div className="ms-3">
                      <h6 className="mb-1 fw-bold">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-warning mb-3">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                    <p className="mb-0 fst-italic">"{testimonial.content}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .text-gradient-primary {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .testimonial-item {
          transition: all 0.3s ease;
        }
        .testimonial-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Testimonial;