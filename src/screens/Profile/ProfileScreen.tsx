import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdEdit,
  MdSave,
  MdClose,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdBed,
  MdAdd,
  MdStar,
  MdCalendarToday,
  MdCheck,
  MdCamera,
  MdDashboard,
  MdAttachMoney,
  MdHome,
  MdArrowForward,
} from 'react-icons/md';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

type Tab = 'profile' | 'bookings' | 'security' | 'dashboard';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [activeTab, setActiveTab]             = useState<Tab>('profile');
  const [isEditing, setIsEditing]             = useState(false);
  const [isSaving, setIsSaving]               = useState(false);
  const [saveSuccess, setSaveSuccess]         = useState(false);
  const [showOldPwd, setShowOldPwd]           = useState(false);
  const [showNewPwd, setShowNewPwd]           = useState(false);
  const [showConfirmPwd, setShowConfirmPwd]   = useState(false);
  const [pwdError, setPwdError]               = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess]           = useState(false);
  const [profileError, setProfileError]       = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editData, setEditData] = useState({
    first_name:    user?.first_name    ?? '',
    last_name:     user?.last_name     ?? '',
    phone:         user?.phone         ?? '',
    business_name: user?.business_name ?? '',
  });

  const [pwdData, setPwdData] = useState({
    old_password: '',
    new_password: '',
    confirm:      '',
  });

  // Inisyal pou avatar
  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase();
  };

  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'partner': return t('navbar.rolePartner');
      case 'admin':   return t('navbar.roleAdmin');
      default:        return t('navbar.roleMember');
    }
  };

  const handleStartEdit = () => {
    setEditData({
      first_name:    user?.first_name    ?? '',
      last_name:     user?.last_name     ?? '',
      phone:         user?.phone         ?? '',
      business_name: user?.business_name ?? '',
    });
    setProfileError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileError(null);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setProfileError(null);
    try {
      await api.patch('/api/users/profile/', editData);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Rechaje paj pou mete ajou user nan context
      window.location.reload();
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, unknown> } };
      const msg = Object.values(e.response?.data ?? {}).flat().join(' ') || t('profile.saveError');
      setProfileError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwdError(null);
    setPwdSuccess(false);
    if (pwdData.new_password !== pwdData.confirm) {
      setPwdError(t('auth.register.passwordMismatch'));
      return;
    }
    if (pwdData.new_password.length < 8) {
      setPwdError(t('auth.register.passwordLength'));
      return;
    }
    try {
      await api.post('/api/users/change-password/', {
        old_password: pwdData.old_password,
        new_password: pwdData.new_password,
      });
      setPwdSuccess(true);
      setPwdData({ old_password: '', new_password: '', confirm: '' });
      setTimeout(() => setPwdSuccess(false), 4000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, unknown> } };
      const msg = Object.values(e.response?.data ?? {}).flat().join(' ') || t('profile.pwdError');
      setPwdError(msg);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile',   label: t('profile.tabs.profile'),   icon: MdPerson },
    { id: 'bookings',  label: t('profile.tabs.bookings'),  icon: MdCalendarToday },
    { id: 'security',  label: t('profile.tabs.security'),  icon: MdLock },
    ...(user?.role === 'partner' || user?.role === 'admin'
      ? [{ id: 'dashboard' as Tab, label: t('profile.tabs.dashboard'), icon: MdDashboard }]
      : []),
  ];

  const inputClass = 'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0000AA]/20 focus:border-[#0000AA] transition-colors disabled:bg-slate-50 disabled:text-slate-500';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Header pwofil */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-[#0000AA] to-[#0000CC]" />

          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-[#0000AA] text-2xl font-bold">
                  {getInitials()}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#0000AA] text-white rounded-full flex items-center justify-center shadow hover:bg-[#000088] transition-colors"
                >
                  <MdCamera size={14} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" />
              </div>

              {/* Badge wòl */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6600]/10 border border-[#FF6600]/20 text-xs font-semibold text-[#FF6600]">
                <MdStar size={13} />
                {getRoleLabel()}
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MdEmail size={14} />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1.5 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-[#0000AA] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: PROFIL ─────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">{t('profile.personalInfo')}</h2>
              {!isEditing ? (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#0000AA] hover:bg-[#0000AA]/5 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <MdEdit size={16} />
                  {t('profile.edit')}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <MdClose size={16} />
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0000AA] hover:bg-[#000088] px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSaving
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <MdSave size={16} />
                    }
                    {t('profile.save')}
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-5">
              {profileError && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  {profileError}
                </div>
              )}
              {saveSuccess && (
                <div className="p-3.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
                  <MdCheck size={16} /> {t('profile.saveSuccess')}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>{t('auth.register.firstName')}</label>
                  <div className="relative">
                    <MdPerson size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={isEditing ? editData.first_name : (user?.first_name ?? '')}
                      onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                      disabled={!isEditing}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t('auth.register.lastName')}</label>
                  <div className="relative">
                    <MdPerson size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={isEditing ? editData.last_name : (user?.last_name ?? '')}
                      onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                      disabled={!isEditing}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('auth.register.email')}</label>
                <div className="relative">
                  <MdEmail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{t('profile.emailReadOnly')}</p>
              </div>

              <div>
                <label className={labelClass}>{t('auth.register.phone')}</label>
                <div className="relative">
                  <MdPhone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={isEditing ? editData.phone : (user?.phone ?? '')}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    disabled={!isEditing}
                    className={`${inputClass} pl-10`}
                    placeholder="+509 XXXX XXXX"
                  />
                </div>
              </div>

              {(user?.role === 'partner' || user?.role === 'admin') && (
                <div>
                  <label className={labelClass}>{t('auth.register.businessName')}</label>
                  <div className="relative">
                    <MdHome size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={isEditing ? editData.business_name : (user?.business_name ?? '')}
                      onChange={(e) => setEditData({ ...editData, business_name: e.target.value })}
                      disabled={!isEditing}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>{t('profile.role')}</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <MdStar size={16} className="text-[#FF6600]" />
                  <span className="text-sm text-slate-700 font-medium">{getRoleLabel()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: REZÈVASYON ─────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">{t('profile.tabs.bookings')}</h2>
            </div>
            <div className="p-6">
              {/* Placeholder — pral konekte ak API rezèvasyon */}
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <MdCalendarToday size={28} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm mb-4">{t('profile.noBookings')}</p>
                <Link
                  to="/accommodation"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0000AA] text-white text-sm font-medium hover:bg-[#000088] transition-colors"
                >
                  <MdBed size={18} />
                  {t('profile.findAccommodation')}
                  <MdArrowForward size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: SEKIRITE ───────────────────────────── */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">{t('profile.changePassword')}</h2>
            </div>
            <div className="p-6 space-y-5 max-w-md">
              {pwdError && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  {pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="p-3.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
                  <MdCheck size={16} /> {t('profile.pwdSuccess')}
                </div>
              )}

              {/* Ansyen modpas */}
              <div>
                <label className={labelClass}>{t('profile.oldPassword')}</label>
                <div className="relative">
                  <MdLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showOldPwd ? 'text' : 'password'}
                    value={pwdData.old_password}
                    onChange={(e) => setPwdData({ ...pwdData, old_password: e.target.value })}
                    className={`${inputClass} pl-10 pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPwd(!showOldPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>

              {/* Nouvo modpas */}
              <div>
                <label className={labelClass}>{t('profile.newPassword')}</label>
                <div className="relative">
                  <MdLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={pwdData.new_password}
                    onChange={(e) => setPwdData({ ...pwdData, new_password: e.target.value })}
                    className={`${inputClass} pl-10 pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>

              {/* Konfime modpas */}
              <div>
                <label className={labelClass}>{t('auth.register.confirmPassword')}</label>
                <div className="relative">
                  <MdLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={pwdData.confirm}
                    onChange={(e) => setPwdData({ ...pwdData, confirm: e.target.value })}
                    className={`${inputClass} pl-10 pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={!pwdData.old_password || !pwdData.new_password || !pwdData.confirm}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white bg-[#0000AA] hover:bg-[#000088] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <MdLock size={18} />
                {t('profile.updatePassword')}
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 4: DASHBOARD PATNÈ ────────────────────── */}
        {activeTab === 'dashboard' && (user?.role === 'partner' || user?.role === 'admin') && (
          <div className="space-y-5">
            {/* Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: MdBed,          label: t('profile.dashboard.properties'),  value: '0', color: 'bg-[#0000AA]' },
                { icon: MdCalendarToday, label: t('profile.dashboard.bookings'),   value: '0', color: 'bg-[#FF6600]' },
                { icon: MdAttachMoney,  label: t('profile.dashboard.revenue'),     value: 'HTG 0', color: 'bg-green-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lojman yo */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-900">{t('profile.dashboard.myProperties')}</h2>
                <Link
                  to="/register-accommodation"
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#0000AA] hover:bg-[#000088] px-3.5 py-2 rounded-lg transition-colors"
                >
                  <MdAdd size={16} />
                  {t('profile.dashboard.addProperty')}
                </Link>
              </div>

              {/* Placeholder — pral konekte ak API lojman */}
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <MdHome size={28} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm mb-1">{t('profile.dashboard.noProperties')}</p>
                <p className="text-xs text-slate-400 mb-5">{t('profile.dashboard.noPropertiesHint')}</p>
                <Link
                  to="/register-accommodation"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0000AA] text-white text-sm font-medium hover:bg-[#000088] transition-colors"
                >
                  <MdAdd size={18} />
                  {t('profile.dashboard.addProperty')}
                  <MdArrowForward size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default ProfileScreen;