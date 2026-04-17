import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import viCommon from './locales/vi/common.json'
import viNav from './locales/vi/nav.json'
import viAuth from './locales/vi/auth.json'
import viReports from './locales/vi/reports.json'
import viDashboard from './locales/vi/dashboard.json'
import enCommon from './locales/en/common.json'
import enNav from './locales/en/nav.json'
import enAuth from './locales/en/auth.json'
import enReports from './locales/en/reports.json'
import enDashboard from './locales/en/dashboard.json'
import koCommon from './locales/ko/common.json'
import koNav from './locales/ko/nav.json'
import koAuth from './locales/ko/auth.json'
import koReports from './locales/ko/reports.json'
import koDashboard from './locales/ko/dashboard.json'

const STORAGE_KEY = 'coworking_preferred_locale'

function detectLanguage(): string {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && ['vi', 'en', 'ko'].includes(saved)) return saved
  const browser = navigator.language.split('-')[0]
  if (['vi', 'en', 'ko'].includes(browser)) return browser
  return 'ko'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: viCommon, nav: viNav, auth: viAuth, reports: viReports, dashboard: viDashboard },
      en: { common: enCommon, nav: enNav, auth: enAuth, reports: enReports, dashboard: enDashboard },
      ko: { common: koCommon, nav: koNav, auth: koAuth, reports: koReports, dashboard: koDashboard },
    },
    lng: detectLanguage(),
    fallbackLng: 'vi',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
})

export default i18n
