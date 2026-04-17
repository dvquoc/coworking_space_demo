import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search, X, CheckCircle2, AlertCircle, XCircle,
  Eye, TrendingUp, LayoutGrid, ChevronLeft, ChevronRight,
} from 'lucide-react'
import Header from '../components/layout/Header'
import type {
  Invoice, InvoicePaymentStatus, InvoicePaymentMethod,
} from '../types/invoice'
import { useInvoices, useRecordPayment } from '../hooks/useInvoices'

// ─── Helpers ───────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('vi-VN') + 'đ' }
function fmtDate(s: string) {
  return new Date(s + (s.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('vi-VN')
}
function isOverdue(inv: Invoice) {
  return (inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partial')
    && new Date(inv.dueDate + 'T23:59:59') < new Date()
}

// ─── Status config ─────────────────────────────────────────
const S_CFG: Record<InvoicePaymentStatus, { badge: string; dot: string; tab: string }> = {
  unpaid:    { badge: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400',  tab: 'border-amber-500 text-amber-600' },
  partial:   { badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400', tab: 'border-orange-500 text-orange-600' },
  paid:      { badge: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500',  tab: 'border-green-600 text-green-600' },
  overdue:   { badge: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-500',    tab: 'border-red-600 text-red-600' },
  cancelled: { badge: 'bg-slate-100 text-slate-500 border-slate-200',  dot: 'bg-slate-300',  tab: 'border-slate-400 text-slate-500' },
}

const PAYMENT_METHOD_IDS: InvoicePaymentMethod[] = [
  'cash', 'bank_transfer', 'vnpay', 'momo', 'zalopay',
]

type StatusFilter = 'all' | InvoicePaymentStatus
type InvoiceWithStatus = Invoice & { computedStatus: InvoicePaymentStatus }

const PAGE_SIZE = 8

// ─── Page ──────────────────────────────────────────────────
export default function InvoicesPage() {
  const { t } = useTranslation('invoices')

  // Invoice tab state
  const [statusTab, setStatusTab] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailInv, setDetailInv] = useState<InvoiceWithStatus | null>(null)
  const [payInv, setPayInv] = useState<InvoiceWithStatus | null>(null)

  // Record payment form
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState<InvoicePaymentMethod>('cash')
  const [payNotes, setPayNotes] = useState('')
  const [paySuccess, setPaySuccess] = useState(false)

  // Hooks
  const { data: rawInvoices = [] } = useInvoices()
  const recordPayment = useRecordPayment()

  // ── Computed invoice list with real-time overdue check ──
  const invoiceList = useMemo<InvoiceWithStatus[]>(() =>
    rawInvoices.map(inv => ({
      ...inv,
      computedStatus: (isOverdue(inv) ? 'overdue' : inv.paymentStatus) as InvoicePaymentStatus,
    })), [rawInvoices])

  const filtered = useMemo(() => {
    setPage(1)
    return invoiceList.filter(inv => {
      if (statusTab !== 'all' && inv.computedStatus !== statusTab) return false
      if (search) {
        const q = search.toLowerCase()
        return inv.invoiceCode.toLowerCase().includes(q)
          || inv.customerName.toLowerCase().includes(q)
          || inv.sourceCode.toLowerCase().includes(q)
      }
      return true
    })
  }, [invoiceList, statusTab, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { all: invoiceList.length }
    for (const inv of invoiceList) c[inv.computedStatus] = (c[inv.computedStatus] ?? 0) + 1
    return c
  }, [invoiceList])

  // ── KPIs ──
  const kpis = useMemo(() => {
    const thisMonth = `2026-04`
    let unpaidAmt = 0, overdueCount = 0, collectedMonth = 0
    for (const inv of invoiceList) {
      if (inv.computedStatus === 'unpaid' || inv.computedStatus === 'partial')
        unpaidAmt += inv.totalAmount - inv.paidAmount
      if (inv.computedStatus === 'overdue') overdueCount++
      if (inv.paymentStatus === 'paid' && inv.paidAt?.startsWith(thisMonth))
        collectedMonth += inv.paidAmount
    }
    return { unpaidAmt, overdueCount, collectedMonth }
  }, [invoiceList])

  // ── Record payment handlers ──
  function openPay(inv: InvoiceWithStatus) {
    setPayInv(inv)
    setPayAmount(String(inv.totalAmount - inv.paidAmount))
    setPayMethod('cash')
    setPayNotes('')
    setPaySuccess(false)
  }

  function handleConfirmPayment() {
    if (!payInv || !payAmount || Number(payAmount) <= 0) return
    recordPayment.mutate(
      { invoiceId: payInv.id, amount: Number(payAmount), paymentMethod: payMethod, notes: payNotes || undefined },
      { onSuccess: () => setPaySuccess(true) },
    )
  }

  // ── Status tabs ──
  const STATUS_TABS: Array<{ key: StatusFilter; label: string }> = [
    { key: 'all', label: t('tab_all') },
    { key: 'unpaid', label: t('tab_unpaid') },
    { key: 'partial', label: t('tab_partial') },
    { key: 'overdue', label: t('tab_overdue') },
    { key: 'paid', label: t('tab_paid') },
    { key: 'cancelled', label: t('tab_cancelled') },
  ]

  return (
    <>
      <Header title={t('page_title')} subtitle={t('page_subtitle')} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <p className="text-xs text-slate-500">{t('kpi_unpaid')}</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">{fmt(kpis.unpaidAmt)}</p>
                    <p className="text-xs text-slate-400 mt-1">{t('kpi_unpaid_count', { count: (tabCounts['unpaid'] ?? 0) + (tabCounts['partial'] ?? 0) })}</p>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-red-500">{t('kpi_overdue')}</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{kpis.overdueCount}</p>
                    <p className="text-xs text-red-400 mt-1">{t('kpi_overdue_note')}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <p className="text-xs text-slate-500">{t('kpi_collected', { month: '4/2026' })}</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{fmt(kpis.collectedMonth)}</p>
                    <p className="text-xs text-slate-400 mt-1">{t('kpi_collected_count', { count: tabCounts['paid'] ?? 0 })}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-2">
                    <LayoutGrid className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-500">{t('kpi_total')}</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-700">{invoiceList.length}</p>
                    <p className="text-xs text-slate-400 mt-1">{t('kpi_total_note')}</p>
                </div>
                </div>

                {/* Table card */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Status sub-tabs + search */}
                <div className="flex items-center justify-between border-b border-slate-100">
                    <div className="flex overflow-x-auto">
                    {STATUS_TABS.map(t => (
                        <button key={t.key} onClick={() => setStatusTab(t.key)}
                        className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 shrink-0 transition-colors
                            ${statusTab === t.key
                            ? `${t.key !== 'all' ? S_CFG[t.key as InvoicePaymentStatus].tab : 'border-[#b11e29] text-[#b11e29]'}`
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                        {t.key !== 'all' && statusTab === t.key && (
                            <span className={`w-1.5 h-1.5 rounded-full ${S_CFG[t.key as InvoicePaymentStatus].dot}`} />
                        )}
                        {t.label}
                        {tabCounts[t.key] > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">
                            {tabCounts[t.key]}
                            </span>
                        )}
                        </button>
                    ))}
                    </div>
                    <div className="px-4 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                        className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 w-52"
                        placeholder={t('search_placeholder')}
                        value={search} onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-[130px_1fr_130px_100px_100px_120px_130px_80px] gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    <span>{t('col_invoice_code')}</span>
                    <span>{t('col_customer')}</span>
                    <span>{t('col_source')}</span>
                    <span>{t('col_invoice_date')}</span>
                    <span>{t('col_due_date')}</span>
                    <span className="text-right">{t('col_total')}</span>
                    <span>{t('col_status')}</span>
                    <span />
                </div>

                {/* Table rows */}
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                    <LayoutGrid className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">{t('empty')}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                    {paginated.map(inv => {
                        const cfg = S_CFG[inv.computedStatus]
                        const isDue = inv.computedStatus === 'overdue'
                        const canPay = inv.computedStatus === 'unpaid' || inv.computedStatus === 'overdue' || inv.computedStatus === 'partial'
                        return (
                        <div key={inv.id}
                            className={`grid grid-cols-[130px_1fr_130px_100px_100px_120px_130px_80px] gap-3 items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors ${isDue ? 'bg-red-50/20' : ''}`}>
                            <span className="text-xs font-mono font-semibold text-slate-700">{inv.invoiceCode}</span>
                            <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{inv.customerName}</p>
                            </div>
                            <div className="min-w-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.source === 'booking' ? 'bg-blue-50 text-blue-600' : inv.source === 'contract' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                                {t(`source_${inv.source}`)}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{inv.sourceCode}</p>
                            </div>
                            <span className="text-xs text-slate-500">{fmtDate(inv.invoiceDate)}</span>
                            <span className={`text-xs font-medium ${isDue ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                            {fmtDate(inv.dueDate)}
                            </span>
                            <div className="text-right">
                            <p className="text-sm font-semibold text-slate-700">{fmt(inv.totalAmount)}</p>
                            {inv.paidAmount > 0 && inv.paidAmount < inv.totalAmount && (
                                <p className="text-[10px] text-green-600">{t('paid_partial', { amount: fmt(inv.paidAmount) })}</p>
                            )}
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                            {t(`status_${inv.computedStatus}`)}
                            </span>
                            <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => setDetailInv(inv)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title={t('btn_view')}>
                                <Eye className="w-4 h-4 text-slate-400" />
                            </button>
                            {canPay && (
                                <button onClick={() => openPay(inv)}
                                className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title={t('btn_record_payment')}>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </button>
                            )}
                            </div>
                        </div>
                        )
                    })}
                    </div>
                )}

                {/* Pagination */}
                {filtered.length > 0 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-xs text-slate-400">
                      {t('pagination_showing', { from: (page - 1) * PAGE_SIZE + 1, to: Math.min(page * PAGE_SIZE, filtered.length), total: filtered.length })}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                            ${page === p ? 'bg-[#b11e29] text-white' : 'hover:bg-slate-200 text-slate-600'}`}>
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                )}
                </div>
        </div>
      </main>

      {/* ══ Modal: Invoice Detail ══ */}
      {detailInv && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="font-semibold text-slate-800">{detailInv.invoiceCode}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{detailInv.customerName}</p>
              </div>
              <button onClick={() => setDetailInv(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-slate-400 mb-0.5">{t('detail_invoice_date')}</p><p className="font-medium">{fmtDate(detailInv.invoiceDate)}</p></div>
                <div><p className="text-xs text-slate-400 mb-0.5">{t('detail_due_date')}</p>
                  <p className={`font-medium ${detailInv.computedStatus === 'overdue' ? 'text-red-600' : ''}`}>{fmtDate(detailInv.dueDate)}</p>
                </div>
                <div><p className="text-xs text-slate-400 mb-0.5">{t('detail_source')}</p>
                  <p className="font-medium">{t(`source_${detailInv.source}`)}: <span className="font-mono text-sm">{detailInv.sourceCode}</span></p>
                </div>
                <div><p className="text-xs text-slate-400 mb-0.5">{t('detail_status')}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${S_CFG[detailInv.computedStatus].badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${S_CFG[detailInv.computedStatus].dot}`} />
                    {t(`status_${detailInv.computedStatus}`)}
                  </span>
                </div>
                {detailInv.paymentMethod && (
                  <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">{t('detail_payment_method')}</p>
                    <p className="font-medium">{t(`method_${detailInv.paymentMethod}`)}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{t('detail_items_title')}</p>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[1fr_48px_90px_96px] text-xs font-semibold text-slate-400 bg-slate-50 px-4 py-2.5">
                    <span>{t('detail_col_description')}</span><span className="text-center">{t('detail_col_qty')}</span>
                    <span className="text-right">{t('detail_col_unit_price')}</span><span className="text-right">{t('detail_col_total_price')}</span>
                  </div>
                  {detailInv.items.map((it, i) => (
                    <div key={i} className="grid grid-cols-[1fr_48px_90px_96px] text-sm px-4 py-2.5 border-t border-slate-50 hover:bg-slate-50/50">
                      <span className="text-slate-700">{it.description}</span>
                      <span className="text-center text-slate-500">{it.quantity}</span>
                      <span className="text-right text-slate-500">{fmt(it.unitPrice)}</span>
                      <span className="text-right font-medium text-slate-700">{fmt(it.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500"><span>{t('detail_subtotal')}</span><span>{fmt(detailInv.subtotal)}</span></div>
                {detailInv.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600"><span>{t('detail_discount')}</span><span>-{fmt(detailInv.discountAmount)}</span></div>
                )}
                {detailInv.taxAmount > 0 && (
                  <div className="flex justify-between text-slate-500"><span>{t('detail_vat', { percent: detailInv.taxPercent })}</span><span>+{fmt(detailInv.taxAmount)}</span></div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2">
                  <span>{t('detail_grand_total')}</span><span className="text-[#b11e29]">{fmt(detailInv.totalAmount)}</span>
                </div>
                {detailInv.paidAmount > 0 && (
                  <div className="flex justify-between text-green-600"><span>{t('detail_paid_amount')}</span><span>{fmt(detailInv.paidAmount)}</span></div>
                )}
                {detailInv.paidAmount < detailInv.totalAmount && detailInv.paymentStatus !== 'cancelled' && (
                  <div className="flex justify-between font-semibold text-amber-600">
                    <span>{t('detail_remaining')}</span><span>{fmt(detailInv.totalAmount - detailInv.paidAmount)}</span>
                  </div>
                )}
              </div>
              {detailInv.notes && (
                <p className="text-xs text-slate-500 italic bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">{detailInv.notes}</p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
              <button onClick={() => setDetailInv(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                {t('btn_close')}
              </button>
              {(detailInv.computedStatus === 'unpaid' || detailInv.computedStatus === 'overdue' || detailInv.computedStatus === 'partial') && (
                <button onClick={() => { openPay(detailInv); setDetailInv(null) }}
                  className="flex-1 py-2.5 bg-[#b11e29] text-white rounded-xl text-sm font-semibold hover:bg-[#8f1820]">
                  {t('btn_record_payment')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Record Payment ══ */}
      {payInv && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h2 className="font-semibold text-slate-800">{t('pay_title')}</h2>
              <button onClick={() => setPayInv(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            {paySuccess ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-slate-800 text-lg">{t('pay_success_title')}</p>
                <p className="text-sm text-slate-500 text-center">{t('pay_success_message', { code: payInv.invoiceCode })}</p>
                <button onClick={() => setPayInv(null)}
                  className="mt-2 px-6 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820]">
                  {t('btn_close')}
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-1.5">
                  <div className="flex justify-between text-slate-600"><span>{t('pay_invoice')}</span><span className="font-mono font-medium">{payInv.invoiceCode}</span></div>
                  <div className="flex justify-between text-slate-600"><span>{t('pay_customer')}</span><span className="font-medium">{payInv.customerName}</span></div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('pay_remaining')}</span>
                    <span className="font-bold text-[#b11e29] text-base">{fmt(payInv.totalAmount - payInv.paidAmount)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t('pay_amount_label')}</label>
                  <input type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                    value={payAmount} onChange={e => setPayAmount(e.target.value)}
                    placeholder={t('pay_amount_placeholder', { max: (payInv.totalAmount - payInv.paidAmount).toLocaleString() })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">{t('pay_method_label')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHOD_IDS.map(m => (
                      <label key={m} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-all
                        ${payMethod === m ? 'border-[#b11e29] bg-[#b11e29]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input type="radio" name="pm" value={m} className="accent-[#b11e29]"
                          checked={payMethod === m} onChange={() => setPayMethod(m)} />
                        <span className="text-slate-700">{t(`method_${m}`)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t('pay_notes_label')}</label>
                  <textarea rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                    placeholder={t('pay_notes_placeholder')} value={payNotes} onChange={e => setPayNotes(e.target.value)} />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setPayInv(null)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                    {t('btn_cancel')}
                  </button>
                  <button onClick={handleConfirmPayment} disabled={!payAmount || Number(payAmount) <= 0 || recordPayment.isPending}
                    className="flex-1 py-2.5 bg-[#b11e29] text-white rounded-xl text-sm font-semibold hover:bg-[#8f1820] disabled:opacity-40 disabled:cursor-not-allowed">
                    {t('btn_confirm')}
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

