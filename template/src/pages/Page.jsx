import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ServicePage = () => {
  const services = [
    {
      id: 1,
      img: "projet.jpg",
      title: "Project Management",
      description: "Streamline your project coordination with our comprehensive management tools designed specifically for commission work",
      rating: 5,
      membres: 10,
      price: "$149.00",
      instructor: "Chedi",
      icon: "📊",
      color: "#3B82F6",
      features: [
        "Commission task tracking",
        "Document sharing",
        "Progress monitoring",
        "Automated reporting"
      ]
    },
    {
      id: 2,
      img: "finance.webp",
      title: "Financial Oversight",
      description: "Track budgets and expenses with our financial oversight system tailored for commission needs",
      rating: 4,
      membres: 12,
      price: "$129.00",
      instructor: "Ahlem",
      icon: "💰",
      color: "#10B981",
      features: [
        "Budget allocation",
        "Expense approval workflows",
        "Financial reporting",
        "Audit trails"
      ]
    },
    {
      id: 3,
      img: "mark.webp",
      title: "Meeting Optimization",
      description: "Boost your commission's productivity with our meeting management solutions",
      rating: 5,
      membres: 10,
      price: "$159.00",
      instructor: "Omayma",
      icon: "📢",
      color: "#F59E0B",
      features: [
        "Automated minutes",
        "Agenda builder",
        "Action item tracking",
        "Follow-up reminders"
      ]
    },
  ];

  const testimonials = [
    {
      image: 'testimonial-1.jpg',
      name: 'Secretary',
      profession: 'Administrative Secretary',
      text: 'SmartMeet made our commission meetings faster and more organized. The auto-generated minutes are a game changer!',
    },
    {
      image: 'testimonial-2.jpg',
      name: 'HR Manager',
      profession: 'HR Director',
      text: 'As a secretary, planning and sharing meetings has never been easier. Great tool for team collaboration!',
    },
    {
      image: 'testimonial-3.jpg',
      name: 'Commission Member',
      profession: 'Project Manager',
      text: 'The platform helped us streamline internal communication and manage our schedules efficiently.',
    },
    {
      image: 'testimonial-4.jpg',
      name: 'Chairperson',
      profession: 'Board Chair',
      text: 'We\'ve saved hours of administrative work thanks to SmartMeet. Highly recommended for structured teams!',
    },
  ];

  const categories = [
    {
      id: 1,
      title: "Project Coordination",
      img: "/img/cat-1.jpg",
      description: "Manage all aspects of commission projects in one place"
    },
    {
      id: 2,
      title: "Team Scheduling",
      img: "/img/cat-2.jpg",
      description: "Coordinate meeting times across multiple members"
    },
    {
      id: 3,
      title: "Automated Minutes",
      img: "/img/cat-3.jpg",
      description: "Generate professional meeting records automatically"
    },
    {
      id: 4,
      title: "Meeting Planning",
      img: "/img/cat-4.jpg",
      description: "Prepare and distribute agendas efficiently"
    }
  ];

  const carouselSlides = [
    {
      img: '/img/meeting-hero.jpg',
      subtitle: 'SmartMeet Professional Services',
      title: 'Enhance Your Commission Workflow',
      text: 'Discover our specialized services designed to streamline meeting management and commission coordination',
      buttons: [
        { text: 'View Services', url: '#services', variant: 'primary' },
        { text: 'Contact Us', url: '/contact', variant: 'outline-light' }
      ]
    },
    {
      img: '/img/meeting-2.jpg',
      subtitle: 'Optimized for Commissions',
      title: 'Tailored Solutions for Your Needs',
      text: 'Our services are specifically designed to address the unique challenges of commission work',
      buttons: [
        { text: 'Learn More', url: '/about', variant: 'primary' },
      ]
    },
  ];

  return (
    <div className="service-page">
      {/* Hero Carousel - Consistent with Homepage */}
      <div className="carousel-container position-relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={{ 
            delay: 5000,
            disableOnInteraction: false 
          }}
          loop
          speed={1000}
          effect="fade"
          className="mySwiper"
        >
          {carouselSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div 
                className="carousel-slide position-relative" 
                style={{ 
                  background: `linear-gradient(rgba(26, 54, 93, 0.85), rgba(26, 54, 93, 0.85)), url(${slide.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '80vh',
                  minHeight: '500px'
                }}
              >
                <div className="container h-100 d-flex align-items-center">
                  <div className="text-white carousel-content">
                    <h5 className="text-uppercase mb-3 carousel-subtitle">
                      {slide.subtitle}
                    </h5>
                    <h1 className="display-4 mb-4 carousel-title">
                      {slide.title}
                    </h1>
                    <p className="fs-5 mb-5 carousel-text">{slide.text}</p>
                    <div className="d-flex gap-3 carousel-buttons">
                      {slide.buttons.map((button, btnIndex) => (
                        <Link
                          key={btnIndex}
                          to={button.url}
                          className={`btn btn-${button.variant} py-3 px-4 rounded-pill carousel-button`}
                        >
                          {button.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
        
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

      {/* Categories Section - Enhanced from Homepage */}
      <section className="w-100 py-5 position-relative bg-light" id="services">
        <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden z-0">
          <svg viewBox="0 0 500 200" className="position-absolute top-0 start-0 w-100 h-auto" style={{ opacity: 0.1 }}>
            <path d="M0,100 C150,200 350,0 500,100 L500,0 L0,0 Z" fill="#3b82f6"/>
          </svg>
        </div>

        <div className="container position-relative z-1">
          <div className="position-relative mb-5 text-center">
            <h1 className="display-5 fw-bold mb-3">
              <span className="d-inline-block position-relative">
                Our Service
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
              <span className="text-gradient-primary">Categories</span>
            </h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Specialized solutions designed specifically for commission and meeting management needs
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-7 col-md-6">
              <div className="row g-3">
                {categories.slice(0, 3).map((category, index) => (
                  <motion.div
                    key={category.id}
                    className={`col-lg-${index === 0 ? "12" : "6"} col-md-12`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="position-relative rounded-4 overflow-hidden shadow-sm h-100"
                    >
                      <img 
                        className="img-fluid w-100" 
                        src={category.img} 
                        alt={category.title}
                        style={{ height: index === 0 ? '200px' : '150px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute bottom-0 start-0 end-0 p-4 bg-gradient-dark-transparent">
                        <h5 className="text-white mb-1">{category.title}</h5>
                        <p className="text-white-50 mb-0 small">{category.description}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div
              className="col-lg-5 col-md-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="position-relative h-100 rounded-4 overflow-hidden shadow-sm"
              >
                <img
                  className="img-fluid w-100 h-100 object-cover"
                  src={categories[3].img}
                  alt={categories[3].title}
                />
                <div className="position-absolute bottom-0 start-0 end-0 p-4 bg-gradient-dark-transparent">
                  <h5 className="text-white mb-1">{categories[3].title}</h5>
                  <p className="text-white-50 mb-0 small">{categories[3].description}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="w-100 py-5" style={{ background: 'linear-gradient(to bottom, #f9fafb, #ffffff)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h1 className="display-5 fw-bold mb-3">
              <span className="d-inline-block position-relative">
                Our Premium
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
              <span className="text-gradient-primary">Service Packages</span>
            </h1>
            <div className="w-100 mx-auto" style={{ maxWidth: '600px' }}>
              <p className="lead text-muted">
                Comprehensive solutions designed specifically for commission and meeting management needs
              </p>
            </div>
          </motion.div>
          
          <div className="row g-4 justify-content-center">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="col-lg-4 col-md-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="card h-100 border-0 shadow-sm overflow-hidden hover-scale"
                  style={{ borderTop: `4px solid ${service.color}` }}
                >
                  <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                    <img 
                      className="img-fluid w-100 h-100 object-cover" 
                      src={`/img/${service.img}`} 
                      alt={service.title}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-dark rounded-pill px-3 py-2">
                        {service.price}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-dark-transparent">
                      <h5 className="text-white mb-0">{service.title}</h5>
                    </div>
                  </div>
                  
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="icon-lg rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ backgroundColor: `${service.color}20` }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">{service.title}</h5>
                        <small className="text-muted">By {service.instructor}</small>
                      </div>
                    </div>
                    
                    <p className="text-muted mb-4">{service.description}</p>
                    
                    <ul className="mb-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="mb-2 d-flex align-items-center">
                          <i className="fas fa-check-circle me-2" style={{ color: service.color }}></i>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div>
                        {[...Array(service.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-warning"></i>
                        ))}
                        <small className="ms-1">({service.membres} members)</small>
                      </div>
                      <Link 
                        to="/contact" 
                        className="btn btn-sm btn-primary rounded-pill px-4"
                        style={{ backgroundColor: service.color, borderColor: service.color }}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 {/* CTA Section - Enhanced */}
 <section className="w-100 py-5 bg-gradient-primary text-white position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden z-0">
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{
            background: 'url(/img/pattern-1.png)',
            opacity: 0.1
          }}></div>
        </div>
        
        <div className="container text-center position-relative z-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="display-5 fw-bold mb-4">Ready to Transform Your Commission Meetings?</h2>
            <p className="lead mb-5 opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
              Join hundreds of teams who improved their productivity and streamlined their workflow with SmartMeet
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contact" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold">
                  Get Started Now <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/demo" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold">
                  Request Demo
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Testimonials Section - Consistent with Homepage */}
      <section className="w-100 py-5 bg-light">
        <div className="container">
          <div className="position-relative mb-5 text-center">
            <h1 className="display-5 fw-bold mb-3">
              <span className="d-inline-block position-relative">
                Client Experiences
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
              <span className="text-gradient-primary">Testimonials</span>
            </h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Hear from professionals who transformed their commission workflow with SmartMeet
            </p>
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
              animate={{
                x: ['0%', '-100%'],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ width: 'max-content' }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.name}-${index}`}
                  className="mx-3"
                  style={{ maxWidth: '300px' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="testimonial-item bg-white rounded-4 p-4 shadow h-100" 
                       style={{ 
                         borderBottom: "4px solid #3b82f6",
                         cursor: 'pointer'
                       }}>
                    <div className="d-flex align-items-center mb-4">
                      <img
                        src={`/img/${testimonial.image}`}
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
                        <small className="text-muted">{testimonial.profession}</small>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-warning mb-3">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      </div>
                      <p className="mb-0 fst-italic">"{testimonial.text}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

     

      {/* Styles */}
      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        
        .text-gradient-primary {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline;
        }
        
        .icon-lg {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hover-scale {
          transition: all 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        
        .bg-gradient-dark-transparent {
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }
        
        .carousel-wave {
          fill: #ffffff;
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

export default ServicePage;