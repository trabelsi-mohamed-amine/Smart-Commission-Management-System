import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFileAlt, FaUsers, FaClipboardList, FaCheckCircle, FaClock, FaCalendarAlt, FaChartBar, FaBell, FaSearch } from 'react-icons/fa';

function Modules() {
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    icon: 'FaFileAlt', // Match the seeder default icon format
    title: '',
    description: '',
    color: '#ffffff', // Match database default
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Update API URL to match Laravel convention
  const apiUrl = 'http://localhost:8000/api/modules';

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get(apiUrl);
      setModules(res.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error("Erreur lors du chargement des modules.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title) {
        toast.error("Le titre est requis.");
        return;
      }

      const payload = {
        ...formData,
        icon: formData.icon || null,
        color: formData.color || '#ffffff'
      };

      if (isEditing) {
        await axios.put(`${apiUrl}/${editId}`, payload);
        toast.success("Module modifié avec succès!");
      } else {
        await axios.post(apiUrl, payload);
        toast.success("Module ajouté avec succès!");
      }
      fetchModules();
      resetForm();
    } catch (error) {
      console.error('Error saving module:', error);
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        Object.values(validationErrors).forEach(errorMessages => {
          errorMessages.forEach(message => toast.error(message));
        });
      } else {
        toast.error("Une erreur s'est produite lors de l'enregistrement.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        toast.success("Module supprimé avec succès.");
        fetchModules();
      } catch (error) {
        console.error('Error deleting module:', error);
        toast.error("Erreur lors de la suppression du module.");
      }
    }
  };

  const handleEdit = (module) => {
    setFormData({
      icon: module.icon,
      title: module.title,
      description: module.description,
      color: module.color,
    });
    setIsEditing(true);
    setEditId(module.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      icon: 'FaFileAlt', // Réinitialiser à l'icône "rapport" par défaut
      title: '',
      description: '',
      color: '#ffffff',
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  // Enhanced icon map to match seeder data
  const iconMap = {
    'FaFileAlt': <FaFileAlt />,
    'FaUsers': <FaUsers />,
    'FaClipboardList': <FaClipboardList />,
    'FaCheckCircle': <FaCheckCircle />,
    'FaClock': <FaClock />,
    'FaCalendarAlt': <FaCalendarAlt />,
    'FaChartBar': <FaChartBar />,
    'FaBell': <FaBell />
  };

  // Filter modules based on search term
  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (module.description && module.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="py-4 px-3">
      <h2>Gestion des Modules</h2>      <div className="text-end mb-3">
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
          {showForm ? "Fermer" : "+ Ajouter un module"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>{isEditing ? "Modifier le module" : "Nouveau Module"}</h5>
            <div className="mb-2">
              <label>Icône</label>
              <select
                className="form-control"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              >
                <option value="FaCalendarAlt">Calendrier</option>
                <option value="FaUsers">Utilisateurs</option>
                <option value="FaFileAlt">Document</option>
                <option value="FaCheckCircle">Validation</option>
                <option value="FaChartBar">Statistiques</option>
                <option value="FaBell">Notification</option>
                <option value="FaClipboardList">Liste</option>
                <option value="FaClock">Horloge</option>
              </select>
            </div>
            <div className="mb-2">
              <label>Titre<span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-2">
              <label>Description</label>
              <textarea
                className="form-control"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
            <div className="mb-2">
              <label>Couleur</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>            <button 
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

      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par titre ou description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Icône</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Couleur</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((m) => (
              <tr key={m.id}>
                <td className="text-center">
                  <span style={{ color: m.color }}>
                    {iconMap[m.icon] || <FaFileAlt />}
                  </span>
                </td>
                <td>{m.title}</td>
                <td>{m.description}</td>
                <td>
                  <div
                    style={{
                      backgroundColor: m.color,
                      width: '30px',
                      height: '20px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  ></div>
                </td>                <td className="text-center">
                  <button 
                    className="btn btn-sm"
                    onClick={() => handleEdit(m)}
                    style={{
                      backgroundColor: 'white',
                      color: '#ffc107',
                      borderColor: '#ffc107',
                      marginRight: '0.5rem',
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
                    className="btn btn-sm"
                    onClick={() => handleDelete(m.id)}
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
            {filteredModules.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Aucun module trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Modules;
