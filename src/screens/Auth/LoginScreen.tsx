import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdLogin, MdClose } from 'react-icons/md';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// import type { LoginData } from '../../hooks/useAuth';

interface LoginScreenProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ isOpen = true, onClose }) => {
  const { t } = useTranslation();
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email: formData.email, password: formData.password });
      if (onClose) onClose();
      navigate('/');
    } catch {
      // Erè afiche pa useAuth
    }
  };

  const handleClose = () => {
    clearError();
    if (onClose) onClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in-up">

          {/* Bouton fèmen */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition"
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
              <h1 className="text-2xl font-bold text-gray-900">{t('auth.login.title')}</h1>
              <p className="text-gray-500 text-sm mt-1">{t('auth.login.subtitle')}</p>
            </div>

            {/* Mesaj erè */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                <span className="text-red-500 text-xs leading-relaxed">{error}</span>
                <button
                  type="button"
                  onClick={clearError}
                  className="ml-auto text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <MdClose size={14} />
                </button>
              </div>
            )}

            {/* Fòmilè */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.login.email')}
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0000AA] focus:border-transparent outline-none transition text-sm"
                    placeholder="vous@exemple.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.login.password')}
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0000AA] focus:border-transparent outline-none transition text-sm"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword
                      ? <MdVisibilityOff size={18} className="text-gray-400" />
                      : <MdVisibility size={18} className="text-gray-400" />
                    }
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="rounded border-gray-300 accent-[#0000AA] w-3.5 h-3.5"
                  />
                  <span className="ml-1.5 text-xs text-gray-600">{t('auth.login.rememberMe')}</span>
                </label>
                <Link
                  to="/forgot-password"
                  onClick={handleClose}
                  className="text-xs text-[#0000AA] hover:underline"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0000AA] text-white py-2.5 rounded-lg font-semibold hover:bg-[#000088] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('auth.login.loggingIn') || 'Koneksyon...'}
                  </>
                ) : (
                  <>
                    <MdLogin size={18} />
                    {t('auth.login.loginButton')}
                  </>
                )}
              </button>
            </form>

            {/* Separatè */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400">{t('auth.login.orContinueWith')}</span>
              </div>
            </div>

            {/* Bouton sosyal */}
            <div className="space-y-2">
              <button
                onClick={() => { window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth'; }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                <FaGoogle size={16} className="text-red-500" />
                <span className="font-medium">Continuer avec Google</span>
              </button>

              <button
                onClick={() => { window.location.href = 'https://appleid.apple.com/auth/authorize'; }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                <FaApple size={16} className="text-gray-800" />
                <span className="font-medium">Continuer avec Apple</span>
              </button>
            </div>

            {/* Lyen enskripsyon */}
            <div className="mt-5 text-center">
              <p className="text-xs text-gray-500">
                {t('auth.login.noAccount')}{' '}
                <Link
                  to="/register"
                  onClick={handleClose}
                  className="text-[#0000AA] font-semibold hover:underline"
                >
                  {t('auth.login.registerLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;