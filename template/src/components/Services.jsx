import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

const Services = () => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchModules = async () => {
      try {
        // Add axios configuration for CORS
        const response = await axios.get('http://localhost:8000/api/modules', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          withCredentials: false
        });
        setModules(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des modules :', err);
        setError('Impossible de charger les modules. Erreur : ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* En-tête avec titre "Nos" en noir et "Modules" en bleu */}
      <header className="section-header">
        <h2 className="section-title">
          <span className="black-text">Nos</span>{' '}
          <span className="blue-text">Modules</span>
        </h2>
        <div className="title-underline"></div>
      </header>      {/* Conteneur des cartes avec Swiper */}
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="modules-swiper"
      >
        {modules.map((module) => {
          const Icon = FaIcons[module.icon] || FaIcons.FaCog;
          return (
            <SwiperSlide key={module.id}>
              <div className="module-card">              {/* Cercle de l'icône */}
              <div className="icon-container" style={{ backgroundColor: `${module.color}20` }}>
                <Icon className="module-icon" style={{ color: module.color }} />
              </div>

              {/* Contenu texte */}
              <div className="card-content">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
              </div>

              {/* Bouton d'action */}
              <a href={`/modules/${module.id}`} className="action-button">
                En savoir plus
                <svg className="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Styles CSS-in-JS */}
      <style jsx>{`
        .services-page {
          padding: 5rem 2rem;
          background-color: #f8fafc;
          min-height: 100vh;
          width: 100%;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }
        
        .section-title {
          font-size: 2.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }
        
        .black-text {
          color: #1e293b; /* Noir */
        }
        
        .blue-text {
          color: #3b82f6; /* Bleu */
        }
        
        .title-underline {
          height: 5px;
          width: 100px;
          background-color: #3b82f6;
          border-radius: 3px;
          margin: 0 auto;
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
        }
          .modules-swiper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .swiper-slide {
          display: flex;
          justify-content: center;
        }

        .module-card {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          min-height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .icon-container {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          transition: transform 0.3s ease;
        }
        
        .module-icon {
          font-size: 2.25rem;
        }
        
        .card-content {
          margin-bottom: 2rem;
          flex-grow: 1;
        }
        
        .module-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.25rem;
        }
        
        .module-description {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.7;
        }
        
        .action-button {
          color: #3b82f6;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-size: 1.05rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: 2px solid #3b82f6;
          transition: all 0.3s ease;
        }
        
        .action-button:hover {
          background-color: #3b82f6;
          color: white;
        }
        
        .arrow-icon {
          margin-left: 0.75rem;
          width: 1.1rem;
          height: 1.1rem;
          transition: transform 0.3s ease;
        }
        
        .action-button:hover .arrow-icon {
          transform: translateX(5px);
          stroke: white;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        
        .loading-spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3b82f6;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }
        
        .retry-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .retry-button:hover {
          background-color: #2563eb;
        }

        /* Swiper custom styles */
        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: #3b82f6;
          background: white;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        :global(.swiper-button-next:after),
        :global(.swiper-button-prev:after) {
          font-size: 1.2rem;
        }

        :global(.swiper-pagination-bullet) {
          background: #3b82f6;
          opacity: 0.5;
        }

        :global(.swiper-pagination-bullet-active) {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .modules-swiper {
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          :global(.swiper-slide) {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Services;