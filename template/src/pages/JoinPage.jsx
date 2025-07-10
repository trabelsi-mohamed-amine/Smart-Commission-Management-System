import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('registration') === 'success';

  // URL de l'application d'authentification (à adapter)
  const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5174/register';

  useEffect(() => {
    if (isSuccess) {
      alert("Inscription réussie ! Bienvenue !");
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [isSuccess]);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Join SmartMeet</h1>
      <p className="text-center">Simplify your meetings with SmartMeet.</p>
      
      <div className="text-center mt-4">
        <button 
          onClick={() => window.location.href = AUTH_APP_URL}
          className="btn btn-primary btn-lg"
        >
          Join Now
        </button>
      </div>

      {isSuccess && (
        <div className="alert alert-success mt-3 text-center">
          Votre compte a été créé avec succès !
        </div>
      )}
    </div>
  );
};

export default JoinPage;