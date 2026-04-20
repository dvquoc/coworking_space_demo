import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import viCommon from './locales/vi/common.json'
import viNav from './locales/vi/nav.json'
import viAuth from './locales/vi/auth.json'
import viReports from './locales/vi/reports.json'
import viDashboard from './locales/vi/dashboard.json'
import viContracts from './locales/vi/contracts.json'
import viCrm from './locales/vi/crm.json'
import viInvoices from './locales/vi/invoices.json'
import viBookings from './locales/vi/bookings.json'
import viPricing from './locales/vi/pricing.json'
import viCredit from './locales/vi/credit.json'
import viProperties from './locales/vi/properties.json'
import viInventory from './locales/vi/inventory.json'
import viCustomers from './locales/vi/customers.json'
import enCommon from './locales/en/common.json'
import enNav from './locales/en/nav.json'
import enAuth from './locales/en/auth.json'
import enReports from './locales/en/reports.json'
import enDashboard from './locales/en/dashboard.json'
import enContracts from './locales/en/contracts.json'
import enCrm from './locales/en/crm.json'
import enInvoices from './locales/en/invoices.json'
import enBookings from './locales/en/bookings.json'
import enPricing from './locales/en/pricing.json'
import enCredit from './locales/en/credit.json'
import enProperties from './locales/en/properties.json'
import enInventory from './locales/en/inventory.json'
import enCustomers from './locales/en/customers.json'
import koCommon from './locales/ko/common.json'
import koNav from './locales/ko/nav.json'
import koAuth from './locales/ko/auth.json'
import koReports from './locales/ko/reports.json'
import koDashboard from './locales/ko/dashboard.json'
import koContracts from './locales/ko/contracts.json'
import koCrm from './locales/ko/crm.json'
import koInvoices from './locales/ko/invoices.json'
import koBookings from './locales/ko/bookings.json'
import koPricing from './locales/ko/pricing.json'
import koCredit from './locales/ko/credit.json'
import koProperties from './locales/ko/properties.json'
import koInventory from './locales/ko/inventory.json'
import koCustomers from './locales/ko/customers.json'

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
      vi: { common: viCommon, nav: viNav, auth: viAuth, reports: viReports, dashboard: viDashboard, contracts: viContracts, crm: viCrm, invoices: viInvoices, bookings: viBookings, pricing: viPricing, credit: viCredit, properties: viProperties, inventory: viInventory, customers: viCustomers },
      en: { common: enCommon, nav: enNav, auth: enAuth, reports: enReports, dashboard: enDashboard, contracts: enContracts, crm: enCrm, invoices: enInvoices, bookings: enBookings, pricing: enPricing, credit: enCredit, properties: enProperties, inventory: enInventory, customers: enCustomers },
      ko: { common: koCommon, nav: koNav, auth: koAuth, reports: koReports, dashboard: koDashboard, contracts: koContracts, crm: koCrm, invoices: koInvoices, bookings: koBookings, pricing: koPricing, credit: koCredit, properties: koProperties, inventory: koInventory, customers: koCustomers },
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
