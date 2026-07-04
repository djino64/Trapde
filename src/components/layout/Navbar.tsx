import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import {
  MdMenu,
  MdClose,
  MdWork,
  MdBed,
  MdDirectionsBus,
  MdShoppingBag,
  MdCarRental,
  MdLanguage,
  MdPerson,
  MdLogin,
  MdPersonAdd,
  MdHome,
  MdLogout,
  MdSettings,
  MdDashboard,
  MdAddHome,
  MdKeyboardArrowDown,
  MdStar,
  MdFavorite,
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false);
  const [isLanguageOpen, setIsLanguageOpen]       = useState(false);
  const [isProfileOpen, setIsProfileOpen]         = useState(false);
  const [activeTab, setActiveTab]                 = useState<string>('home');
  const navigate = useNavigate();

  const profileRef  = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Ferme dropdowns lè klike deyò
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navTabs = [
    { id: 'home',          label: t('navbar.home'),          icon: MdHome,          path: '/' },
    { id: 'jobs',          label: t('navbar.jobs'),          icon: MdWork,          path: '/jobs' },
    { id: 'accommodation', label: t('navbar.accommodation'), icon: MdBed,           path: '/accommodation' },
    { id: 'travel',        label: t('navbar.travel'),        icon: MdDirectionsBus, path: '/travel' },
    { id: 'marketplace',   label: t('navbar.marketplace'),   icon: MdShoppingBag,   path: '/marketplace' },
    { id: 'rentals',       label: t('navbar.rentals'),       icon: MdCarRental,     path: '/rentals' },
  ];

  const languages = [
    { code: 'ht', label: 'Kreyòl',   countryCode: 'HT' },
    { code: 'fr', label: 'Français', countryCode: 'FR' },
    { code: 'en', label: 'English',  countryCode: 'US' },
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    setIsLanguageOpen(false);
  };

  const handleNavigation = (path: string, tabId: string) => {
    setActiveTab(tabId);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate('/');
  };

  // Inisyal pou avatar si pa gen foto
  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase();
  };

  // Wòl label
  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'partner': return t('navbar.rolePartner');
      case 'admin':   return t('navbar.roleAdmin');
      default:        return t('navbar.roleMember');
    }
  };

  const partnerMenuItems = user?.role === 'partner' || user?.role === 'admin'
    ? [
        { icon: MdDashboard, label: t('navbar.dashboard'), path: '/dashboard' },
        { icon: MdAddHome,   label: t('navbar.addProperty'), path: '/register-accommodation' },
      ]
    : [];

  return (
    <nav className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer shrink-0">
            <img src="/src/assets/images/TRAPDELOGO.png" alt="TRAPDE" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop Nav Tabs */}
          <div className="hidden lg:flex gap-1 bg-gray-100 p-1 rounded-full mx-4">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigation(tab.path, tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0000AA] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">

            {/* Language selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => { setIsLanguageOpen(!isLanguageOpen); setIsProfileOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <MdLanguage size={20} className="text-gray-600" />
                <ReactCountryFlag
                  countryCode={currentLanguage.countryCode}
                  svg
                  style={{ width: '1.5em', height: '1.5em', borderRadius: '50%' }}
                />
                <span className="text-sm text-gray-600">{currentLanguage.label}</span>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors ${
                        i18n.language === lang.code ? 'text-[#0000AA] font-medium' : 'text-gray-700'
                      }`}
                    >
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{ width: '1.5em', height: '1.5em', borderRadius: '50%' }}
                      />
                      <span>{lang.label}</span>
                      {i18n.language === lang.code && (
                        <span className="ml-auto text-[#0000AA] text-xs font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AUTH — Dekonekte */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-[#FF6600] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#E55A00] transition text-sm"
                >
                  <MdLogin size={18} />
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-[#0000AA] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#000088] transition text-sm"
                >
                  <MdPersonAdd size={18} />
                  {t('navbar.register')}
                </Link>
              </>
            ) : (
              /* AUTH — Konekte: Avatar + Dropdown */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setIsProfileOpen(!isProfileOpen); setIsLanguageOpen(false); }}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0000AA] hover:shadow-sm transition-all"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#0000AA] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                    {getInitials()}
                  </div>

                  {/* Nom + Wòl */}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-[11px] text-[#FF6600] font-medium leading-tight flex items-center gap-0.5">
                      <MdStar size={11} />
                      {getRoleLabel()}
                    </p>
                  </div>

                  <MdKeyboardArrowDown
                    size={18}
                    className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">

                    {/* Header dropdown — foto + non + wòl */}
                    <div className="flex items-center gap-3 px-5 py-4 bg-[#0000AA]">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-base font-bold flex-shrink-0 ring-2 ring-white/30">
                        {getInitials()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-[11px] text-[#FF6600] font-semibold flex items-center gap-1 mt-0.5">
                          <MdStar size={11} />
                          {getRoleLabel()}
                        </p>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors group"
                      >
                        <MdPerson size={20} className="text-gray-400 group-hover:text-[#0000AA] transition-colors flex-shrink-0" />
                        <span>{t('navbar.myAccount')}</span>
                      </Link>

                      <Link
                        to="/bookings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors group"
                      >
                        <MdDashboard size={20} className="text-gray-400 group-hover:text-[#0000AA] transition-colors flex-shrink-0" />
                        <span>{t('navbar.myBookings')}</span>
                      </Link>

                      <Link
                        to="/favorites"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors group"
                      >
                        <MdFavorite size={20} className="text-gray-400 group-hover:text-[#0000AA] transition-colors flex-shrink-0" />
                        <span>{t('navbar.favorites')}</span>
                      </Link>

                      {/* Menu patnè / admin sèlman */}
                      {partnerMenuItems.length > 0 && (
                        <>
                          <div className="mx-5 my-1.5 border-t border-gray-100" />
                          {partnerMenuItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors group"
                            >
                              <item.icon size={20} className="text-gray-400 group-hover:text-[#0000AA] transition-colors flex-shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </>
                      )}

                      <div className="mx-5 my-1.5 border-t border-gray-100" />

                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors group"
                      >
                        <MdSettings size={20} className="text-gray-400 group-hover:text-[#0000AA] transition-colors flex-shrink-0" />
                        <span>{t('navbar.settings')}</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3.5 w-full px-5 py-3 hover:bg-red-50 text-sm text-red-500 transition-colors group"
                      >
                        <MdLogout size={20} className="flex-shrink-0" />
                        <span>{t('navbar.logout')}</span>
                      </button>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 shadow-lg">

          {/* Profil mobil lè konekte */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-[#0000AA]">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold flex-shrink-0">
                {getInitials()}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-[#FF6600] font-medium flex items-center gap-0.5">
                  <MdStar size={11} />
                  {getRoleLabel()}
                </p>
              </div>
            </div>
          )}

          {/* Nav links */}
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
                onClick={() => handleNavigation(tab.path, tab.id)}
              >
                <Icon size={20} className="text-[#0000AA]" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <hr className="my-3" />

          {/* Lang */}
          <p className="text-xs text-gray-400 px-4 mb-1">{t('navbar.language')}</p>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { changeLanguage(lang.code); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50"
            >
              <ReactCountryFlag
                countryCode={lang.countryCode}
                svg
                style={{ width: '1.5em', height: '1.5em', borderRadius: '50%' }}
              />
              <span>{lang.label}</span>
              {i18n.language === lang.code && <span className="ml-auto text-[#0000AA] font-bold text-xs">✓</span>}
            </button>
          ))}

          <hr className="my-3" />

          {/* Auth mobile */}
          {isLoggedIn ? (
            <div className="space-y-1">
              <Link
                to="/profile"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MdPerson size={20} className="text-[#0000AA]" />
                <span>{t('navbar.myAccount')}</span>
              </Link>
              {partnerMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={20} className="text-[#0000AA]" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-500"
              >
                <MdLogout size={20} />
                <span>{t('navbar.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full bg-[#FF6600] text-white px-4 py-3 rounded-xl font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MdLogin size={18} />
                {t('navbar.login')}
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 w-full bg-[#0000AA] text-white px-4 py-3 rounded-xl font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MdPersonAdd size={18} />
                {t('navbar.register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;