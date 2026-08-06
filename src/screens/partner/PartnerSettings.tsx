import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MdSettings, MdLanguage, MdNotifications, MdSecurity, 
  MdVolumeOff, MdArrowForward, MdCheck
} from 'react-icons/md';
import PartnerLayout from './PartnerLayout';

type Language = 'ht' | 'fr' | 'en';

interface SettingsOption {
  id: string;
  label: string;
  key: string;
  description: string;
}

const LANGUAGE_OPTIONS: SettingsOption[] = [
  { id: 'ht', label: 'Kreyòl', key: 'settings.language.creole', description: 'Kreyòl Ayisyen' },
  { id: 'fr', label: 'Français', key: 'settings.language.french', description: 'Langue française' },
  { id: 'en', label: 'English', key: 'settings.language.english', description: 'English language' },
];

const PartnerSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<Language>(
    (localStorage.getItem('i18nextLng') as Language) || 'ht'
  );

  const [notifications, setNotifications] = useState({
    bookings: true,
    messages: true,
    reviews: true,
    promotions: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <PartnerLayout title={t('settings.title')}>
      <div className="space-y-6">
        {/* Titre */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('settings.title')}</h1>
          <p className="text-slate-600 text-sm mt-1">{t('settings.description')}</p>
        </div>

        {/* Message de succès */}
        {saveSuccess && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <MdCheck size={20} className="text-green-600" />
            <p className="text-sm text-green-700">{t('settings.savedSuccess')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ═══════════ SECTION 1: Langue ═══════════ */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <MdLanguage size={22} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">{t('settings.language.title')}</h2>
                <p className="text-xs text-slate-500">{t('settings.language.description')}</p>
              </div>
            </div>

            <div className="space-y-3">
              {LANGUAGE_OPTIONS.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id as Language)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    currentLang === lang.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-900">{lang.label}</p>
                    <p className="text-xs text-slate-500">{t(lang.key)}</p>
                  </div>
                  {currentLang === lang.id && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <MdCheck size={16} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ═══════════ SECTION 2: Résumé ═══════════ */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MdSettings size={18} className="text-blue-600" />
              {t('settings.summary')}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">{t('settings.language.title')}:</span>
                <span className="font-semibold text-slate-900">{
                  LANGUAGE_OPTIONS.find(l => l.id === currentLang)?.label
                }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{t('settings.notifications.active')}:</span>
                <span className="font-semibold text-slate-900">
                  {Object.values(notifications).filter(Boolean).length}/{Object.keys(notifications).length}
                </span>
              </div>
              <div className="pt-3 border-t border-blue-200 mt-3">
                <p className="text-xs text-slate-500">{t('settings.autoSaved')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ SECTION 3: Notifications ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <MdNotifications size={22} className="text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">{t('settings.notifications.title')}</h2>
              <p className="text-xs text-slate-500">{t('settings.notifications.description')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'bookings',
                label: t('settings.notifications.bookings'),
                desc: t('settings.notifications.bookingsDesc'),
                icon: <MdNotifications size={18} />,
              },
              {
                id: 'messages',
                label: t('settings.notifications.messages'),
                desc: t('settings.notifications.messagesDesc'),
                icon: <MdNotifications size={18} />,
              },
              {
                id: 'reviews',
                label: t('settings.notifications.reviews'),
                desc: t('settings.notifications.reviewsDesc'),
                icon: <MdNotifications size={18} />,
              },
              {
                id: 'promotions',
                label: t('settings.notifications.promotions'),
                desc: t('settings.notifications.promotionsDesc'),
                icon: <MdVolumeOff size={18} />,
              },
            ].map(notif => (
              <div
                key={notif.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    notifications[notif.id as keyof typeof notifications]
                      ? 'bg-green-100 text-green-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {notif.icon}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{notif.label}</p>
                    <p className="text-xs text-slate-500">{notif.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange(notif.id as keyof typeof notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications[notif.id as keyof typeof notifications]
                      ? 'bg-green-500'
                      : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications[notif.id as keyof typeof notifications] ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════ SECTION 4: Sécurité ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <MdSecurity size={22} className="text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">{t('settings.security.title')}</h2>
              <p className="text-xs text-slate-500">{t('settings.security.description')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
              <div className="text-left">
                <p className="font-medium text-slate-900">{t('settings.security.changePassword')}</p>
                <p className="text-xs text-slate-500">{t('settings.security.changePasswordDesc')}</p>
              </div>
              <MdArrowForward size={18} className="text-slate-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
              <div className="text-left">
                <p className="font-medium text-slate-900">{t('settings.security.twoFactor')}</p>
                <p className="text-xs text-slate-500">{t('settings.security.twoFactorDesc')}</p>
              </div>
              <MdArrowForward size={18} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
};

export default PartnerSettings;