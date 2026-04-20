import Header from '../components/layout/Header'
import { useTranslation } from 'react-i18next'

export default function CustomersPage() {
  const { t } = useTranslation('customers')
  return (
    <>
      <Header title={t('page_title')} subtitle={t('page_subtitle')} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-slate-600">{t('page_coming_soon')}</p>
          </div>
        </div>
      </main>
    </>
  )
}
