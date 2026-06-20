import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import {
  MdPerson,
  MdHomeWork,
  MdCheck,
  MdEmail,
  MdLock,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdBusiness,
} from 'react-icons/md';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

type AccountType = 'user' | 'professional';

const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<'select' | 'form'>('select');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    // Professional-specific
    businessName: '',
  });

  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0000AA]/20 focus:border-[#0000AA] transition-colors';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const selectAccountType = (type: AccountType) => {
    setAccountType(type);
    setStep('form');
  };

  const goBackToSelection = () => {
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
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        role: accountType,
      };
      console.log('Données soumises:', submitData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (accountType === 'professional') {
        navigate('/register-accommodation');
      } else {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">{t('auth.register.title')}</h1>
            <p className="text-sm text-slate-500 mt-1">{t('auth.register.subtitle')}</p>
          </div>

          {/* STEP 1: Account type selection */}
          {step === 'select' && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3 text-center">{t('auth.register.accountTypeLabel')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Simple user card */}
                <button
                  type="button"
                  onClick={() => selectAccountType('user')}
                  className="relative text-left p-6 rounded-lg border-2 border-slate-200 bg-white hover:border-[#0000AA] hover:bg-[#0000AA]/[0.03] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-slate-100 text-slate-500 group-hover:bg-[#0000AA] group-hover:text-white transition-colors">
                    <MdPerson size={22} />
                  </div>
                  <p className="text-base font-semibold text-slate-900 mb-1">{t('auth.register.userTitle')}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{t('auth.register.userDescription')}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-[#0000AA] mt-4">
                    {t('auth.register.selectButton')}
                    <MdArrowForward size={16} />
                  </div>
                </button>

                {/* Professional card */}
                <button
                  type="button"
                  onClick={() => selectAccountType('professional')}
                  className="relative text-left p-6 rounded-lg border-2 border-slate-200 bg-white hover:border-[#0000AA] hover:bg-[#0000AA]/[0.03] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-slate-100 text-slate-500 group-hover:bg-[#0000AA] group-hover:text-white transition-colors">
                    <MdHomeWork size={22} />
                  </div>
                  <p className="text-base font-semibold text-slate-900 mb-1">{t('auth.register.professionalTitle')}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{t('auth.register.professionalDescription')}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-[#0000AA] mt-4">
                    {t('auth.register.selectButton')}
                    <MdArrowForward size={16} />
                  </div>
                </button>
              </div>

              <p className="text-center text-sm text-slate-500 mt-8">
                {t('auth.register.haveAccount')}{' '}
                <Link to="/login" className="text-[#0000AA] font-medium hover:underline">
                  {t('auth.register.loginLink')}
                </Link>
              </p>
            </div>
          )}

          {/* STEP 2: Registration form */}
          {step === 'form' && accountType && (
            <div>
              <button
                type="button"
                onClick={goBackToSelection}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0000AA] mb-4 transition-colors"
              >
                <MdArrowBack size={16} />
                {t('auth.register.backToSelection')}
              </button>

              {/* Selected account type badge */}
              <div className="flex items-center gap-3 mb-6 p-3.5 rounded-md bg-[#0000AA]/[0.04] border border-[#0000AA]/10">
                <div className="w-9 h-9 rounded-lg bg-[#0000AA] text-white flex items-center justify-center flex-shrink-0">
                  {accountType === 'user' ? <MdPerson size={18} /> : <MdHomeWork size={18} />}
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {accountType === 'user' ? t('auth.register.userTitle') : t('auth.register.professionalTitle')}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                {accountType === 'professional' && (
                  <div className="flex items-start gap-3 mb-6 p-3.5 rounded-md bg-[#FF6600]/[0.06] border border-[#FF6600]/20">
                    <MdBusiness size={18} className="text-[#FF6600] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">{t('auth.register.professionalNote')}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.register.firstName')}</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={inputClass}
                        required
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
                      />
                    </div>
                  </div>

                  {accountType === 'professional' && (
                    <div>
                      <label className={labelClass}>{t('auth.register.businessName')}</label>
                      <div className="relative">
                        <MdHomeWork size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => handleChange('businessName', e.target.value)}
                          className={`${inputClass} pl-10`}
                          placeholder={t('auth.register.businessNamePlaceholder')}
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
                        required
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

                  <label className="flex items-start gap-2.5 text-sm text-slate-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                      className="accent-[#0000AA] mt-0.5"
                      required
                    />
                    <span>
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
                    disabled={isSubmitting || !formData.acceptTerms}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-sm text-white bg-[#0000AA] hover:bg-[#000088] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      t('auth.register.creatingAccount')
                    ) : (
                      <>
                        {accountType === 'professional' ? t('auth.register.continueToProperty') : t('auth.register.registerButton')}
                        <MdArrowForward size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <p className="text-center text-sm text-slate-500 mt-6">
                {t('auth.register.haveAccount')}{' '}
                <Link to="/login" className="text-[#0000AA] font-medium hover:underline">
                  {t('auth.register.loginLink')}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterScreen;