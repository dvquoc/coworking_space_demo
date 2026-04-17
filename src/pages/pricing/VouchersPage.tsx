import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Ticket,
  Plus,
  Search,
  Copy,
  CheckCircle,
  XCircle,
  User,
  Clock,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useVouchers, useCreateVouchers, useRevokeVoucher, usePromotions } from '../../hooks/usePricing'
import type { VoucherCode } from '../../types/pricing'

// ========== CREATE MODAL ==========

interface CreateModalProps {
  promotions: Array<{ id: string; name: string; code: string }>
  onClose: () => void
  onCreate: (data: {
    promotionId: string
    codes?: string[]
    count?: number
    assignedCustomerId?: string
    maxUsageTotal?: number
    expiresAt?: string
  }) => void
  saving: boolean
}

function CreateModal({ promotions, onClose, onCreate, saving }: CreateModalProps) {
  const { t } = useTranslation('pricing')
  const [form, setForm] = useState({
    promotionId: promotions[0]?.id ?? '',
    mode: 'auto' as 'auto' | 'manual',
    manualCode: '',
    count: '1',
    assignedCustomerId: '',
    maxUsageTotal: '1',
    expiresAt: '',
  })

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.mode === 'manual' && !form.manualCode.trim()) {
      alert(t('voucher_alert_enter_code'))
      return
    }
    onCreate({
      promotionId: form.promotionId,
      codes: form.mode === 'manual' ? [form.manualCode.trim().toUpperCase()] : undefined,
      count: form.mode === 'auto' ? Number(form.count) : undefined,
      assignedCustomerId: form.assignedCustomerId || undefined,
      maxUsageTotal: Number(form.maxUsageTotal),
      expiresAt: form.expiresAt || undefined,
    })
  }

  const inputCls =
    'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 focus:border-[#b11e29]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-5">{t('voucher_modal_title')}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">{t('voucher_label_promotion')}</label>
            <select className={inputCls} value={form.promotionId} onChange={e => set('promotionId', e.target.value)} required>
              {promotions.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">{t('voucher_label_create_mode')}</label>
            <div className="flex gap-3">
              {(['auto', 'manual'] as const).map(m => (
                <label key={m} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input type="radio" name="mode" value={m} checked={form.mode === m} onChange={() => set('mode', m)} className="accent-[#b11e29]" />
                  {m === 'auto' ? t('voucher_mode_auto') : t('voucher_mode_manual')}
                </label>
              ))}
            </div>
          </div>

          {form.mode === 'auto' ? (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t('voucher_label_code_count')}</label>
              <input type="number" min={1} max={500} className={inputCls} value={form.count} onChange={e => set('count', e.target.value)} />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t('voucher_label_code')}</label>
              <input className={inputCls} value={form.manualCode} onChange={e => set('manualCode', e.target.value.toUpperCase())} placeholder="VD: SUMMER25" maxLength={32} required />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {t('voucher_label_customer')} <span className="text-slate-400 font-normal">({t('voucher_customer_hint')})</span>
            </label>
            <input className={inputCls} value={form.assignedCustomerId} onChange={e => set('assignedCustomerId', e.target.value)} placeholder="cus-001" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t('voucher_label_max_usage')}</label>
              <input type="number" min={1} className={inputCls} value={form.maxUsageTotal} onChange={e => set('maxUsageTotal', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t('voucher_label_expires')}</label>
              <input type="date" className={inputCls} value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">{t('btn_cancel')}</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-[#b11e29] text-white font-medium hover:bg-[#8e1820] disabled:opacity-50">
              {saving ? t('voucher_btn_creating') : t('voucher_btn_create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========== COPY BUTTON ==========

function CopyButton({ text }: { text: string }) {
  const { t } = useTranslation('pricing')
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button onClick={handleCopy} title={t('tooltip_copy_code')} className="ml-1 text-slate-400 hover:text-[#b11e29] transition-colors">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

// ========== MAIN PAGE ==========

export function VouchersPage() {
  const { t } = useTranslation('pricing')
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<'' | 'true' | 'false'>('')
  const [showCreate, setShowCreate] = useState(false)

  const filters = useMemo(() => ({
    search: search || undefined,
    isActive: activeFilter === 'true' ? true : activeFilter === 'false' ? false : undefined,
  }), [search, activeFilter])

  const { data: vouchers = [], isLoading } = useVouchers(filters)
  const { data: promotions = [] } = usePromotions({})
  const createMutation = useCreateVouchers()
  const revokeMutation = useRevokeVoucher()

  const stats = useMemo(() => ({
    total: vouchers.length,
    active: vouchers.filter(v => v.isActive).length,
    used: vouchers.filter(v => v.currentUsageCount > 0).length,
    assigned: vouchers.filter(v => !!v.assignedCustomerId).length,
  }), [vouchers])

  const visiblePromotions = promotions.filter(p =>
    p.requiresVoucherCode && (p.status === 'active' || p.status === 'scheduled' || p.status === 'draft')
  )

  const handleCreate = async (data: Parameters<typeof createMutation.mutateAsync>[0]) => {
    try {
      await createMutation.mutateAsync(data)
      setShowCreate(false)
    } catch {
      alert(t('voucher_create_error'))
    }
  }

  const handleRevoke = async (v: VoucherCode) => {
    if (confirm(t('voucher_confirm_revoke', { code: v.code }))) {
      try {
        await revokeMutation.mutateAsync(v.id)
      } catch {
        alert(t('voucher_revoke_error'))
      }
    }
  }

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '–'
  const isExpired = (d?: string) => d ? new Date(d) < new Date() : false

  return (
    <>
      <Header title={t('page_title_vouchers')} subtitle={t('page_subtitle_vouchers')} />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t('voucher_stat_total'), value: stats.total, icon: <Ticket className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
              { label: t('voucher_stat_active'), value: stats.active, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
              { label: t('voucher_stat_used'), value: stats.used, icon: <XCircle className="w-5 h-5" />, color: 'bg-slate-50 text-slate-500' },
              { label: t('voucher_stat_assigned'), value: stats.assigned, icon: <User className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.color}`}>{c.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{c.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#b11e29]" />
                <h2 className="font-semibold text-slate-800">{t('voucher_list_title')}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]" placeholder={t('voucher_search_placeholder')} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]" value={activeFilter} onChange={e => setActiveFilter(e.target.value as '' | 'true' | 'false')}>
                  <option value="">{t('voucher_filter_all')}</option>
                  <option value="true">{t('voucher_filter_active')}</option>
                  <option value="false">{t('voucher_filter_inactive')}</option>
                </select>
                <button onClick={() => setShowCreate(true)} disabled={visiblePromotions.length === 0} className="flex items-center gap-1.5 px-4 py-2 bg-[#b11e29] text-white text-sm font-medium rounded-lg hover:bg-[#8e1820] transition-colors disabled:opacity-40 whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  {t('btn_create_code')}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm">{t('voucher_loading')}</div>
            ) : vouchers.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">{t('voucher_empty')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-100">
                      <th className="text-left font-medium px-5 py-3">{t('voucher_col_code')}</th>
                      <th className="text-left font-medium px-5 py-3">{t('voucher_col_promotion')}</th>
                      <th className="text-left font-medium px-5 py-3">{t('voucher_col_assigned')}</th>
                      <th className="text-center font-medium px-5 py-3">{t('voucher_col_used')}</th>
                      <th className="text-left font-medium px-5 py-3">{t('voucher_col_expires')}</th>
                      <th className="text-center font-medium px-5 py-3">{t('voucher_col_status')}</th>
                      <th className="text-right font-medium px-5 py-3">{t('voucher_col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {vouchers.map(v => {
                      const expired = isExpired(v.expiresAt)
                      const fullyUsed = !!(v.maxUsageTotal && v.currentUsageCount >= v.maxUsageTotal)
                      return (
                        <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-semibold text-slate-800 tracking-wide">{v.code}</span>
                              <CopyButton text={v.code} />
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-slate-700">{v.promotionName}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            {v.assignedCustomerName ? (
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <User className="w-3.5 h-3.5 text-purple-400" />
                                {v.assignedCustomerName}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs">Public</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`font-medium ${fullyUsed ? 'text-slate-400' : 'text-slate-700'}`}>
                              {v.currentUsageCount}{v.maxUsageTotal ? `/${v.maxUsageTotal}` : ''}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className={`flex items-center gap-1 text-xs ${expired ? 'text-red-500' : 'text-slate-500'}`}>
                              {expired && <Clock className="w-3.5 h-3.5" />}
                              {formatDate(v.expiresAt)}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {v.isActive && !expired && !fullyUsed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                <CheckCircle className="w-3 h-3" />{t('voucher_status_active')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                <XCircle className="w-3 h-3" />{expired ? t('voucher_status_expired') : fullyUsed ? t('voucher_status_fully_used') : t('voucher_status_revoked')}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {v.isActive && !expired && !fullyUsed && (
                              <button onClick={() => handleRevoke(v)} disabled={revokeMutation.isPending} className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors">
                                {t('btn_revoke')}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {showCreate && (
        <CreateModal
          promotions={visiblePromotions.map(p => ({ id: p.id, name: p.name, code: p.code }))}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          saving={createMutation.isPending}
        />
      )}
    </>
  )
}
