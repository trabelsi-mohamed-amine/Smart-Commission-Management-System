import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as FaIcons from 'react-icons/fa';

function Typologies() {
  const [typologies, setTypologies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'FaFolder', // Default icon
    color: '#3B82F6' // Default color - blue
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  
  // Get all available FA icons
  const iconOptions = useMemo(() => {
    return Object.keys(FaIcons)
      .filter(key => key.startsWith('Fa'))
      .sort();
  }, []);
  
  // Filtered icons based on search
  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions.slice(0, 20); // Show first 20 by default
    return iconOptions
      .filter(icon => icon.toLowerCase().includes(iconSearch.toLowerCase()))
      .slice(0, 50); // Limit to 50 results when searching
  }, [iconOptions, iconSearch]);

  const apiUrl = 'http://localhost:8000/api/typologies';

  useEffect(() => {
    fetchTypologies();
  }, []);

  const fetchTypologies = async () => {
    try {
      const res = await axios.get(apiUrl);
      setTypologies(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des typologies.");
    }
  };
  const handleIconChange = (e) => {
    setFormData({ ...formData, icon: e.target.value });
  };

  const handleColorChange = (e) => {
    setFormData({ ...formData, color: e.target.value });
  };
  
  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        color: formData.color
      };

      if (isEditing) {
        await axios.put(`${apiUrl}/${editId}`, dataToSubmit);
        toast.success("Typologie modifiée avec succès !");
      } else {
        await axios.post(apiUrl, dataToSubmit);
        toast.success("Typologie ajoutée avec succès !");
      }
      fetchTypologies();
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la typologie.");
      console.error(error);
    }
  };

  const handleEdit = (typology) => {
    setFormData({
      title: typology.title,
      description: typology.description,
      icon: typology.icon || 'FaFolder',
      color: typology.color || '#3B82F6'
    });
    setEditId(typology.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette typologie ?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        toast.info("Typologie supprimée.");
        fetchTypologies();
      } catch (error) {
        toast.error("Erreur lors de la suppression de la typologie.");
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      icon: 'FaFolder',
      color: '#3B82F6'
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
    setIconSearch('');
  };

  return (
    <div className="py-4 px-3">
      <h2>Gestion des Typologies</h2>      <div className="text-end mb-3">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: 'white',
            color: '#0d6efd',
            borderColor: '#0d6efd',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0d6efd';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#0d6efd';
          }}
        >
          {showForm ? "Fermer" : "+ Ajouter une typologie"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>{isEditing ? "Modifier la typologie" : "Nouvelle Typologie"}</h5>
            <div className="mb-2">
              <label>Titre</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Description</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>            <div className="mb-2">
              <label>Icône</label>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  backgroundColor: `${formData.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {FaIcons[formData.icon] ? 
                    React.createElement(FaIcons[formData.icon], {style: {color: formData.color}}) : 
                    <i className="fas fa-folder" style={{color: formData.color}}></i>
                  }
                </div>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Rechercher une icône..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                />
              </div>
              <div className="border p-2 rounded" style={{maxHeight: '200px', overflowY: 'auto'}}>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {filteredIcons.map((iconName) => (
                    <div 
                      key={iconName}
                      onClick={() => setFormData({...formData, icon: iconName})}
                      style={{
                        cursor: 'pointer',
                        padding: '10px',
                        border: formData.icon === iconName ? `2px solid ${formData.color}` : '1px solid #dee2e6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: formData.icon === iconName ? `${formData.color}10` : 'transparent',
                      }}
                      title={iconName}
                    >
                      {React.createElement(FaIcons[iconName], { size: 18 })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label>Couleur</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div><button 
              className="btn btn-success me-2" 
              onClick={handleSubmit}
              style={{
                backgroundColor: 'white',
                color: '#198754',
                borderColor: '#198754',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#198754';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#198754';
              }}
            >
              {isEditing ? "Mettre à jour" : "Enregistrer"}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={resetForm}
              style={{
                backgroundColor: 'white',
                color: '#6c757d',
                borderColor: '#6c757d',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#6c757d';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#6c757d';
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Image</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {typologies.map((typology) => (
              <tr key={typology.id}>                <td>{typology.id}</td>
                <td>{typology.title}</td>
                <td>{typology.description}</td>
                <td>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: `${typology.color || '#3B82F6'}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {typology.icon && FaIcons[typology.icon] ? 
                        React.createElement(FaIcons[typology.icon], {style: {color: typology.color || '#3B82F6'}}) :
                        typology.img ? (
                          <img 
                            src={`http://localhost:8000/storage/${typology.img}`} 
                            alt={typology.title} 
                            style={{ maxHeight: '30px' }} 
                          />
                        ) : (
                          <i className="fas fa-folder" style={{color: '#3B82F6'}}></i>
                        )
                      }
                    </div>
                    <span>{typology.icon || (typology.img ? 'Image personnalisée' : 'Aucune icône')}</span>
                  </div>
                </td><td className="text-center">
                  <button 
                    className="btn btn-sm btn-warning me-2" 
                    onClick={() => handleEdit(typology)}
                    style={{
                      backgroundColor: 'white',
                      color: '#ffc107',
                      borderColor: '#ffc107',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffc107';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#ffc107';
                    }}
                  >
                    Modifier
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(typology.id)}
                    style={{
                      backgroundColor: 'white',
                      color: '#dc3545',
                      borderColor: '#dc3545',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc3545';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#dc3545';
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {typologies.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Aucune typologie trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Typologies;