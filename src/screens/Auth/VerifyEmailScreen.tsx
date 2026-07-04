import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const VerifyEmailScreen: React.FC = () => {
  const { token } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simuler la vérification de l'email
    setTimeout(() => {
      if (token === 'valid-token') {
        setIsVerified(true);
      } else {
        setError("Le lien de vérification est invalide ou a expiré.");
      }
      setIsLoading(false);
    }, 1500);
  }, [token]);

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Un nouvel email de vérification a été envoyé !");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {isVerified ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email vérifié !
            </h1>
            <p className="text-gray-600 mb-6">
              Votre adresse email a été vérifiée avec succès.
            </p>
            <Link
              to="/login"
              className="inline-block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Se connecter
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={40} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Vérification échouée
            </h1>
            <p className="text-gray-600 mb-4">
              {error || "Impossible de vérifier votre email."}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Le lien de vérification est peut-être expiré ou invalide.
            </p>
            <button
              onClick={handleResendEmail}
              className="inline-flex items-center justify-center gap-2 w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary-dark transition"
            >
              <RefreshCw size={20} />
              Renvoyer l'email de vérification
            </button>
            <div className="mt-4">
              <Link to="/login" className="text-sm text-primary hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailScreen;