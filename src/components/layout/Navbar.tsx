import React, { useState, useEffect } from 'react';
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
  MdPersonAdd
} from 'react-icons/md';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('jobs');
  const navigate = useNavigate();

  const isAuthenticated = false;

  const navTabs = [
    { id: 'jobs', label: t('navbar.jobs'), icon: MdWork, path: '/jobs' },
    { id: 'accommodation', label: t('navbar.accommodation'), icon: MdBed, path: '/accommodation' },
    { id: 'travel', label: t('navbar.travel'), icon: MdDirectionsBus, path: '/travel' },
    { id: 'marketplace', label: t('navbar.marketplace'), icon: MdShoppingBag, path: '/marketplace' },
    { id: 'rentals', label: t('navbar.rentals'), icon: MdCarRental, path: '/rentals' },
  ];

  // Langues avec le Créole en premier
  const languages = [
    { code: 'ht', label: 'Kreyòl', countryCode: 'HT' },
    { code: 'fr', label: 'Français', countryCode: 'FR' },
    { code: 'en', label: 'English', countryCode: 'US' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]; // Défaut sur Créole

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode); // Sauvegarder le choix
    setIsLanguageOpen(false);
  };

  const handleNavigation = (path: string, tabId: string) => {
    setActiveTab(tabId);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer shrink-0">
            <img 
              src="/src/assets/images/TRAPDELOGO.png" 
              alt="TRAPDE" 
              className="h-10 md:h-12 w-auto" 
            />
          </Link>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex gap-1 bg-gray-100 p-1 rounded-full mx-4">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0000AA] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => handleNavigation(tab.path, tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Selector - Créole affiché par défaut */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
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
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLanguageOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 text-sm ${
                          i18n.language === lang.code ? 'bg-gray-50 text-[#0000AA]' : 'text-gray-700'
                        }`}
                      >
                        <ReactCountryFlag
                          countryCode={lang.countryCode}
                          svg
                          style={{ width: '1.5em', height: '1.5em', borderRadius: '50%' }}
                        />
                        <span>{lang.label}</span>
                        {i18n.language === lang.code && <span className="ml-auto text-[#0000AA]">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="p-2 rounded-lg hover:bg-gray-100 transition">
                  <MdPerson size={22} className="text-gray-600" />
                </Link>
                <button className="bg-[#FF6600] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#E55A00] transition text-sm">
                  {t('navbar.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 bg-[#FF6600] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#E55A00] transition text-sm">
                  <MdLogin size={18} />
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="flex items-center gap-2 bg-[#0000AA] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#000088] transition text-sm">
                  <MdPersonAdd size={18} />
                  {t('navbar.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 shadow-lg">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50 transition" onClick={() => handleNavigation(tab.path, tab.id)}>
                <Icon size={20} className="text-gray-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          <hr className="my-3" />
          <div className="space-y-2">
            <p className="text-xs text-gray-400 px-4">{t('navbar.language')}</p>
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => { changeLanguage(lang.code); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50">
                <ReactCountryFlag countryCode={lang.countryCode} svg style={{ width: '1.5em', height: '1.5em', borderRadius: '50%' }} />
                <span>{lang.label}</span>
                {i18n.language === lang.code && <span className="ml-auto text-[#0000AA]">✓</span>}
              </button>
            ))}
          </div>
          <hr className="my-3" />
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                <MdPerson size={20} /> <span>{t('navbar.myAccount')}</span>
              </Link>
              <button className="w-full mt-2 bg-[#FF6600] text-white px-4 py-3 rounded-xl font-semibold">{t('navbar.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                <MdLogin size={20} /> <span>{t('navbar.login')}</span>
              </Link>
              <Link to="/register" className="flex items-center gap-3 w-full mt-2 bg-[#0000AA] text-white px-4 py-3 rounded-xl font-semibold justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                <MdPersonAdd size={18} /> {t('navbar.register')}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;