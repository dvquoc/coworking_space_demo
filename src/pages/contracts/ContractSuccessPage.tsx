import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, FileText, Receipt, ArrowLeft } from 'lucide-react'
import Header from '../../components/layout/Header'

export function ContractSuccessPage() {
  const { t } = useTranslation('contracts')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const contractId = searchParams.get('id') ?? ''
  const contractCode = searchParams.get('code') ?? ''

  return (
    <div className="flex flex-col h-full">
      <Header title={t('page_title')} />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg w-full p-10 text-center space-y-6">
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Title & description */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">
              {t('success_title')}
            </h1>
            {contractCode && (
              <p className="text-sm font-mono text-[#b11e29] font-semibold">{contractCode}</p>
            )}
            <p className="text-slate-500 text-sm leading-relaxed">
              {t('success_description')}
            </p>
          </div>

          {/* Prompt */}
          <p className="text-sm font-medium text-slate-600">
            {t('success_prompt')}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/contracts/${contractId}`)}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-[#b11e29] text-white rounded-xl text-sm font-semibold hover:bg-[#8f1820] transition-colors"
            >
              <FileText className="w-4 h-4" />
              {t('success_view_contract')}
            </button>
            <button
              onClick={() => navigate('/invoices')}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border-2 border-[#b11e29] text-[#b11e29] rounded-xl text-sm font-semibold hover:bg-[#b11e29]/5 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              {t('success_view_invoices')}
            </button>
            <button
              onClick={() => navigate('/contracts')}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('success_back_to_list')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
