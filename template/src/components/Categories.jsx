import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCalendar, FaExclamationCircle, FaUsers, FaLaptop } from 'react-icons/fa';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'calendar':
        return <FaCalendar />;
      case 'exclamation-circle':
        return <FaExclamationCircle />;
      case 'users':
        return <FaUsers />;
      case 'laptop':
        return <FaLaptop />;
      default:
        return <FaCalendar />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/typologies');
        setCategories(response.data);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Titre avec soulignement bleu */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            marginBottom: '2rem',
            textAlign: 'center',
            position: 'relative',
            paddingBottom: '10px'
          }}
        >
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            <span style={{ color: '#000000' }}>SmartMeet</span>{' '}
            <span style={{ color: '#3b82f6' }}>Categories</span>
          </h1>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '4px',
            backgroundColor: '#3b82f6',
            borderRadius: '2px'
          }}></div>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '120px',
                marginBottom: '1rem',
                color: '#3b82f6',
                fontSize: '4rem'
              }}>
                {getIconComponent(category.icon)}
              </div>
              <h3 style={{ 
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>{category.title}</h3>
              <p style={{
                textAlign: 'center',
                color: '#666'
              }}>{category.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Categories;