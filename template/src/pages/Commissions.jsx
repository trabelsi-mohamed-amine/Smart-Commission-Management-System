import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const Commissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newCommission, setNewCommission] = useState({
    name: '',
    description: '',
    manager_id: ''
  });
  const [editingCommission, setEditingCommission] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for managing commission members
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [commissionMembers, setCommissionMembers] = useState([]);
  const [eligibleMembers, setEligibleMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [memberActionError, setMemberActionError] = useState(null);

  // Get user role from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  // Function to fetch commission managers
  const fetchManagers = () => {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:8000/api/managers/commission', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch managers');
        }
        return response.json();
      })
      .then(data => setManagers(data))
      .catch(error => {
        console.error('Error fetching managers:', error);
      });
  };

  // Récupérer les commissions au chargement du composant
  useEffect(() => {
    fetch('http://localhost:8000/api/commissions')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setCommissions(data))
      .catch(error => {
        console.error('There was an error fetching commissions!', error);
        setErrorMessage('Failed to load commissions');
      });
      
    // Fetch managers if user is administrator
    if (userRole === 'administrator') {
      fetchManagers();
    }
  }, [userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommission({ ...newCommission, [name]: value });
  };
  // Créer ou mettre à jour une commission
  const handleCreateOrUpdateCommission = (e) => {
    e.preventDefault();
    
    // Check if user is commission member before making API call
    if (userRole === 'commission_member') {
      setErrorMessage("Les membres de commission ne peuvent pas créer ou modifier les commissions.");
      return;
    }
    
    const url = editingCommission 
      ? `http://localhost:8000/api/commissions/${editingCommission.id}`
      : 'http://localhost:8000/api/commissions';

    const method = editingCommission ? 'PUT' : 'POST';
    
    // Get token from localStorage
    const token = localStorage.getItem('token');

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newCommission),
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Vous n\'avez pas les droits pour effectuer cette action.');
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (editingCommission) {
          setCommissions(commissions.map(commission => 
            commission.id === data.id ? data : commission
          ));
        } else {
          setCommissions([...commissions, data]);
        }        setNewCommission({
          name: '',
          description: '',
          manager_id: ''
        });
        setEditingCommission(null);
        setShowForm(false);
        setErrorMessage(null);
      })
      .catch(error => {
        console.error('There was an error creating or updating the commission!', error);
        setErrorMessage(error.message);
      });
  };
  const handleEditCommission = (commission) => {
    setNewCommission({
      name: commission.name,
      description: commission.description || '',
      manager_id: commission.manager_id || '',
    });
    setEditingCommission(commission);
    setShowForm(true);
  };
  const handleDeleteCommission = (id) => {
    // Check if user is commission member before making API call
    if (userRole === 'commission_member') {
      setErrorMessage("Les membres de commission ne peuvent pas supprimer les commissions.");
      return;
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commission ?')) {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      fetch(`http://localhost:8000/api/commissions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            if (response.status === 403) {
              throw new Error('Vous n\'avez pas les droits pour effectuer cette action.');
            }
            throw new Error('Network response was not ok');
          }
          setCommissions(commissions.filter(commission => commission.id !== id));
          setErrorMessage(null);
        })
        .catch(error => {
          console.error('There was an error deleting the commission!', error);
          setErrorMessage(error.message);
        });
    }
  };
  // Check if user is a commission member
  const isCommissionMember = userRole === 'commission_member';

  // Functions for managing commission members
  const fetchCommissionMembers = (commissionId) => {
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:8000/api/commissions/${commissionId}/members`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch commission members');
        }
        return response.json();
      })
      .then(data => {
        setCommissionMembers(data);
      })
      .catch(error => {
        console.error('Error fetching commission members:', error);
        setMemberActionError('Erreur lors de la récupération des membres');
      });
  };
  
  const fetchEligibleMembers = (commissionId) => {
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:8000/api/commissions/${commissionId}/eligible-members`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch eligible members');
        }
        return response.json();
      })
      .then(data => {
        setEligibleMembers(data);
      })
      .catch(error => {
        console.error('Error fetching eligible members:', error);
        setMemberActionError('Erreur lors de la récupération des membres éligibles');
      });
  };
  
  const addMember = () => {
    if (!selectedMember) {
      setMemberActionError('Veuillez sélectionner un membre');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:8000/api/commissions/${selectedCommission.id}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user_id: selectedMember })
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Vous n\'avez pas les droits pour effectuer cette action.');
          }
          throw new Error('Erreur lors de l\'ajout du membre');
        }
        return response.json();
      })
      .then(() => {
        fetchCommissionMembers(selectedCommission.id);
        fetchEligibleMembers(selectedCommission.id);
        setSelectedMember('');
        setMemberActionError(null);
      })
      .catch(error => {
        console.error('Error adding member:', error);
        setMemberActionError(error.message);
      });
  };
  
  const removeMember = (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer ce membre de la commission?')) {
      return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:8000/api/commissions/${selectedCommission.id}/members/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Vous n\'avez pas les droits pour effectuer cette action.');
          }
          throw new Error('Erreur lors de la suppression du membre');
        }
        return response.json();
      })
      .then(() => {
        fetchCommissionMembers(selectedCommission.id);
        fetchEligibleMembers(selectedCommission.id);
        setMemberActionError(null);
      })
      .catch(error => {
        console.error('Error removing member:', error);
        setMemberActionError(error.message);
      });
  };
  
  const openMembersModal = (commission) => {
    setSelectedCommission(commission);
    setShowMembersModal(true);
    fetchCommissionMembers(commission.id);
    fetchEligibleMembers(commission.id);
  };
  
  const closeMembersModal = () => {
    setShowMembersModal(false);
    setSelectedCommission(null);
    setCommissionMembers([]);
    setEligibleMembers([]);
    setSelectedMember('');
    setMemberActionError(null);
  };

  // Filter commissions based on search term
  const filteredCommissions = commissions.filter(commission => 
    commission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (commission.description && commission.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (managers.find(m => m.id === commission.manager_id)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-4">
      <h2 className="mb-4">Gestion des Commissions</h2>
      
      {errorMessage && (
        <div className="alert alert-danger mb-4" role="alert">
          {errorMessage}
        </div>
      )}
      
      {!isCommissionMember && (
        <div className="d-flex justify-content-end mb-3">
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setEditingCommission(null);
              setNewCommission({ name: '', description: '' });
              setShowForm(!showForm);
            }}
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
            {showForm ? 'Fermer le formulaire' : '+ Ajouter une commission'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              {editingCommission ? 'Modifier la Commission' : 'Nouvelle Commission'}
            </h5>

            <form onSubmit={handleCreateOrUpdateCommission}>
              <div className="mb-3">
                <label className="form-label">Nom de la commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={newCommission.name}
                  onChange={handleInputChange}
                  required
                />
              </div>              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={newCommission.description}
                  onChange={handleInputChange}
                />
              </div>

              {userRole === 'administrator' && (
                <div className="mb-3">
                  <label className="form-label">Commission Manager</label>
                  <select
                    className="form-control"
                    name="manager_id"
                    value={newCommission.manager_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a Manager</option>
                    {managers.map(manager => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} - {manager.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}<button 
                type="submit" 
                className="btn btn-success me-2"
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
                {editingCommission ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setEditingCommission(null);
                  setShowForm(false);
                }}
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
            </form>
          </div>
        </div>
      )}      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher une commission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Manager</th>
              <th className="text-center">{isCommissionMember ? 'Statut' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommissions.length > 0 ? (
              filteredCommissions.map(commission => (                <tr key={commission.id}>
                  <td>{commission.name}</td>
                  <td>{commission.description || 'Aucune description'}</td>
                  <td>
                    {commission.manager ? (
                      <span>{commission.manager.name}</span>
                    ) : (
                      <span className="text-muted">Non assigné</span>
                    )}
                  </td><td className="text-center">                    {!isCommissionMember ? (
                      <>
                        {userRole === 'administrator' && (
                          <button 
                            className="btn btn-sm btn-info me-2" 
                            onClick={() => openMembersModal(commission)}
                            style={{
                              backgroundColor: 'white',
                              color: '#0dcaf0',
                              borderColor: '#0dcaf0',
                              transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#0dcaf0';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = '#0dcaf0';
                            }}
                          >
                            Membres
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-warning me-2" 
                          onClick={() => handleEditCommission(commission)}
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
                          onClick={() => handleDeleteCommission(commission.id)}
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
                      </>
                    ) : (
                      <span className="text-muted">Accès en lecture uniquement</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Aucune commission trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for managing commission members */}
      {showMembersModal && selectedCommission && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Gestion des Membres - {selectedCommission.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeMembersModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {memberActionError && (
                  <div className="alert alert-danger" role="alert">
                    {memberActionError}
                  </div>
                )}
                
                <div className="row">
                  <div className="col-md-6">
                    <h6>Membres actuels</h6>
                    {commissionMembers.length > 0 ? (
                      <ul className="list-group">
                        {commissionMembers.map(member => (
                          <li key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {member.name} <small>({member.email})</small>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => removeMember(member.id)}
                            >
                              Retirer
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">Aucun membre dans cette commission</p>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <h6>Ajouter un nouveau membre</h6>
                    {eligibleMembers.length > 0 ? (
                      <div>
                        <div className="mb-3">
                          <select 
                            className="form-select"
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                          >
                            <option value="">Sélectionner un membre</option>
                            {eligibleMembers.map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name} ({member.email})
                              </option>
                            ))}
                          </select>
                        </div>
                        <button 
                          className="btn btn-primary"
                          onClick={addMember}
                          disabled={!selectedMember}
                        >
                          Ajouter à la commission
                        </button>
                      </div>
                    ) : (
                      <p className="text-muted">Aucun membre éligible disponible</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeMembersModal}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commissions;
