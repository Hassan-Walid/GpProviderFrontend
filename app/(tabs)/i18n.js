import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../languages/EnglishWords.json';
import ar from '../../languages/ArabicWords.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v9',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
