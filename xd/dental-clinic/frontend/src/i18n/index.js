import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import ar from '../locales/ar.json'

const STORAGE_KEY = 'locale'
const saved = localStorage.getItem(STORAGE_KEY) || 'en'

const applyDocumentLocale = (lang) => {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: saved,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

applyDocumentLocale(saved)

i18n.on('languageChanged', (lang) => {
  localStorage.setItem(STORAGE_KEY, lang)
  applyDocumentLocale(lang)
})

export const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
]

export const getActiveLocale = () => {
  const map = { en: 'en-US', fr: 'fr-FR', ar: 'ar' }
  return map[i18n.language] || 'en-US'
}

export default i18n
