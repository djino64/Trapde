import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importer les traductions
import translationHT from './locales/ht/translation.json';
import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  ht: { translation: translationHT },
  fr: { translation: translationFR },
  en: { translation: translationEN },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ht', // Langue par défaut
    fallbackLng: 'ht', // Langue de secours si la langue détectée n'est pas disponible
    supportedLngs: ['ht', 'fr', 'en'], // Langues supportées
    interpolation: {
      escapeValue: false,
    },
    detection: {
      
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;