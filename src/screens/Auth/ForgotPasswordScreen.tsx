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
  const translationKey = 'auth.forgotPassword';

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
   * Ã‰TAPE 1
   * Demande d'envoi du code OTP.
   */
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    clearMessages();
    setIsLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/users/password-reset/request/`,
        {
          email: email.trim().toLowerCase(),
        }
      );

      setMessage(t(`${translationKey}.requestSuccess`));

      setStep('otp');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        setError(
          !err.response
            ? t(`${translationKey}.networkError`)
            : status === 429
              ? t(`${translationKey}.requestRateLimit`)
              : status === 400
                ? t(`${translationKey}.requestInvalid`)
                : t(`${translationKey}.requestFailed`)
        );
      } else {
        setError(t(`${translationKey}.unexpectedError`));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ã‰TAPE 2
   * VÃ©rification de l'OTP.
   */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    clearMessages();

    if (!/^\d{6}$/.test(otp)) {
      setError(t(`${translationKey}.otpInvalid`));
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
        setError(t(`${translationKey}.tokenMissing`));
        return;
      }

      setResetToken(token);

      setMessage(t(`${translationKey}.verifySuccess`));

      setStep('password');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        setError(
          !err.response
            ? t(`${translationKey}.networkError`)
            : status === 429
              ? t(`${translationKey}.verifyRateLimit`)
              : t(`${translationKey}.otpInvalid`)
        );
      } else {
        setError(t(`${translationKey}.unexpectedError`));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ã‰TAPE 3
   * DÃ©finition du nouveau mot de passe.
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    clearMessages();

    if (newPassword !== newPassword2) {
      setError(t(`${translationKey}.passwordMismatch`));
      return;
    }

    if (newPassword.length < 8) {
      setError(t(`${translationKey}.passwordTooShort`));
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/users/password-reset/confirm/`,
        {
          reset_token: resetToken,
          new_password: newPassword,
          new_password2: newPassword2,
        }
      );

      setMessage(t(`${translationKey}.successMessage`));

      setStep('success');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as
          | { reset_token?: unknown }
          | undefined;

        setError(
          !err.response
            ? t(`${translationKey}.networkError`)
            : data?.reset_token
              ? t(`${translationKey}.resetTokenInvalid`)
              : t(`${translationKey}.resetFailed`)
        );
      } else {
        setError(t(`${translationKey}.unexpectedError`));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Retour Ã  l'Ã©tape prÃ©cÃ©dente.
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
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in-up"
        >

          {/* Fermer */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-10"
            aria-label={t(`${translationKey}.close`)}
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
                  src="/TRAPDELOGO.png"
                  alt="TRAPDE"
                  className="h-16 w-auto"
                />
              </div>

              <h1 id="forgot-password-title" className="text-2xl font-bold text-gray-900">
                {step === 'email' &&
                  t(`${translationKey}.title`)}

                {step === 'otp' &&
                  t(`${translationKey}.otpTitle`)}

                {step === 'password' &&
                  t(`${translationKey}.passwordTitle`)}

                {step === 'success' &&
                  t(`${translationKey}.successTitle`)}
              </h1>

              <p className="text-gray-500 text-sm mt-2">
                {step === 'email' &&
                  t(`${translationKey}.subtitle`)}

                {step === 'otp' &&
                  t(`${translationKey}.otpSubtitle`, { email })}

                {step === 'password' &&
                  t(`${translationKey}.passwordSubtitle`)}

                {step === 'success' &&
                  t(`${translationKey}.successSubtitle`)}
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div role="alert" className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Message gÃ©nÃ©ral */}
            {message && step !== 'success' && (
              <div role="status" className="mb-5 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                {message}
              </div>
            )}

            {/* ========================================================= */}
            {/* Ã‰TAPE 1 : EMAIL */}
            {/* ========================================================= */}

            {step === 'email' && (
              <form
                onSubmit={handleRequestOTP}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="forgot-password-email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t(`${translationKey}.emailLabel`)}
                  </label>

                  <div className="relative">
                    <MdEmail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      id="forgot-password-email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
                      placeholder={t(
                        `${translationKey}.emailPlaceholder`
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
                      {t(`${translationKey}.sending`)}
                    </>
                  ) : (
                    <>
                      <MdSend size={18} />
                      {t(`${translationKey}.sendButton`)}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* Ã‰TAPE 2 : OTP */}
            {/* ========================================================= */}

            {step === 'otp' && (
              <form
                onSubmit={handleVerifyOTP}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="forgot-password-otp" className="block text-sm font-medium text-gray-700 mb-1">
                    {t(`${translationKey}.otpLabel`)}
                  </label>

                  <div className="relative">
                    <MdVerified
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      id="forgot-password-otp"
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
                      placeholder={t(`${translationKey}.otpPlaceholder`)}
                      required
                      autoComplete="one-time-code"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {t(`${translationKey}.otpExpiry`)}
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
                      {t(`${translationKey}.verifying`)}
                    </>
                  ) : (
                    <>
                      <MdVerified size={18} />
                      {t(`${translationKey}.verifyButton`)}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* Ã‰TAPE 3 : NOUVEAU MOT DE PASSE */}
            {/* ========================================================= */}

            {step === 'password' && (
              <form
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                {/* Nouveau mot de passe */}
                <div>
                  <label htmlFor="forgot-password-new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t(`${translationKey}.passwordLabel`)}
                  </label>

                  <div className="relative">
                    <MdLock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      id="forgot-password-new-password"
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
                      placeholder={t(`${translationKey}.passwordPlaceholder`)}
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
                          ? t(`${translationKey}.hidePassword`)
                          : t(`${translationKey}.showPassword`)
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
                  <label htmlFor="forgot-password-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t(`${translationKey}.confirmPasswordLabel`)}
                  </label>

                  <div className="relative">
                    <MdLock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      id="forgot-password-confirm-password"
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
                      placeholder={t(`${translationKey}.confirmPasswordPlaceholder`)}
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
                          ? t(`${translationKey}.hidePassword`)
                          : t(`${translationKey}.showPassword`)
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
                      {t(`${translationKey}.resetting`)}
                    </>
                  ) : (
                    <>
                      <MdLock size={18} />
                      {t(`${translationKey}.resetButton`)}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* SUCCÃˆS */}
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
                  {t(`${translationKey}.successTitle`)}
                </h2>

                <p className="text-gray-500 text-sm mb-6">
                  {message || t(`${translationKey}.successMessage`)}
                </p>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-block w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-center text-sm"
                >
                  {t(`${translationKey}.backToLogin`)}
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
                    ? t(`${translationKey}.backLink`)
                    : t(`${translationKey}.back`)}
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
