import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderOfDay = () => {
  const { commissionId } = useParams();
  const [commission, setCommission] = useState(null);
  const [orderOfDay, setOrderOfDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
    
    const fetchCommission = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Vous devez être connecté pour accéder à cette page');
        }
        
        const response = await fetch(`http://localhost:8000/api/commissions/${commissionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données de la commission');
        }
        
        const data = await response.json();
        setCommission(data);
        setOrderOfDay(data.order_of_day || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching commission:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchCommission();
  }, [commissionId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/commissions/${commissionId}/order-of-day`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order_of_day: orderOfDay })
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Vous n\'avez pas l\'autorisation de modifier l\'ordre du jour');
        } else {
          throw new Error('Une erreur est survenue lors de la mise à jour de l\'ordre du jour');
        }
      }
      
      const data = await response.json();
      setSuccess('Ordre du jour mis à jour avec succès');
      setCommission(data.commission);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating order of day:', error);
      setError(error.message);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des données de la commission...</p>
      </div>
    );
  }
  
  // Check if user is authorized to edit (commission manager or admin)
  const canEdit = userRole === 'commission_manager' || userRole === 'administrator';
  
  return (
    <div className="py-4">
      <h2 className="mb-4">Ordre du jour - {commission?.name}</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Gestion de l'ordre du jour</h5>
          
          {canEdit ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="orderOfDay" className="form-label">Ordre du jour</label>
                <textarea
                  id="orderOfDay"
                  className="form-control"
                  rows="10"
                  value={orderOfDay}
                  onChange={(e) => setOrderOfDay(e.target.value)}
                  placeholder="Saisissez l'ordre du jour de la commission..."
                  required
                />
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
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
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {orderOfDay ? (
                <div className="p-3 bg-light rounded">
                  <h6>Ordre du jour actuel :</h6>
                  <div className="mt-2" style={{whiteSpace: 'pre-wrap'}}>
                    {orderOfDay}
                  </div>
                </div>
              ) : (
                <div className="alert alert-info">
                  Aucun ordre du jour n'a été défini pour cette commission.
                </div>
              )}
              
              {userRole === 'commission_member' && (
                <div className="mt-4 text-muted small">
                  <em>Note: Seuls les gestionnaires de commission peuvent modifier l'ordre du jour.</em>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderOfDay;
