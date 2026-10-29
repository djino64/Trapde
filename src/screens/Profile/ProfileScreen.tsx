import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
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
import {
  accommodationService,
  type Booking,
} from '../../services/accommodationService';

type Tab = 'profile' | 'bookings' | 'security' | 'dashboard';

const ProfileScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const requestedTab = (
    location.state as { activeTab?: Tab } | null
  )?.activeTab;

  const [activeTab, setActiveTab]             = useState<Tab>(
    requestedTab === 'bookings' || location.pathname === '/bookings'
      ? 'bookings'
      : 'profile'
  );
  const [isEditing, setIsEditing]             = useState(false);
  const [isSaving, setIsSaving]               = useState(false);
  const [saveSuccess, setSaveSuccess]         = useState(false);
  const [showOldPwd, setShowOldPwd]           = useState(false);
  const [showNewPwd, setShowNewPwd]           = useState(false);
  const [showConfirmPwd, setShowConfirmPwd]   = useState(false);
  const [pwdError, setPwdError]               = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess]           = useState(false);
  const [profileError, setProfileError]       = useState<string | null>(null);
  const [languageError, setLanguageError]     = useState<string | null>(null);
  const [languageSaving, setLanguageSaving]   = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<{ userId: number; url: string } | null>(null);
  const [profilePhotoError, setProfilePhotoError] = useState('');
  const [profilePhotoSaving, setProfilePhotoSaving] = useState(false);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingPage, setBookingPage] = useState(1);
  const [bookings, setBookings]               = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError]     = useState<string | null>(null);
  const [bookingsReload, setBookingsReload]   = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const userId = user?.id;
  const profilePhotoUrl = profilePhoto && profilePhoto.userId === userId
    ? profilePhoto.url
    : null;

  useEffect(() => {
    if (!userId) return;

    let active = true;
    api.get<Blob>('/users/profile/photo/', { responseType: 'blob' })
      .then(({ data }) => {
        if (active) {
          setProfilePhoto({ userId, url: URL.createObjectURL(data) });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          if (active) setProfilePhoto(null);
          return;
        }
        console.error('Unable to load the profile photo:', error);
        if (active) setProfilePhotoError(t('profile.photoLoadError'));
      });

    return () => {
      active = false;
    };
  }, [userId, t]);

  useEffect(() => {
    return () => {
      if (profilePhotoUrl) URL.revokeObjectURL(profilePhotoUrl);
    };
  }, [profilePhotoUrl]);

  useEffect(() => {
    if (activeTab !== 'bookings') return;

    let isCurrent = true;
    const loadBookings = async () => {
      setBookingsLoading(true);
      setBookingsError(null);
      try {
        const results = await accommodationService.getMyBookings();
        if (isCurrent) setBookings(results);
      } catch (error: unknown) {
        console.error('Unable to load the signed-in user bookings:', error);
        if (isCurrent) {
          setBookingsError(t('accommodations.booking.bookingsLoadError'));
        }
      } finally {
        if (isCurrent) setBookingsLoading(false);
      }
    };

    void loadBookings();
    return () => {
      isCurrent = false;
    };
  }, [activeTab, bookingsReload, t]);

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

  const formatBookingDate = (date: string) =>
    new Intl.DateTimeFormat(i18n.resolvedLanguage || 'ht').format(
      new Date(`${date}T00:00:00`)
    );

  const formatBookingPrice = (price: number | string) =>
    new Intl.NumberFormat(i18n.resolvedLanguage || 'ht', {
      style: 'currency',
      currency: 'HTG',
      maximumFractionDigits: 0,
    }).format(Number(price));

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
      await api.patch('/users/profile/', editData);
      await refreshUser();
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
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
      await api.post('/users/change-password/', {
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

  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    if (language !== 'ht' && language !== 'fr' && language !== 'en') return;

    setLanguageSaving(true);
    setLanguageError('');
    try {
      await api.patch('/users/profile/', { language });
      await refreshUser();
      await i18n.changeLanguage(language);
    } catch (error: unknown) {
      console.error('Unable to save the account language preference:', error);
      setLanguageError(t('profile.languageSaveError'));
    } finally {
      setLanguageSaving(false);
    }
  };

  const handleProfilePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0];
    event.target.value = '';
    if (!photo) return;

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!acceptedTypes.includes(photo.type) || photo.size > 5 * 1024 * 1024) {
      setProfilePhotoError(t('profile.photoInvalid'));
      return;
    }

    setProfilePhotoSaving(true);
    setProfilePhotoError('');
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      await api.post('/users/profile/photo/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (user) {
        setProfilePhoto({ userId: user.id, url: URL.createObjectURL(photo) });
      }
    } catch (error: unknown) {
      console.error('Unable to upload the profile photo:', error);
      setProfilePhotoError(t('profile.photoUploadError'));
    } finally {
      setProfilePhotoSaving(false);
    }
  };

  const handleProfilePhotoDelete = async () => {
    setProfilePhotoSaving(true);
    setProfilePhotoError('');
    try {
      await api.delete('/users/profile/photo/');
      setProfilePhoto(null);
    } catch (error: unknown) {
      console.error('Unable to delete the profile photo:', error);
      setProfilePhotoError(t('profile.photoDeleteError'));
    } finally {
      setProfilePhotoSaving(false);
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

  const filteredBookings = bookingStatusFilter === 'all'
    ? bookings
    : bookings.filter((booking) => booking.status === bookingStatusFilter);
  const bookingsPerPage = 10;
  const totalBookingPages = Math.max(1, Math.ceil(filteredBookings.length / bookingsPerPage));
  const visibleBookings = filteredBookings.slice(
    (bookingPage - 1) * bookingsPerPage,
    bookingPage * bookingsPerPage
  );

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
                <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-[#0000AA] text-2xl font-bold overflow-hidden">
                  {profilePhotoUrl
                    ? <img src={profilePhotoUrl} alt={t('profile.photoAlt')} className="h-full w-full object-cover" />
                    : getInitials()}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={profilePhotoSaving}
                  aria-label={t('profile.changePhoto')}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#0000AA] text-white rounded-full flex items-center justify-center shadow hover:bg-[#000088] transition-colors"
                >
                  <MdCamera size={14} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
                {profilePhotoUrl && (
                  <button
                    type="button"
                    disabled={profilePhotoSaving}
                    onClick={() => void handleProfilePhotoDelete()}
                    className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-xs text-red-700 shadow disabled:opacity-50"
                  >
                    {t('profile.removePhoto')}
                  </button>
                )}
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
            {profilePhotoError && (
              <p role="alert" className="mt-2 text-sm text-red-600">{profilePhotoError}</p>
            )}
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

              <div>
                <label htmlFor="profile-language" className={labelClass}>{t('profile.language')}</label>
                <select
                  id="profile-language"
                  value={user?.language ?? 'ht'}
                  disabled={languageSaving}
                  onChange={(event) => void handleLanguageChange(event)}
                  className={inputClass}
                >
                  <option value="ht">{t('profile.languages.ht')}</option>
                  <option value="fr">{t('profile.languages.fr')}</option>
                  <option value="en">{t('profile.languages.en')}</option>
                </select>
                {languageError && <p role="alert" className="mt-2 text-sm text-red-600">{languageError}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: REZÈVASYON ─────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-slate-900">{t('profile.tabs.bookings')}</h2>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span>{t('profile.bookingStatusFilter')}</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(event) => {
                    setBookingStatusFilter(event.target.value);
                    setBookingPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <option value="all">{t('profile.allBookingStatuses')}</option>
                  {(['pending', 'confirmed', 'cancelled', 'completed'] as const).map((bookingStatus) => (
                    <option key={bookingStatus} value={bookingStatus}>
                      {t(`accommodations.booking.status.${bookingStatus}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="p-6">
              {bookingsLoading ? (
                <p role="status" className="py-12 text-center text-sm text-slate-500">
                  {t('accommodations.booking.loadingBookings')}
                </p>
              ) : bookingsError ? (
                <div role="alert" className="py-8 text-center">
                  <p className="text-sm text-red-600">{bookingsError}</p>
                  <button
                    type="button"
                    onClick={() => setBookingsReload((value) => value + 1)}
                    className="mt-3 text-sm font-medium text-[#0000AA] underline"
                  >
                    {t('accommodations.search.retry')}
                  </button>
                </div>
              ) : bookings.length === 0 ? (
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
              ) : visibleBookings.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">{t('profile.noBookingsForFilter')}</p>
              ) : (
                <div className="space-y-4">
                  {visibleBookings.map((booking) => {
                    const statusKey = ['pending', 'confirmed', 'cancelled', 'completed']
                      .includes(booking.status)
                      ? booking.status
                      : 'other';

                    return (
                      <article
                        key={booking.id}
                        className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 sm:flex-row"
                      >
                        {booking.main_photo && (
                          <img
                            src={booking.main_photo}
                            alt={booking.accommodation_name}
                            className="h-32 w-full rounded-md object-cover sm:w-44"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900">
                            {booking.accommodation_name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {booking.accommodation_city}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            {formatBookingDate(booking.check_in)} – {formatBookingDate(booking.check_out)}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {t('accommodations.booking.partySummary', {
                              guests: booking.guests_count,
                              children: booking.children_count,
                            })}{' '}
                            · {formatBookingPrice(booking.total_price)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {t('profile.bookingReference')}: {booking.reference}
                          </p>
                          <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {t(`accommodations.booking.status.${statusKey}`, {
                              status: booking.status,
                            })}
                          </span>
                          {booking.payment_status && (
                            <p className="mt-2 text-xs text-slate-600">
                              {t('profile.paymentStatus')}: {t(`profile.paymentStatuses.${booking.payment_status}`, {
                                defaultValue: booking.payment_status,
                              })}
                            </p>
                          )}
                        </div>
                        <Link
                          to={`/bookings/${booking.id}`}
                          className="self-start text-sm font-medium text-[#0000AA] underline"
                        >
                          {t('accommodations.card.viewDetails')}
                        </Link>
                      </article>
                    );
                  })}
                  {totalBookingPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-500">
                        {(bookingPage - 1) * bookingsPerPage + 1}–{Math.min(bookingPage * bookingsPerPage, filteredBookings.length)} / {filteredBookings.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={bookingPage === 1}
                          onClick={() => setBookingPage((page) => Math.max(1, page - 1))}
                          className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                        >
                          ‹
                        </button>
                        <span className="text-sm">{bookingPage}/{totalBookingPages}</span>
                        <button
                          type="button"
                          disabled={bookingPage === totalBookingPages}
                          onClick={() => setBookingPage((page) => Math.min(totalBookingPages, page + 1))}
                          className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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