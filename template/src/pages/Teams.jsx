import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Charger les membres
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/teams');
      setTeamMembers(response.data);
    } catch (err) {
      setError("Erreur de chargement des membres");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', formData.role);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingId) {
        // Mode édition
        await axios.post(`http://127.0.0.1:8000/api/teams/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Mode création
        await axios.post('http://127.0.0.1:8000/api/teams', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchTeamMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      image: null
    });
    setImagePreview(member.image.startsWith('http') ? member.image : `/img/${member.image}`);
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce membre ?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/teams/${id}`);
        fetchTeamMembers();
      } catch (err) {
        setError("Erreur lors de la suppression");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', image: null });
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  // Animations
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    hover: { y: -10 }
  };

  const imageHover = { scale: 1.05 };

  return (
    <div style={{ padding: '4rem 1rem', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Notre Équipe</h2>          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#3b82f6';
            }}
          >
            {showForm ? 'Annuler' : '+ Ajouter un membre'}
          </button>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              marginBottom: '2rem'
            }}
          >
            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
              {editingId ? 'Modifier le membre' : 'Ajouter un nouveau membre'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b' }}>Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b' }}>Rôle</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b' }}>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%' }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover',
                        borderRadius: '0.5rem'
                      }} 
                    />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: loading ? '#e2e8f0' : 'white',
                    color: loading ? '#64748b' : '#10b981',
                    border: '1px solid #10b981',
                    borderRadius: '0.5rem',
                    cursor: loading ? 'default' : 'pointer',
                    fontWeight: '600',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = '#10b981';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#10b981';
                    }
                  }}
                >
                  {loading ? 'En cours...' : editingId ? 'Mettre à jour' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #64748b',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#64748b';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#64748b';
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {teamMembers.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Aucun membre disponible</p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={item}
                whileHover="hover"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  textAlign: 'center'
                }}
              >
                <motion.div
                  whileHover={imageHover}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={member.image.startsWith('http') ? member.image : `/img/${member.image}`}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </motion.div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  {member.name}
                </h3>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>{member.role}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>                  <button
                    onClick={() => handleEdit(member)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'white',
                      color: '#f59e0b',
                      border: '1px solid #f59e0b',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#f59e0b';
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'white',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Teams;