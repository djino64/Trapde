import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdEmail,
  MdSend,
  MdClose,
  MdArrowBack,
  MdLock,
  MdVerified,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ForgotPasswordScreenProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type Step = 'email' | 'otp' | 'password' | 'success';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  isOpen = true,
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [resetToken, setResetToken] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [message, setMessage] = useState('');

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    navigate('/login');
  };

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  /**
   * ÉTAPE 1
   * Demande d'envoi du code OTP.
   */
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    clearMessages();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/users/password-reset/request/`,
        {
          email: email.trim().toLowerCase(),
        }
      );

      setMessage(
        response.data?.message ||
          'Un code de vérification a été envoyé à votre adresse email.'
      );

      setStep('otp');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;

        if (status === 429) {
          setError(
            data?.error ||
              'Veuillez attendre avant de demander un nouveau code.'
          );
        } else if (data?.email) {
          setError(
            Array.isArray(data.email)
              ? data.email[0]
              : data.email
          );
        } else if (data?.error) {
          setError(data.error);
        } else if (data?.detail) {
          setError(data.detail);
        } else {
          setError(
            "Impossible d'envoyer le code de vérification. Veuillez réessayer."
          );
        }
      } else {
        setError(
          "Une erreur inattendue s'est produite. Veuillez réessayer."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ÉTAPE 2
   * Vérification de l'OTP.
   */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    clearMessages();

    if (!/^\d{6}$/.test(otp)) {
      setError('Le code doit contenir exactement 6 chiffres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/users/password-reset/verify/`,
        {
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }
      );

      const token = response.data?.reset_token;

      if (!token) {
        setError(
          "Le serveur n'a pas retourné de jeton de réinitialisation."
        );
        return;
      }

      setResetToken(token);

      setMessage(
        response.data?.message ||
          'Code vérifié avec succès.'
      );

      setStep('password');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;

        if (status === 429) {
          setError(
            data?.error ||
              'Trop de tentatives. Veuillez demander un nouveau code.'
          );
        } else if (data?.otp) {
          setError(
            Array.isArray(data.otp)
              ? data.otp[0]
              : data.otp
          );
        } else if (data?.error) {
          setError(data.error);
        } else if (data?.detail) {
          setError(data.detail);
        } else {
          setError(
            'Le code est incorrect ou a expiré.'
          );
        }
      } else {
        setError(
          "Une erreur inattendue s'est produite. Veuillez réessayer."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ÉTAPE 3
   * Définition du nouveau mot de passe.
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    clearMessages();

    if (newPassword !== newPassword2) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (newPassword.length < 8) {
      setError(
        'Le nouveau mot de passe doit contenir au moins 8 caractères.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/users/password-reset/confirm/`,
        {
          reset_token: resetToken,
          new_password: newPassword,
          new_password2: newPassword2,
        }
      );

      setMessage(
        response.data?.message ||
          'Votre mot de passe a été réinitialisé avec succès.'
      );

      setStep('success');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;

        if (data?.new_password) {
          setError(
            Array.isArray(data.new_password)
              ? data.new_password[0]
              : data.new_password
          );
        } else if (data?.new_password2) {
          setError(
            Array.isArray(data.new_password2)
              ? data.new_password2[0]
              : data.new_password2
          );
        } else if (data?.reset_token) {
          setError(
            Array.isArray(data.reset_token)
              ? data.reset_token[0]
              : data.reset_token
          );
        } else if (data?.error) {
          setError(data.error);
        } else if (data?.detail) {
          setError(data.detail);
        } else {
          setError(
            'Impossible de réinitialiser le mot de passe.'
          );
        }
      } else {
        setError(
          "Une erreur inattendue s'est produite. Veuillez réessayer."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Retour à l'étape précédente.
   */
  const handleBack = () => {
    clearMessages();

    if (step === 'otp') {
      setOtp('');
      setStep('email');
      return;
    }

    if (step === 'password') {
      setNewPassword('');
      setNewPassword2('');
      setResetToken('');
      setStep('otp');
      return;
    }

    if (step === 'success') {
      handleClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in-up">

          {/* Fermer */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-10"
            aria-label="Fermer"
          >
            <MdClose
              size={24}
              className="text-gray-400 hover:text-gray-600"
            />
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

              <h1 className="text-2xl font-bold text-gray-900">
                {step === 'email' &&
                  t('forgotPassword.title')}

                {step === 'otp' &&
                  'Vérification du code'}

                {step === 'password' &&
                  'Nouveau mot de passe'}

                {step === 'success' &&
                  'Mot de passe réinitialisé'}
              </h1>

              <p className="text-gray-500 text-sm mt-2">
                {step === 'email' &&
                  t('forgotPassword.subtitle')}

                {step === 'otp' &&
                  `Un code à 6 chiffres a été envoyé à ${email}.`}

                {step === 'password' &&
                  'Choisissez un nouveau mot de passe sécurisé.'}

                {step === 'success' &&
                  'Votre mot de passe a été modifié avec succès.'}
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Message général */}
            {message && step !== 'success' && (
              <div className="mb-5 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                {message}
              </div>
            )}

            {/* ========================================================= */}
            {/* ÉTAPE 1 : EMAIL */}
            {/* ========================================================= */}

            {step === 'email' && (
              <form
                onSubmit={handleRequestOTP}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('forgotPassword.emailLabel')}
                  </label>

                  <div className="relative">
                    <MdEmail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
                      placeholder={t(
                        'forgotPassword.emailPlaceholder'
                      )}
                      required
                      autoComplete="email"
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
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <MdSend size={18} />
                      {t('forgotPassword.sendButton')}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* ÉTAPE 2 : OTP */}
            {/* ========================================================= */}

            {step === 'otp' && (
              <form
                onSubmit={handleVerifyOTP}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code de vérification
                  </label>

                  <div className="relative">
                    <MdVerified
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 6)
                        )
                      }
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-center tracking-[0.4em] text-lg font-semibold"
                      placeholder="000000"
                      required
                      autoComplete="one-time-code"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Le code est valable pendant 10 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <MdVerified size={18} />
                      Vérifier le code
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* ÉTAPE 3 : NOUVEAU MOT DE PASSE */}
            {/* ========================================================= */}

            {step === 'password' && (
              <form
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>

                  <div className="relative">
                    <MdLock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
                      placeholder="Votre nouveau mot de passe"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                    >
                      {showPassword ? (
                        <MdVisibilityOff size={19} />
                      ) : (
                        <MdVisibility size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>

                  <div className="relative">
                    <MdLock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      type={
                        showPassword2
                          ? 'text'
                          : 'password'
                      }
                      value={newPassword2}
                      onChange={(e) =>
                        setNewPassword2(e.target.value)
                      }
                      className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
                      placeholder="Confirmez votre mot de passe"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword2(!showPassword2)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword2
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                    >
                      {showPassword2 ? (
                        <MdVisibilityOff size={19} />
                      ) : (
                        <MdVisibility size={19} />
                      )}
                    </button>
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
                      Réinitialisation...
                    </>
                  ) : (
                    <>
                      <MdLock size={18} />
                      Réinitialiser le mot de passe
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* SUCCÈS */}
            {/* ========================================================= */}

            {step === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdVerified
                    size={32}
                    className="text-green-600"
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Mot de passe modifié
                </h2>

                <p className="text-gray-500 text-sm mb-6">
                  {message ||
                    'Votre mot de passe a été réinitialisé avec succès.'}
                </p>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-block w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-center text-sm"
                >
                  Retour à la connexion
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* NAVIGATION */}
            {/* ========================================================= */}

            {step !== 'success' && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={
                    step === 'email'
                      ? handleClose
                      : handleBack
                  }
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition"
                >
                  <MdArrowBack size={14} />

                  {step === 'email'
                    ? t('forgotPassword.backLink')
                    : 'Retour'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordScreen;