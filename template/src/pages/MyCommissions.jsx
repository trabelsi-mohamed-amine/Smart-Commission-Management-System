import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyCommissions = () => {
  const [myCommissions, setMyCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');

  // Fetch user's commissions
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Vous devez être connecté pour voir vos commissions');
      setLoading(false);
      return;
    }
    
    // Get user role from localStorage for debugging
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;
    setUserRole(role);
    console.log('User role:', role);
    
    fetch('http://localhost:8000/api/user/my-commissions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('API response status:', response.status);
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Erreur d\'autorisation: Votre rôle n\'a pas accès à cette ressource');
          } else {
            throw new Error('Erreur lors de la récupération de vos commissions');
          }
        }
        return response.json();
      })
      .then(data => {
        setMyCommissions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user commissions:', error);
        console.error('User role when error occurred:', role);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement de vos commissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <h2 className="mb-4">
        {userRole === 'commission_manager' 
          ? "Commissions que je gère" 
          : "Mes Commissions"
        }
      </h2>
      {myCommissions.length === 0 ? (
        <div className="alert alert-info" role="alert">
          {userRole === 'commission_manager' 
            ? "Vous ne gérez actuellement aucune commission."
            : "Vous n'êtes actuellement membre d'aucune commission."
          }
        </div>
      ): (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {myCommissions.map(commission => (
            <div className="col" key={commission.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{commission.name}</h5>
                  
                  <p className="card-text text-muted mb-1">
                    {commission.description || 'Aucune description disponible'}
                  </p>
                  
                  <div className="mt-3">
                    <strong>Manager:</strong>{' '}
                    {commission.manager ? (
                      <span>{commission.manager.name}</span>
                    ) : (
                      <span className="text-muted">Non assigné</span>
                    )}
                  </div>
                  
                  {userRole === 'commission_manager' && (
                    <div className="mt-3">
                      <Link 
                        to={`/dashboard/commissions/${commission.id}/order-of-day`} 
                        className="btn btn-sm btn-outline-primary"
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
                        {commission.order_of_day ? "Modifier l'ordre du jour" : "Ajouter un ordre du jour"}
                      </Link>
                    </div>
                  )}
                </div>
                
                {commission.order_of_day && (
                  <div className="card-footer bg-light">
                    <h6 className="mb-1">Ordre du jour</h6>
                    <p className="card-text small mb-0">{commission.order_of_day}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCommissions;
