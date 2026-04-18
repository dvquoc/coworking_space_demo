import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search, X, CheckCircle2, AlertCircle, XCircle,
  Eye, TrendingUp, LayoutGrid, ChevronLeft, ChevronRight,
  Plus, Trash2,
} from 'lucide-react'
import Header from '../components/layout/Header'
import { mockCustomers } from '../mocks/customerMocks'
import { mockBookings } from '../mocks/bookingMocks'
import { mockContracts } from '../mocks/contractMocks'
import type {
  Invoice, InvoicePaymentStatus, InvoicePaymentMethod,
  InvoiceItem, InvoiceType,
} from '../types/invoice'
import { useInvoices, useRecordPayment } from '../hooks/useInvoices'

function fmt(n: number) { return n.toLocaleString('vi-VN') + '\u0111' }
function fmtDate(s: string) {
  return new Date(s + (s.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('vi-VN')
}
function isOverdue(inv: Invoice) {
  return (inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partial')
    && new Date(inv.dueDate + 'T23:59:59') < new Date()
}

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
type SourceFilter = '' | 'booking' | 'contract' | 'credit_topup'
type InvoiceSource = 'booking' | 'contract' | 'credit_topup'
type InvoiceWithStatus = Invoice & { computedStatus: InvoicePaymentStatus }

const PAGE_SIZE = 8

const EMPTY_ITEM: InvoiceItem = { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }

export default function InvoicesPage() {
  const { t } = useTranslation('invoices')

  const [statusTab, setStatusTab] = useState<StatusFilter>('all')
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailInv, setDetailInv] = useState<InvoiceWithStatus | null>(null)
  const [payInv, setPayInv] = useState<InvoiceWithStatus | null>(null)

  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState<InvoicePaymentMethod>('cash')
  const [payNotes, setPayNotes] = useState('')
  const [paySuccess, setPaySuccess] = useState(false)

  const [showCreate, setShowCreate] = useState(false)
  const [cSource, setCSource] = useState<InvoiceSource>('booking')
  const [cCustomerId, setCCustomerId] = useState('')
  const [cSourceId, setCSourceId] = useState('')
  const [cInvoiceType, setCInvoiceType] = useState<InvoiceType>('full')
  const [cDepositPercent, setCDepositPercent] = useState(30)
  const [cInvoiceDate, setCInvoiceDate] = useState(new Date().toISOString().slice(0, 10))
  const [cDueDate, setCDueDate] = useState('')
  const [cItems, setCItems] = useState<InvoiceItem[]>([{ ...EMPTY_ITEM }])
  const [cDiscount, setCDiscount] = useState(0)
  const [cTaxPercent, setCTaxPercent] = useState(10)
  const [cNotes, setCNotes] = useState('')
  const [cErrors, setCErrors] = useState<Record<string, string>>({})

  const { data: rawInvoices = [] } = useInvoices()
  const recordPayment = useRecordPayment()

  const invoiceList = useMemo<InvoiceWithStatus[]>(() =>
    rawInvoices.map(inv => ({
      ...inv,
      computedStatus: (isOverdue(inv) ? 'overdue' : inv.paymentStatus) as InvoicePaymentStatus,
    })), [rawInvoices])

  const filtered = useMemo(() => {
    return invoiceList.filter(inv => {
      if (statusTab !== 'all' && inv.computedStatus !== statusTab) return false
      if (sourceFilter && inv.source !== sourceFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return inv.invoiceCode.toLowerCase().includes(q)
          || inv.customerName.toLowerCase().includes(q)
          || inv.sourceCode.toLowerCase().includes(q)
      }
      return true
    })
  }, [invoiceList, statusTab, sourceFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { all: invoiceList.length }
    for (const inv of invoiceList) c[inv.computedStatus] = (c[inv.computedStatus] ?? 0) + 1
    return c
  }, [invoiceList])

  const kpis = useMemo(() => {
    const thisMonth = '2026-04'
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

  function openCreateModal() {
    setCSource('booking')
    setCCustomerId('')
    setCSourceId('')
    setCInvoiceType('full')
    setCDepositPercent(30)
    setCInvoiceDate(new Date().toISOString().slice(0, 10))
    setCDueDate('')
    setCItems([{ ...EMPTY_ITEM }])
    setCDiscount(0)
    setCTaxPercent(10)
    setCNotes('')
    setCErrors({})
    setShowCreate(true)
  }

  const customerBookings = useMemo(() => {
    if (!cCustomerId || cSource !== 'booking') return []
    return mockBookings.filter(b =>
      b.customerId === cCustomerId && (b.status === 'confirmed' || b.status === 'pending' || b.status === 'in_progress')
    )
  }, [cCustomerId, cSource])

  const customerContracts = useMemo(() => {
    if (!cCustomerId || cSource !== 'contract') return []
    const customer = mockCustomers.find(c => c.id === cCustomerId)
    if (!customer) return []
    return mockContracts.filter(ct =>
      ct.customerName === customer.fullName && (ct.status === 'active' || ct.status === 'expiring_soon')
    )
  }, [cCustomerId, cSource])

  function handleSourceSelect(sourceId: string) {
    setCSourceId(sourceId)
    if (cSource === 'booking') {
      const bk = mockBookings.find(b => b.id === sourceId)
      if (bk) {
        setCItems([{
          description: bk.spaceName + ' \u2013 ' + bk.bookingCode,
          quantity: 1,
          unitPrice: bk.finalPrice,
          totalPrice: bk.finalPrice,
        }])
      }
    } else if (cSource === 'contract') {
      const ct = mockContracts.find(c => c.id === sourceId)
      if (ct) {
        setCItems([{
          description: ct.spaceName + ' \u2013 ' + ct.contractCode,
          quantity: 1,
          unitPrice: ct.monthlyFee,
          totalPrice: ct.monthlyFee,
        }])
      }
    }
  }

  function updateItem(index: number, field: keyof InvoiceItem, value: string | number) {
    setCItems(prev => {
      const next = [...prev]
      const item = { ...next[index] }
      if (field === 'description') {
        item.description = value as string
      } else {
        const num = typeof value === 'string' ? (parseFloat(value) || 0) : value
        if (field === 'quantity') item.quantity = num
        if (field === 'unitPrice') item.unitPrice = num
      }
      item.totalPrice = item.quantity * item.unitPrice
      next[index] = item
      return next
    })
  }

  function removeItem(index: number) {
    setCItems(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev)
  }

  function addItem() {
    setCItems(prev => [...prev, { ...EMPTY_ITEM }])
  }

  const cSubtotal = cItems.reduce((s, it) => s + it.totalPrice, 0)
  const cTaxAmount = Math.round((cSubtotal - cDiscount) * cTaxPercent / 100)
  const cTotal = cSubtotal - cDiscount + cTaxAmount
  const cFinalTotal = cInvoiceType === 'deposit' ? Math.round(cTotal * cDepositPercent / 100) : cTotal

  function validateCreate(): boolean {
    const errs: Record<string, string> = {}
    if (!cCustomerId) errs.customer = t('create_err_customer')
    if (cSource !== 'credit_topup' && !cSourceId) errs.source = t('create_err_source')
    if (!cDueDate) errs.dueDate = t('create_err_due_date')
    if (cItems.every(it => !it.description || it.totalPrice <= 0)) errs.items = t('create_err_items')
    setCErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleCreateInvoice() {
    if (!validateCreate()) return

    const customer = mockCustomers.find(c => c.id === cCustomerId)
    let sourceCode = ''
    if (cSource === 'booking') {
      sourceCode = mockBookings.find(b => b.id === cSourceId)?.bookingCode || ''
    } else if (cSource === 'contract') {
      sourceCode = mockContracts.find(c => c.id === cSourceId)?.contractCode || ''
    } else {
      sourceCode = 'CA-' + (customer?.customerCode || '')
    }

    const now = new Date().toISOString()
    const newInvoice: InvoiceWithStatus = {
      id: 'inv-new-' + Date.now(),
      invoiceCode: 'INV-' + new Date().toISOString().slice(0, 7).replace('-', '') + '-' + String(invoiceList.length + 1).padStart(3, '0'),
      customerId: cCustomerId,
      customerName: customer?.fullName || '',
      source: cSource,
      sourceId: cSourceId || cCustomerId,
      sourceCode,
      invoiceType: cInvoiceType,
      depositPercent: cInvoiceType === 'deposit' ? cDepositPercent : undefined,
      invoiceDate: cInvoiceDate,
      dueDate: cDueDate,
      items: cItems.filter(it => it.description && it.totalPrice > 0),
      subtotal: cSubtotal,
      discountAmount: cDiscount,
      taxPercent: cTaxPercent,
      taxAmount: cTaxAmount,
      totalAmount: cFinalTotal,
      paymentStatus: 'unpaid',
      paidAmount: 0,
      notes: cNotes || undefined,
      createdBy: 'staff-001',
      createdAt: now,
      updatedAt: now,
      computedStatus: 'unpaid',
    }

    setShowCreate(false)
    openPay(newInvoice)
  }

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

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100">
              <div className="flex overflow-x-auto">
                {STATUS_TABS.map(tab => (
                  <button key={tab.key} onClick={() => { setStatusTab(tab.key); setPage(1) }}
                    className={'flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 shrink-0 transition-colors '
                      + (statusTab === tab.key
                        ? (tab.key !== 'all' ? S_CFG[tab.key as InvoicePaymentStatus].tab : 'border-[#b11e29] text-[#b11e29]')
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50')}>
                    {tab.key !== 'all' && statusTab === tab.key && (
                      <span className={'w-1.5 h-1.5 rounded-full ' + S_CFG[tab.key as InvoicePaymentStatus].dot} />
                    )}
                    {tab.label}
                    {tabCounts[tab.key] > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">
                        {tabCounts[tab.key]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 px-4 shrink-0">
                <select
                  value={sourceFilter}
                  onChange={e => { setSourceFilter(e.target.value as SourceFilter); setPage(1) }}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                >
                  <option value="">{t('filter_all_sources')}</option>
                  <option value="booking">{t('source_booking')}</option>
                  <option value="contract">{t('source_contract')}</option>
                  <option value="credit_topup">{t('source_credit_topup')}</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 w-52"
                    placeholder={t('search_placeholder')}
                    value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  />
                </div>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('btn_create_invoice')}
                </button>
              </div>
            </div>

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
                      className={'grid grid-cols-[130px_1fr_130px_100px_100px_120px_130px_80px] gap-3 items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors ' + (isDue ? 'bg-red-50/20' : '')}>
                      <span className="text-xs font-mono font-semibold text-slate-700">{inv.invoiceCode}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{inv.customerName}</p>
                      </div>
                      <div className="min-w-0">
                        <span className={'text-xs px-2 py-0.5 rounded-full font-medium ' + (inv.source === 'booking' ? 'bg-blue-50 text-blue-600' : inv.source === 'contract' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600')}>
                          {t('source_' + inv.source)}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{inv.sourceCode}</p>
                      </div>
                      <span className="text-xs text-slate-500">{fmtDate(inv.invoiceDate)}</span>
                      <span className={'text-xs font-medium ' + (isDue ? 'text-red-600 font-semibold' : 'text-slate-500')}>
                        {fmtDate(inv.dueDate)}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-700">{fmt(inv.totalAmount)}</p>
                        {inv.paidAmount > 0 && inv.paidAmount < inv.totalAmount && (
                          <p className="text-[10px] text-green-600">{t('paid_partial', { amount: fmt(inv.paidAmount) })}</p>
                        )}
                      </div>
                      <span className={'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ' + cfg.badge}>
                        <span className={'w-1.5 h-1.5 rounded-full shrink-0 ' + cfg.dot} />
                        {t('status_' + inv.computedStatus)}
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
                      className={'w-7 h-7 rounded-lg text-xs font-medium transition-colors '
                        + (page === p ? 'bg-[#b11e29] text-white' : 'hover:bg-slate-200 text-slate-600')}>
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
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-slate-400 mb-0.5">{t('detail_invoice_date')}</p><p className="font-medium">{fmtDate(detailInv.invoiceDate)}</p></div>
                <div><p className="text-xs text-slate-400 mb-0.5">{t('detail_due_date')}</p>
                  <p className={'font-medium ' + (detailInv.computedStatus === 'overdue' ? 'text-red-600' : '')}>{fmtDate(detailInv.dueDate)}</p>
                </div>
                <div><p className="text-xs text-slate-400 mb-0.5">{t('detail_source')}</p>
                  <p className="font-medium">{t('source_' + detailInv.source)}: <span className="font-mono text-sm">{detailInv.sourceCode}</span></p>
                </div>
                <div><p className="text-xs text-slate-400 mb-0.5">{t('detail_status')}</p>
                  <span className={'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ' + S_CFG[detailInv.computedStatus].badge}>
                    <span className={'w-1.5 h-1.5 rounded-full ' + S_CFG[detailInv.computedStatus].dot} />
                    {t('status_' + detailInv.computedStatus)}
                  </span>
                </div>
                {detailInv.paymentMethod && (
                  <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">{t('detail_payment_method')}</p>
                    <p className="font-medium">{t('method_' + detailInv.paymentMethod)}</p>
                  </div>
                )}
              </div>

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
                      <label key={m} className={'flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-all '
                        + (payMethod === m ? 'border-[#b11e29] bg-[#b11e29]/5' : 'border-slate-200 hover:border-slate-300')}>
                        <input type="radio" name="pm" value={m} className="accent-[#b11e29]"
                          checked={payMethod === m} onChange={() => setPayMethod(m)} />
                        <span className="text-slate-700">{t('method_' + m)}</span>
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

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h2 className="font-semibold text-slate-800 text-lg">{t('create_title')}</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('create_source')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={cSource}
                    onChange={e => { setCSource(e.target.value as InvoiceSource); setCSourceId(''); setCItems([{ ...EMPTY_ITEM }]) }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  >
                    <option value="booking">{t('source_booking')}</option>
                    <option value="contract">{t('source_contract')}</option>
                    <option value="credit_topup">{t('source_credit_topup')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('create_customer')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={cCustomerId}
                    onChange={e => { setCCustomerId(e.target.value); setCSourceId(''); setCItems([{ ...EMPTY_ITEM }]) }}
                    className={'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 ' + (cErrors.customer ? 'border-rose-300' : 'border-slate-200')}
                  >
                    <option value="">{t('create_select_customer')}</option>
                    {mockCustomers.filter(c => c.status === 'active').map(c => (
                      <option key={c.id} value={c.id}>{c.fullName} ({c.customerCode})</option>
                    ))}
                  </select>
                  {cErrors.customer && <p className="text-xs text-rose-500 mt-1">{cErrors.customer}</p>}
                </div>
              </div>

              {cSource !== 'credit_topup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {cSource === 'booking' ? t('create_select_booking') : t('create_select_contract')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={cSourceId}
                    onChange={e => handleSourceSelect(e.target.value)}
                    className={'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 ' + (cErrors.source ? 'border-rose-300' : 'border-slate-200')}
                    disabled={!cCustomerId}
                  >
                    <option value="">{!cCustomerId ? t('create_pick_customer_first') : t('create_select_option')}</option>
                    {cSource === 'booking' && customerBookings.map(b => (
                      <option key={b.id} value={b.id}>{b.bookingCode} \u2013 {b.spaceName} ({fmt(b.finalPrice)})</option>
                    ))}
                    {cSource === 'contract' && customerContracts.map(ct => (
                      <option key={ct.id} value={ct.id}>{ct.contractCode} \u2013 {ct.spaceName} ({fmt(ct.monthlyFee)}/th\u00e1ng)</option>
                    ))}
                  </select>
                  {cErrors.source && <p className="text-xs text-rose-500 mt-1">{cErrors.source}</p>}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_invoice_type')}</label>
                  <select
                    value={cInvoiceType}
                    onChange={e => setCInvoiceType(e.target.value as InvoiceType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  >
                    <option value="full">{t('invoice_type_full')}</option>
                    <option value="deposit">{t('invoice_type_deposit')}</option>
                    <option value="balance">{t('invoice_type_balance')}</option>
                  </select>
                </div>
                {cInvoiceType === 'deposit' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_deposit_percent')}</label>
                    <select
                      value={cDepositPercent}
                      onChange={e => setCDepositPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                    >
                      <option value={30}>30%</option>
                      <option value={50}>50%</option>
                      <option value={100}>100%</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_invoice_date')}</label>
                  <input type="date" value={cInvoiceDate} onChange={e => setCInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('create_due_date')} <span className="text-rose-500">*</span>
                  </label>
                  <input type="date" value={cDueDate} onChange={e => setCDueDate(e.target.value)}
                    className={'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 ' + (cErrors.dueDate ? 'border-rose-300' : 'border-slate-200')} />
                  {cErrors.dueDate && <p className="text-xs text-rose-500 mt-1">{cErrors.dueDate}</p>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">{t('create_items_title')} <span className="text-rose-500">*</span></label>
                  <button onClick={addItem} className="inline-flex items-center gap-1 text-xs text-[#b11e29] hover:underline font-medium">
                    <Plus className="w-3 h-3" /> {t('create_add_item')}
                  </button>
                </div>
                {cErrors.items && <p className="text-xs text-rose-500 mb-2">{cErrors.items}</p>}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[1fr_70px_110px_110px_36px] gap-2 px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-400 uppercase">
                    <span>{t('detail_col_description')}</span>
                    <span className="text-center">{t('detail_col_qty')}</span>
                    <span className="text-right">{t('detail_col_unit_price')}</span>
                    <span className="text-right">{t('detail_col_total_price')}</span>
                    <span />
                  </div>
                  {cItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_70px_110px_110px_36px] gap-2 px-3 py-2 border-t border-slate-100 items-center">
                      <input
                        value={item.description}
                        onChange={e => updateItem(idx, 'description', e.target.value)}
                        placeholder={t('create_item_desc_placeholder')}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#b11e29]/30"
                      />
                      <input type="number" min={1}
                        value={item.quantity}
                        onChange={e => updateItem(idx, 'quantity', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#b11e29]/30"
                      />
                      <input type="number" min={0}
                        value={item.unitPrice}
                        onChange={e => updateItem(idx, 'unitPrice', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#b11e29]/30"
                      />
                      <span className="text-sm font-medium text-slate-700 text-right pr-1">{fmt(item.totalPrice)}</span>
                      <button onClick={() => removeItem(idx)}
                        className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 disabled:opacity-30"
                        disabled={cItems.length <= 1}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">{t('create_discount')}</label>
                    <input type="number" min={0} value={cDiscount} onChange={e => setCDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b11e29]/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">{t('create_tax_percent')}</label>
                    <input type="number" min={0} max={100} value={cTaxPercent} onChange={e => setCTaxPercent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b11e29]/30" />
                  </div>
                </div>
                <div className="space-y-1.5 text-sm pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-slate-500">
                    <span>{t('detail_subtotal')}</span><span>{fmt(cSubtotal)}</span>
                  </div>
                  {cDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('detail_discount')}</span><span>-{fmt(cDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>{t('detail_vat', { percent: cTaxPercent })}</span><span>+{fmt(cTaxAmount)}</span>
                  </div>
                  {cInvoiceType === 'deposit' && (
                    <div className="flex justify-between text-orange-600 text-xs">
                      <span>{t('create_deposit_note', { percent: cDepositPercent })}</span>
                      <span>{fmt(cTotal)} x {cDepositPercent}%</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2">
                    <span>{t('detail_grand_total')}</span>
                    <span className="text-[#b11e29]">{fmt(cFinalTotal)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('pay_notes_label')}</label>
                <textarea rows={2} value={cNotes} onChange={e => setCNotes(e.target.value)}
                  placeholder={t('create_notes_placeholder')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
              <button onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                {t('btn_cancel')}
              </button>
              <button onClick={handleCreateInvoice}
                className="flex-1 py-2.5 bg-[#b11e29] text-white rounded-xl text-sm font-semibold hover:bg-[#8f1820]">
                {t('create_submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
