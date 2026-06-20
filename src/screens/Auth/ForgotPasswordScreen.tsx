import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEmail, MdSend, MdClose, MdArrowBack } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

interface ForgotPasswordScreenProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ isOpen = true, onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleClose = () => {
    if (onClose) onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay semi-transparent */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleClose} />
      
      {/* Modal Mot de passe oublié */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in-up">
          
          {/* Bouton fermer */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-10"
          >
            <MdClose size={24} className="text-gray-400 hover:text-gray-600" />
          </button>

          <div className="p-6 md:p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <img 
                  src="/src/assets/images/TRAPDELOGO.png" 
                  alt="TRAPDE" 
                  className="h-16 w-auto" 
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('forgotPassword.title')}</h1>
              <p className="text-gray-500 text-sm mt-2">
                {t('forgotPassword.subtitle')}
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('forgotPassword.emailLabel')}
                  </label>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
                      placeholder={t('forgotPassword.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('forgotPassword.sending')}
                    </>
                  ) : (
                    <>
                      <MdSend size={18} />
                      {t('forgotPassword.sendButton')}
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdEmail size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('forgotPassword.successTitle')}</h2>
                <p className="text-gray-500 text-sm mb-6">
                  {t('forgotPassword.successMessage')} <strong className="text-blue-600">{email}</strong>
                </p>
                <button
                  onClick={handleClose}
                  className="inline-block w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-center text-sm"
                >
                  {t('forgotPassword.backToLogin')}
                </button>
              </div>
            )}

            {/* Lien retour */}
            {!isSubmitted && (
              <div className="mt-5 text-center">
                <Link 
                  to="/login" 
                  onClick={handleClose}
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition"
                >
                  <MdArrowBack size={14} />
                  {t('forgotPassword.backLink')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordScreen;