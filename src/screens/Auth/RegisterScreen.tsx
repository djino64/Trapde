import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import {
  MdPerson,
  MdHandshake,
  MdEmail,
  MdLock,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdArrowBack,
  MdBusiness,
} from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';

type AccountType = 'user' | 'partner';

const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [step, setStep] = useState<'select' | 'form'>('select');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    businessName: '',
  });

  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0000AA]/20 focus:border-[#0000AA] transition-colors';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const selectAccountType = (type: AccountType) => {
    clearError();
    setAccountType(type);
    setStep('form');
  };

  const goBackToSelection = () => {
    clearError();
    setErrors({});
    setStep('select');
  };

  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    if (formData.password.length < 8) {
      newErrors.password = t('auth.register.passwordLength');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.passwordMismatch');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !accountType) return;
    try {
      const result = await register({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        role: accountType,
        business_name: formData.businessName,
        password: formData.password,
        password2: formData.confirmPassword,
      });
      if (result.role === 'partner') {
        navigate('/register-accommodation');
      } else {
        navigate('/');
      }
    } catch {
      // Erè afiche pa useAuth
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* ETAP 1: Chwazi kalite kont */}
          {step === 'select' && (
            <div>
              {/* Header */}
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {t('auth.register.title')}
              </h1>
              <p className="text-sm text-slate-500 mb-8">
                {t('auth.register.haveAccount')}{' '}
                <Link to="/login" className="text-[#FF6600] font-medium hover:underline">
                  {t('auth.register.loginLink')}
                </Link>
              </p>

              {/* Kart yo */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Kart Itilizatè */}
                <button
                  type="button"
                  onClick={() => selectAccountType('user')}
                  className="text-left p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#0000AA] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-slate-100 group-hover:bg-[#0000AA]/10 transition-colors">
                    <MdPerson size={20} className="text-slate-600 group-hover:text-[#0000AA]" />
                  </div>
                  <p className="text-base font-bold text-slate-900 mb-1">
                    {t('auth.register.userTitle')}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('auth.register.userDescription')}
                  </p>
                </button>

                {/* Kart Patnè */}
                <button
                  type="button"
                  onClick={() => selectAccountType('partner')}
                  className="text-left p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#0000AA] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-slate-100 group-hover:bg-[#0000AA]/10 transition-colors">
                    <MdHandshake size={20} className="text-slate-600 group-hover:text-[#0000AA]" />
                  </div>
                  <p className="text-base font-bold text-slate-900 mb-1">
                    {t('auth.register.partnerTitle')}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('auth.register.partnerDescription')}
                  </p>
                </button>
              </div>

              {/* Separatè */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-xs font-medium text-slate-400 tracking-widest uppercase">
                    {t('auth.login.orContinueWith')}
                  </span>
                </div>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={() => { window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth'; }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700"
              >
                <FaGoogle size={18} className="text-red-500" />
                Google
              </button>
            </div>
          )}

          {/* ETAP 2: Fòmilè */}
          {step === 'form' && accountType && (
            <div>
              {/* Header */}
              <button
                type="button"
                onClick={goBackToSelection}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#0000AA] mb-6 transition-colors"
              >
                <MdArrowBack size={16} />
                {t('auth.register.backToSelection')}
              </button>

              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {t('auth.register.title')}
              </h1>
              <p className="text-sm text-slate-500 mb-8">
                {t('auth.register.haveAccount')}{' '}
                <Link to="/login" className="text-[#FF6600] font-medium hover:underline">
                  {t('auth.register.loginLink')}
                </Link>
              </p>

              {/* Badge kalite kont chwazi */}
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-[#0000AA]/[0.06] border border-[#0000AA]/10">
                <div className="w-5 h-5 rounded-full bg-[#0000AA] flex items-center justify-center">
                  {accountType === 'user'
                    ? <MdPerson size={12} className="text-white" />
                    : <MdHandshake size={12} className="text-white" />
                  }
                </div>
                <span className="text-xs font-medium text-[#0000AA]">
                  {accountType === 'user' ? t('auth.register.userTitle') : t('auth.register.partnerTitle')}
                </span>
              </div>

              {/* Mesaj erè API */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* Nòt patnè */}
              {accountType === 'partner' && (
                <div className="flex items-start gap-3 mb-6 p-3.5 rounded-xl bg-[#FF6600]/[0.06] border border-[#FF6600]/20">
                  <MdBusiness size={16} className="text-[#FF6600] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t('auth.register.partnerNote')}
                  </p>
                </div>
              )}

              {/* Fòmilè */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>{t('auth.register.firstName')}</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={inputClass}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('auth.register.lastName')}</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={inputClass}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {accountType === 'partner' && (
                  <div>
                    <label className={labelClass}>{t('auth.register.businessName')}</label>
                    <div className="relative">
                      <MdHandshake size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                        className={`${inputClass} pl-10`}
                        placeholder={t('auth.register.businessNamePlaceholder')}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className={labelClass}>{t('auth.register.email')}</label>
                  <div className="relative">
                    <MdEmail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`${inputClass} pl-10`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t('auth.register.phone')}</label>
                  <div className="relative">
                    <MdPhone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`${inputClass} pl-10`}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t('auth.register.password')}</label>
                  <div className="relative">
                    <MdLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className={`${inputClass} pl-10 pr-10`}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className={labelClass}>{t('auth.register.confirmPassword')}</label>
                  <div className="relative">
                    <MdLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className={`${inputClass} pl-10 pr-10`}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>

                <label className="flex items-start gap-2.5 text-sm text-slate-500 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                    className="accent-[#0000AA] mt-0.5"
                    required
                  />
                  <span className="text-xs">
                    {t('auth.register.acceptTerms')}{' '}
                    <Link to="/terms" className="text-[#0000AA] hover:underline">
                      {t('auth.register.termsLink')}
                    </Link>{' '}
                    {t('auth.register.and')}{' '}
                    <Link to="/privacy" className="text-[#0000AA] hover:underline">
                      {t('auth.register.privacyLink')}
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading || !formData.acceptTerms}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#0000AA] hover:bg-[#000088] disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('auth.register.creatingAccount')}
                    </>
                  ) : (
                    <>
                      {accountType === 'partner'
                        ? t('auth.register.continueToProperty')
                        : t('auth.register.registerButton')}
                      <MdArrowForward size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterScreen;