import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowUpCircle, ArrowDownCircle, Gift,
  RefreshCw, X, CheckCircle2,
  ChevronLeft, ChevronRight, Plus, Wallet
} from 'lucide-react'
import Header from '../../components/layout/Header'
import type {
  CreditTransactionType,
  CreditPaymentMethod,
  CampaignStatus,
} from '../../types/credit'
import {
  mockCreditAccounts, mockCreditTransactions, mockBonusCampaigns,
} from '../../mocks/creditMocks'

// ─── Helpers ───────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('vi-VN') + 'đ' }
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN')
}
function fmtDateTime(s: string) {
  return new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

// ─── Config ────────────────────────────────────────────────
const TX_CFG: Record<CreditTransactionType, { labelKey: string; badge: string; icon: React.ReactNode }> = {
  top_up:     { labelKey: 'tx_type_top_up', badge: 'bg-green-50 text-green-700 border-green-200',   icon: <ArrowUpCircle className="w-3.5 h-3.5" /> },
  bonus:      { labelKey: 'tx_type_bonus',    badge: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Gift className="w-3.5 h-3.5" /> },
  payment:    { labelKey: 'tx_type_payment', badge: 'bg-blue-50 text-blue-700 border-blue-200',    icon: <ArrowDownCircle className="w-3.5 h-3.5" /> },
  refund:     { labelKey: 'tx_type_refund', badge: 'bg-orange-50 text-orange-700 border-orange-200', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  adjustment: { labelKey: 'tx_type_adjustment', badge: 'bg-slate-100 text-slate-600 border-slate-200', icon: <RefreshCw className="w-3.5 h-3.5" /> },
}

const CAMP_CFG: Record<CampaignStatus, { labelKey: string; badge: string }> = {
  draft:     { labelKey: 'camp_status_draft',     badge: 'bg-slate-100 text-slate-500' },
  active:    { labelKey: 'camp_status_active', badge: 'bg-green-50 text-green-700' },
  completed: { labelKey: 'camp_status_completed', badge: 'bg-blue-50 text-blue-700' },
  cancelled: { labelKey: 'camp_status_cancelled',   badge: 'bg-red-50 text-red-600' },
}

const TX_PAGE_SIZE = 10

type MainTab = 'history' | 'campaigns'
type TxFilter = 'all' | CreditTransactionType

// ─── Page ──────────────────────────────────────────────────
export default function CreditPage() {
  const { t } = useTranslation('credit')
  const [searchParams] = useSearchParams()
  const customerIdParam = searchParams.get('customerId')

  // Find credit account matching customerId from URL param
  const defaultAccFilter = useMemo(() => {
    if (!customerIdParam) return 'all'
    const acc = mockCreditAccounts.find(a => a.customerId === customerIdParam)
    return acc ? acc.id : 'all'
  }, [customerIdParam])

  const [mainTab, setMainTab] = useState<MainTab>('history')

  // ── History tab ──
  const [txAccFilter, setTxAccFilter] = useState<'all' | string>(defaultAccFilter)
  const [txTypeFilter, setTxTypeFilter] = useState<TxFilter>('all')
  const [txPage, setTxPage] = useState(1)

  // ── Top-up modal ──
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAccId, setTopUpAccId] = useState<string>(mockCreditAccounts[0]?.id ?? '')
  const [topUpVND, setTopUpVND] = useState('')
  const [topUpMethod, setTopUpMethod] = useState<CreditPaymentMethod>('cash')
  const [topUpSuccess, setTopUpSuccess] = useState(false)

  // ── Campaigns tab ──
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [campName, setCampName] = useState('')
  const [campDesc, setCampDesc] = useState('')
  const [campTarget, setCampTarget] = useState<'all' | 'individual' | 'company'>('all')
  const [campCredits, setCampCredits] = useState('')
  const [campSuccess, setCampSuccess] = useState(false)

  const filteredTx = useMemo(() => {
    setTxPage(1)
    return mockCreditTransactions
      .filter(tx => {
        if (txAccFilter !== 'all' && tx.creditAccountId !== txAccFilter) return false
        if (txTypeFilter !== 'all' && tx.type !== txTypeFilter) return false
        return true
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [txAccFilter, txTypeFilter])

  const txTotalPages = Math.max(1, Math.ceil(filteredTx.length / TX_PAGE_SIZE))
  const txPaginated = filteredTx.slice((txPage - 1) * TX_PAGE_SIZE, txPage * TX_PAGE_SIZE)

 

  return (
    <>
      <Header title={t('page_title')} subtitle={t('page_subtitle')} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* ── Main tabs ── */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {([
              ['history', t('tab_history')],
              ['campaigns', t('tab_campaigns')],
            ] as const).map(([k, l]) => (
              <button key={k} onClick={() => setMainTab(k)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
                  ${mainTab === k ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                {l}
              </button>
            ))}
          </div>

          {/* ════════ TAB 2 – LỊCH SỬ GIAO DỊCH ════════ */}
          {mainTab === 'history' && (
            <>
              {/* Filter bar */}
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  value={txAccFilter} onChange={e => setTxAccFilter(e.target.value)}>
                  <option value="all">{t('filter_all_accounts')}</option>
                  {mockCreditAccounts.map(a => (
                    <option key={a.id} value={a.id}>{a.customerName} ({a.accountCode})</option>
                  ))}
                </select>
                <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 text-xs">
                  {([
                    ['all', t('filter_all')],
                    ['top_up', t('filter_top_up')],
                    ['bonus', t('filter_bonus')],
                    ['payment', t('filter_payment')],
                    ['refund', t('filter_refund')],
                  ] as const).map(([k, l]) => (
                    <button key={k} onClick={() => setTxTypeFilter(k)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors
                        ${txTypeFilter === k ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                      {l}
                    </button>
                  ))}
                </div>
                {(txAccFilter !== 'all' || txTypeFilter !== 'all') && (
                  <button onClick={() => { setTxAccFilter('all'); setTxTypeFilter('all') }}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1.5 hover:bg-slate-100 rounded-lg">
                    <X className="w-3 h-3" /> {t('btn_clear_filter')}
                  </button>
                )}
                <button
                  onClick={() => {
                    setTopUpAccId(txAccFilter !== 'all' ? txAccFilter : (mockCreditAccounts[0]?.id ?? ''))
                    setTopUpVND('')
                    setTopUpMethod('cash')
                    setTopUpSuccess(false)
                    setShowTopUp(true)
                  }}
                  className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-semibold hover:bg-[#8f1820] transition-colors">
                  <Wallet className="w-4 h-4" /> {t('btn_top_up')}
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[160px_1fr_140px_110px_100px_110px] gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  <span>{t('col_time')}</span>
                  <span>{t('col_description')}</span>
                  <span>{t('col_account')}</span>
                  <span>{t('col_type')}</span>
                  <span className="text-right">{t('col_credits')}</span>
                  <span className="text-right">{t('col_balance_after')}</span>
                </div>

                {txPaginated.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">{t('empty_transactions')}</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {txPaginated.map(tx => {
                      const cfg = TX_CFG[tx.type]
                      const isIn = tx.amount > 0
                      return (
                        <div key={tx.id} className="grid grid-cols-[160px_1fr_140px_110px_100px_110px] gap-3 items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors">
                          <span className="text-xs text-slate-400">{fmtDateTime(tx.createdAt)}</span>
                          <div className="min-w-0">
                            <p className="text-sm text-slate-700 truncate">{tx.description}</p>
                            {tx.referenceCode && <p className="text-xs text-slate-400">{tx.referenceCode}</p>}
                            {tx.employeeName && <p className="text-xs text-blue-500 font-medium">{t('employee_prefix')} {tx.employeeName}</p>}
                            {tx.bonusReason && <p className="text-xs text-purple-500">{tx.bonusReason}</p>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-600 truncate">{tx.customerName}</p>
                            <p className="text-[10px] text-slate-400">{tx.accountCode}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border w-fit ${cfg.badge}`}>
                            {cfg.icon}{t(cfg.labelKey)}
                          </span>
                          <span className={`text-sm font-semibold text-right ${isIn ? 'text-green-600' : 'text-red-500'}`}>
                            {isIn ? '+' : ''}{tx.amount.toLocaleString()}
                          </span>
                          <span className="text-sm text-right text-slate-600 font-medium">
                            {tx.balanceAfter.toLocaleString()} c
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Pagination */}
                {filteredTx.length > 0 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-xs text-slate-400">
                      {t('pagination_info', { from: (txPage - 1) * TX_PAGE_SIZE + 1, to: Math.min(txPage * TX_PAGE_SIZE, filteredTx.length), total: filteredTx.length })}
                    </p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1}
                        className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      {Array.from({ length: txTotalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setTxPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                            ${txPage === p ? 'bg-[#b11e29] text-white' : 'hover:bg-slate-200 text-slate-600'}`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setTxPage(p => Math.min(txTotalPages, p + 1))} disabled={txPage === txTotalPages}
                        className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ════════ TAB 3 – CHIẾN DỊCH BONUS ════════ */}
          {mainTab === 'campaigns' && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{t('campaign_count', { count: mockBonusCampaigns.length })}</p>
                <button onClick={() => { setShowNewCampaign(true); setCampName(''); setCampDesc(''); setCampCredits(''); setCampTarget('all'); setCampSuccess(false) }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-semibold hover:bg-[#8f1820] transition-colors">
                  <Plus className="w-4 h-4" /> {t('btn_create_campaign')}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[120px_1fr_130px_80px_100px_100px_90px] gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  <span>{t('camp_col_code')}</span>
                  <span>{t('camp_col_name')}</span>
                  <span>{t('camp_col_target')}</span>
                  <span className="text-right">{t('camp_col_credits')}</span>
                  <span>{t('camp_col_start_date')}</span>
                  <span className="text-right">{t('camp_col_issued')}</span>
                  <span>{t('camp_col_status')}</span>
                </div>

                <div className="divide-y divide-slate-50">
                  {mockBonusCampaigns.map(camp => {
                    const cfg = CAMP_CFG[camp.status]
                    const targetLabel = { all: t('target_all'), individual: t('target_individual'), company: t('target_company'), specific: t('target_specific') }[camp.targetType]
                    return (
                      <div key={camp.id} className="grid grid-cols-[120px_1fr_130px_80px_100px_100px_90px] gap-3 items-center px-5 py-4 hover:bg-slate-50/80 transition-colors">
                        <span className="text-xs font-mono text-slate-500">{camp.campaignCode}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{camp.name}</p>
                          {camp.description && <p className="text-xs text-slate-400 truncate">{camp.description}</p>}
                          {camp.creditExpiryDays && (
                            <p className="text-xs text-orange-500">{t('camp_expiry_days', { days: camp.creditExpiryDays })}</p>
                          )}
                        </div>
                        <span className="text-xs text-slate-600">{targetLabel}</span>
                        <span className="text-sm font-semibold text-purple-600 text-right">{camp.bonusCredits.toLocaleString()}</span>
                        <span className="text-xs text-slate-500">{fmtDate(camp.startDate)}</span>
                        <span className="text-sm font-semibold text-blue-600 text-right">{camp.totalIssued.toLocaleString()}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${cfg.badge}`}>
                          {t(cfg.labelKey)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ══ Modal: Nạp Credits ══ */}
      {showTopUp && (() => {
        const acc = mockCreditAccounts.find(a => a.id === topUpAccId)
        const topUpCredits = topUpVND ? Math.floor(Number(topUpVND) / 1000) : 0
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{t('topup_modal_title')}</h2>
                <button onClick={() => setShowTopUp(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              {topUpSuccess ? (
                <div className="p-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="font-semibold text-slate-800 text-lg">{t('topup_success_title')}</p>
                  <p className="text-sm text-slate-500 text-center"
                    dangerouslySetInnerHTML={{ __html: t('topup_success_desc', { credits: topUpCredits.toLocaleString(), name: acc?.customerName }) }} />
                  <button onClick={() => setShowTopUp(false)}
                    className="mt-2 px-6 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820]">
                    {t('btn_close')}
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t('topup_label_account')}</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      value={topUpAccId} onChange={e => setTopUpAccId(e.target.value)}>
                      {mockCreditAccounts.map(a => (
                        <option key={a.id} value={a.id}>{a.customerName} ({a.accountCode}) · {a.currentBalance.toLocaleString()} c</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t('topup_label_amount')}</label>
                    <input type="number" min={100000} step={50000}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      placeholder={t('topup_placeholder_amount')}
                      value={topUpVND} onChange={e => setTopUpVND(e.target.value)} />
                    {topUpCredits > 0 && (
                      <>
                        <p className="text-xs text-[#b11e29] font-semibold mt-1.5">
                          {t('topup_credits_convert', { credits: topUpCredits.toLocaleString() })}
                          <span className="font-normal text-slate-400 ml-1">({t('topup_credits_rate')})</span>
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                          {t('topup_balance_after', { balance: ((acc?.currentBalance ?? 0) + topUpCredits).toLocaleString() })}
                        </p>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">{t('topup_label_method')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([['cash', t('method_cash')],['vnpay', t('method_vnpay')],['momo', t('method_momo')],['zalopay', t('method_zalopay')]] as [CreditPaymentMethod, string][]).map(([id, label]) => (
                        <label key={id} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-all
                          ${topUpMethod === id ? 'border-[#b11e29] bg-[#b11e29]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                          <input type="radio" name="tupm" value={id} className="accent-[#b11e29]"
                            checked={topUpMethod === id} onChange={() => setTopUpMethod(id)} />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowTopUp(false)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                      {t('btn_cancel')}
                    </button>
                    <button onClick={() => setTopUpSuccess(true)}
                      disabled={!topUpVND || topUpCredits < 100}
                      className="flex-1 py-2.5 bg-[#b11e29] text-white rounded-xl text-sm font-semibold hover:bg-[#8f1820] disabled:opacity-40 disabled:cursor-not-allowed">
                      {topUpCredits > 0 ? t('btn_top_up_amount', { credits: topUpCredits.toLocaleString() }) : t('btn_top_up_default')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* ══ Modal: Tạo chiến dịch ══ */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">{t('camp_modal_title')}</h2>
              <button onClick={() => setShowNewCampaign(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {campSuccess ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                  <p className="font-semibold text-slate-800 text-lg">{t('camp_success_title')}</p>
                  <p className="text-sm text-slate-500 text-center">{t('camp_success_desc', { name: campName })}</p>
                  <button onClick={() => setShowNewCampaign(false)}
                    className="mt-2 px-6 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820]">
                    {t('btn_close')}
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t('camp_label_name')}</label>
                  <input type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                    placeholder={t('camp_placeholder_name')}
                    value={campName} onChange={e => setCampName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t('camp_label_description')}</label>
                  <textarea rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 resize-none"
                    placeholder={t('camp_placeholder_description')}
                    value={campDesc} onChange={e => setCampDesc(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">{t('camp_label_target')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([['all', t('target_all')], ['individual', t('target_individual')], ['company', t('target_company')]] as const).map(([k, l]) => (
                      <label key={k} className={`flex items-center justify-center gap-1 p-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all
                        ${campTarget === k ? 'border-[#b11e29] bg-[#b11e29]/5 text-[#b11e29]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        <input type="radio" name="ct" value={k} className="sr-only"
                          checked={campTarget === k} onChange={() => setCampTarget(k)} />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t('camp_label_credits')}</label>
                  <input type="number" min={1}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                    placeholder={t('camp_placeholder_credits')}
                    value={campCredits} onChange={e => setCampCredits(e.target.value)} />
                  {campCredits && Number(campCredits) > 0 && (
                    <p className="text-xs text-purple-600 mt-1">
                      {t('camp_credits_value', { value: fmt(Number(campCredits) * 1000) })}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowNewCampaign(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                    {t('btn_cancel')}
                  </button>
                  <button onClick={() => setCampSuccess(true)}
                    disabled={!campName.trim() || !campCredits || Number(campCredits) < 1}
                    className="flex-1 py-2.5 bg-[#b11e29] text-white rounded-xl text-sm font-semibold hover:bg-[#8f1820] disabled:opacity-40 disabled:cursor-not-allowed">
                    {t('btn_create_campaign_submit')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
