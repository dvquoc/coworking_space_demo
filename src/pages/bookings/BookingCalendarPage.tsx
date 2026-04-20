import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, X, Clock, AlertCircle, CheckCircle2,
  Minus, Plus, CreditCard, Banknote, Smartphone, LayoutGrid, User,
  Landmark, Wallet, Building2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Header from '../../components/layout/Header'
import { mockBuildings, mockFloors, mockSpaces, mockPricingRules } from '../../mocks/propertyMocks'
import { mockBookingList } from '../../mocks/bookingMocks'
import { mockBookingAddOns } from '../../mocks/pricingMocks'
import { mockCustomers } from '../../mocks/customerMocks'

const DAY_KEYS = ['day_sun', 'day_mon', 'day_tue', 'day_wed', 'day_thu', 'day_fri', 'day_sat']
const MONTH_KEYS = ['month_1', 'month_2', 'month_3', 'month_4', 'month_5', 'month_6', 'month_7', 'month_8', 'month_9', 'month_10', 'month_11', 'month_12']

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-400', confirmed: 'bg-blue-500',
  completed: 'bg-green-500', cancelled: 'bg-slate-300',
}
const STATUS_LABEL_KEYS: Record<string, string> = {
  pending: 'status_short_pending', confirmed: 'status_short_confirmed', completed: 'status_completed', cancelled: 'status_cancelled',
}
const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-slate-100 text-slate-500',
}
const PAYMENT_METHODS = [
  { id: 'vnpay', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'momo', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'zalopay', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'cash', icon: <Banknote className="w-4 h-4" /> },
  { id: 'bank_transfer', icon: <Landmark className="w-4 h-4" /> },
  { id: 'credit', icon: <Wallet className="w-4 h-4" /> },
]

const PAYMENT_METHOD_KEYS: Record<string, string> = {
  vnpay: 'method_vnpay', momo: 'method_momo', zalopay: 'method_zalopay',
  cash: 'method_cash', bank_transfer: 'method_bank_transfer', credit: 'method_credit',
}

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay() }
function formatPrice(p: number) { return p.toLocaleString('vi-VN') + 'đ' }
function calcMins(start: string, end: string) {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}
function formatDateVN(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export function BookingCalendarPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('bookings')
  const today = new Date()

  // Filter state
  const [buildingId, setBuildingId] = useState('')
  const [floorId, setFloorId] = useState('')
  const [spaceId, setSpaceId] = useState('')

  // Calendar nav
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // Modal state
  const [modalDate, setModalDate] = useState<string | null>(null)
  const [modalStep, setModalStep] = useState<1 | 2>(1)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({})
  const [customerId, setCustomerId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [notes, setNotes] = useState('')
  const [conflict, setConflict] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [sendInvoiceZalo, setSendInvoiceZalo] = useState(true)
  const [sendInvoiceEmail, setSendInvoiceEmail] = useState(true)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Modal space selection (cascading: building → floor → space)
  const [modalBuildingId, setModalBuildingId] = useState('')
  const [modalFloorId, setModalFloorId] = useState('')
  const [modalSpaceId, setModalSpaceId] = useState('')

  // Cascading selects (filter bar)
  const floors = useMemo(() => mockFloors.filter(f => f.buildingId === buildingId && f.status === 'active'), [buildingId])
  const spaces = useMemo(() => mockSpaces.filter(s => s.floorId === floorId && s.status !== 'maintenance'), [floorId])

  // Cascading selects (modal)
  const modalFloors = useMemo(() => mockFloors.filter(f => f.buildingId === modalBuildingId && f.status === 'active'), [modalBuildingId])
  const modalSpaces = useMemo(() => mockSpaces.filter(s => s.floorId === modalFloorId && s.status !== 'maintenance'), [modalFloorId])
  const selectedSpace = useMemo(() => mockSpaces.find(s => s.id === modalSpaceId), [modalSpaceId])
  const pricePerHour = useMemo(() => {
    if (!selectedSpace) return 0
    return mockPricingRules.find(p => p.spaceType === selectedSpace.type)?.pricePerHour ?? 0
  }, [selectedSpace])

  // Filter bar selected space (for calendar dot display)
  const filterSelectedSpace = useMemo(() => mockSpaces.find(s => s.id === spaceId), [spaceId])

  // Bookings filtered by selected space for calendar display
  const bookingsByDate = useMemo(() => {
    const map: Record<string, typeof mockBookingList> = {}
    for (const b of mockBookingList) {
      if (spaceId && b.spaceName !== filterSelectedSpace?.name) continue
      const key = b.startTime.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(b)
    }
    return map
  }, [spaceId, filterSelectedSpace])

  // Bookings for selected date (in modal) — filtered by modal space
  const dayBookings = useMemo(() => {
    if (!modalDate) return []
    return mockBookingList.filter(b => {
      const dateMatch = b.startTime.slice(0, 10) === modalDate
      const spaceMatch = !modalSpaceId || b.spaceName === selectedSpace?.name
      return dateMatch && spaceMatch
    })
  }, [modalDate, modalSpaceId, selectedSpace])

  // Price calculation
  const duration = calcMins(startTime, endTime)
  const durationHours = duration / 60
  const spacePrice = pricePerHour * durationHours
  const servicesPrice = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
    const addon = mockBookingAddOns.find(a => a.id === id)
    return sum + (addon ? addon.unitPrice * qty : 0)
  }, 0)
  const discountAmount = (spacePrice + servicesPrice) * discountPercent / 100
  const afterDiscount = spacePrice + servicesPrice - discountAmount
  const taxAmount = afterDiscount * 0.1
  const totalPrice = afterDiscount + taxAmount

  // Calendar helpers
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const prevMonth = () => viewMonth === 0 ? (setViewYear(y => y - 1), setViewMonth(11)) : setViewMonth(m => m - 1)
  const nextMonth = () => viewMonth === 11 ? (setViewYear(y => y + 1), setViewMonth(0)) : setViewMonth(m => m + 1)
  const toDateStr = (day: number) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const isToday = (day: number) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day

  // Open modal
  const openModal = (dateStr: string) => {
    setModalDate(dateStr)
    setModalStep(1)
    setStartTime(new Date().toTimeString().slice(0, 5))
    setEndTime(() => { const d = new Date(); d.setHours(d.getHours() + 1); return d.toTimeString().slice(0, 5) })
    setSelectedAddOns({})
    setCustomerId('')
    setCustomerName('')
    setCustomerPhone('')
    setCustomerEmail('')
    setDiscountPercent(0)
    setNotes('')
    setConflict(null)
    setPaymentMethod('')
    setSendInvoiceZalo(true)
    setSendInvoiceEmail(true)
    setPaymentSuccess(false)
    // Initialize modal space from filter bar
    setModalBuildingId(buildingId)
    setModalFloorId(floorId)
    setModalSpaceId(spaceId)
  }

  // Handle booking submit
  const handleBook = () => {
    if (!modalSpaceId) { setConflict(t('conflict_select_space')); return }
    if (!startTime || !endTime) { setConflict(t('conflict_select_time')); return }
    if (calcMins(startTime, endTime) <= 0) { setConflict(t('conflict_end_after_start')); return }
    const overlapping = dayBookings.find(b => {
      if (b.status === 'cancelled') return false
      const bs = b.startTime.slice(11, 16)
      const be = b.endTime.slice(11, 16)
      return startTime < be && endTime > bs
    })
    if (overlapping) {
      setConflict(t('conflict_overlap', { start: overlapping.startTime.slice(11, 16), end: overlapping.endTime.slice(11, 16) }))
      return
    }
    setConflict(null)
    setModalStep(2)
  }

  // Add-on helpers
  const toggleAddOn = (id: string) => setSelectedAddOns(prev => {
    if (prev[id]) { const next = { ...prev }; delete next[id]; return next }
    return { ...prev, [id]: 1 }
  })
  const setAddOnQty = (id: string, qty: number) => {
    if (qty <= 0) setSelectedAddOns(prev => { const next = { ...prev }; delete next[id]; return next })
    else setSelectedAddOns(prev => ({ ...prev, [id]: qty }))
  }

  // Handle payment
  const handlePayment = () => {
    if (!paymentMethod) return
    setPaymentSuccess(true)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={t('page_title_calendar')} subtitle={t('page_subtitle_calendar')} />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">

          {/* ---- Filter Bar ---- */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('label_building_short')}</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  value={buildingId}
                  onChange={e => { setBuildingId(e.target.value); setFloorId(''); setSpaceId('') }}
                >
                  <option value="">{t('placeholder_all_buildings')}</option>
                  {mockBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('label_floor_short')}</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  value={floorId}
                  onChange={e => { setFloorId(e.target.value); setSpaceId('') }}
                  disabled={!buildingId}
                >
                  <option value="">{t('placeholder_all_floors')}</option>
                  {floors.map(f => <option key={f.id} value={f.id}>{f.floorName || t('floor_label', { number: f.floorNumber })}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('label_space_short')}</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  value={spaceId}
                  onChange={e => setSpaceId(e.target.value)}
                  disabled={!floorId}
                >
                  <option value="">{t('placeholder_all_spaces')}</option>
                  {spaces.map(s => {
                    const price = mockPricingRules.find(p => p.spaceType === s.type)?.pricePerHour
                    return <option key={s.id} value={s.id}>{s.name}{price ? ` · ${(price / 1000).toFixed(0)}k/h` : ''}</option>
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* ---- Calendar (compact) ---- */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Nav */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
              <h2 className="text-sm font-semibold text-slate-700">{t(MONTH_KEYS[viewMonth])} {viewYear}</h2>
              <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
            </div>
            {/* Day labels */}
            <div className="grid grid-cols-7 border-b border-slate-100">
              {DAY_KEYS.map(d => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">{t(d)}</div>
              ))}
            </div>
            {/* Grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} className="h-16 border-b border-r border-slate-50" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateStr = toDateStr(day)
                const dayBks = bookingsByDate[dateStr] ?? []
                const _isToday = isToday(day)
                const activeBks = dayBks.filter(b => b.status !== 'cancelled')
                return (
                  <div
                    key={day}
                    onClick={() => openModal(dateStr)}
                    className="h-16 border-b border-r border-slate-50 p-1 cursor-pointer hover:bg-[#b11e29]/5 transition-colors overflow-hidden group"
                  >
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mx-auto mb-0.5
                      ${_isToday ? 'bg-[#b11e29] text-white' : 'text-slate-600 group-hover:text-[#b11e29]'}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {activeBks.slice(0, 2).map(b => (
                        <div key={b.id} className="flex items-center gap-0.5 px-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[b.status]}`} />
                          <span className="text-[10px] text-slate-500 truncate">{b.startTime.slice(11, 16)}</span>
                        </div>
                      ))}
                      {activeBks.length > 2 && <div className="text-[10px] text-slate-400 pl-1">+{activeBks.length - 2}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 text-xs text-slate-400">
            {Object.entries(STATUS_LABEL_KEYS).map(([s, k]) => (
              <div key={s} className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />{t(k)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* =============== MODAL =============== */}
      {modalDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="min-w-0">
                <p className="text-xs text-slate-400 mb-1">{formatDateVN(modalDate)}{selectedSpace ? ` · ${selectedSpace.name}` : ''}</p>
                {/* Step indicator */}
                <div className="flex items-center gap-1">
                  {[{ no: 1, label: t('step1_label') }, { no: 2, label: t('step2_label_short') }].map((s, i, arr) => (
                    <div key={s.no} className="flex items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0
                        ${paymentSuccess ? 'bg-green-500 border-green-500 text-white'
                          : modalStep === s.no ? 'bg-[#b11e29] border-[#b11e29] text-white'
                          : modalStep > s.no ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-slate-300 text-slate-400'}`}>
                        {(!paymentSuccess && modalStep > s.no) || paymentSuccess
                          ? <CheckCircle2 className="w-3.5 h-3.5" />
                          : s.no}
                      </div>
                      <span className={`text-xs font-medium whitespace-nowrap
                        ${paymentSuccess ? 'text-green-600'
                          : modalStep === s.no ? 'text-[#b11e29]'
                          : modalStep > s.no ? 'text-green-600'
                          : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                      {i < arr.length - 1 && (
                        <div className={`h-px w-8 mx-1 ${modalStep > s.no ? 'bg-green-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setModalDate(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors ml-4 shrink-0">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Payment success */}
            {paymentSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{t('success_title')}</h3>
                <p className="text-sm text-slate-500">{t('success_message')}</p>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/bookings')} className="px-5 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820]">
                    {t('btn_view_list_short')}
                  </button>
                  <button onClick={() => setModalDate(null)} className="px-5 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                    {t('btn_close')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 overflow-hidden">

                {/* ---- LEFT: existing bookings ---- */}
                <div className="w-72 shrink-0 border-r border-slate-100 flex flex-col bg-slate-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-white">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('calendar_booked')}</p>
                    {!modalSpaceId && <p className="text-[11px] text-slate-400 mt-0.5">{t('calendar_select_space')}</p>}
                  </div>
                  <div className="flex-1 overflow-auto p-3 space-y-2">
                    {dayBookings.filter(b => b.status !== 'cancelled').length === 0 ? (
                      <div className="flex flex-col items-center justify-center pt-10 gap-2 text-slate-400">
                        <LayoutGrid className="w-8 h-8 opacity-30" />
                        <p className="text-xs text-center">{modalSpaceId ? t('calendar_no_bookings') : t('calendar_no_data')}</p>
                      </div>
                    ) : (
                      dayBookings.filter(b => b.status !== 'cancelled').map(b => (
                        <div key={b.id} className="bg-white rounded-lg border border-slate-100 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_BADGE[b.status]}`}>
                              {t(STATUS_LABEL_KEYS[b.status])}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {b.startTime.slice(11, 16)}–{b.endTime.slice(11, 16)}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-700 truncate">{b.spaceName}</p>
                          <p className="text-[11px] text-slate-400 truncate">{b.customerName}</p>
                          {/* Time bar */}
                          <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${STATUS_DOT[b.status]}`}
                              style={{
                                marginLeft: `${(parseInt(b.startTime.slice(11, 13)) / 24) * 100}%`,
                                width: `${(calcMins(b.startTime.slice(11, 16), b.endTime.slice(11, 16)) / (24 * 60)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* ---- RIGHT: booking form or payment ---- */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  {modalStep === 1 ? (
                    <>
                    <div className="flex-1 overflow-auto p-5 space-y-4">
                      {/* Customer */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                          <User className="w-4 h-4 text-[#b11e29]" /> {t('section_customer_info')}
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 mb-2"
                          value={customerId}
                          onChange={e => {
                            const c = mockCustomers.find(x => x.id === e.target.value)
                            setCustomerId(e.target.value)
                            setCustomerName(c?.fullName ?? '')
                            setCustomerPhone((c as any)?.phone ?? (c as any)?.contactPhone ?? '')
                            setCustomerEmail(c?.email ?? '')
                          }}
                        >
                          <option value="">{t('placeholder_select_customer')}</option>
                          {mockCustomers.filter(c => c.status === 'active').map(c => (
                            <option key={c.id} value={c.id}>{c.fullName} ({c.customerCode})</option>
                          ))}
                        </select>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                            placeholder={t('label_customer_name')}
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                          />
                          <input
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                            placeholder={t('label_phone')}
                            value={customerPhone}
                            onChange={e => setCustomerPhone(e.target.value)}
                          />
                          <input
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                            placeholder={t('label_email')}
                            type="email"
                            value={customerEmail}
                            onChange={e => setCustomerEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Space selection */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                          <Building2 className="w-4 h-4 text-[#b11e29]" /> {t('section_space')}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">{t('label_building_short')}</p>
                            <select
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                              value={modalBuildingId}
                              onChange={e => { setModalBuildingId(e.target.value); setModalFloorId(''); setModalSpaceId('') }}
                            >
                              <option value="">{t('placeholder_select_building')}</option>
                              {mockBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">{t('label_floor_short')}</p>
                            <select
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                              value={modalFloorId}
                              onChange={e => { setModalFloorId(e.target.value); setModalSpaceId('') }}
                              disabled={!modalBuildingId}
                            >
                              <option value="">{t('placeholder_select_floor')}</option>
                              {modalFloors.map(f => <option key={f.id} value={f.id}>{f.floorName || t('floor_label', { number: f.floorNumber })}</option>)}
                            </select>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">{t('label_space_short')}</p>
                            <select
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                              value={modalSpaceId}
                              onChange={e => setModalSpaceId(e.target.value)}
                              disabled={!modalFloorId}
                            >
                              <option value="">{t('placeholder_select_space')}</option>
                              {modalSpaces.map(s => {
                                const price = mockPricingRules.find(p => p.spaceType === s.type)?.pricePerHour
                                return <option key={s.id} value={s.id}>{s.name}{price ? ` · ${(price / 1000).toFixed(0)}k/h` : ''}</option>
                              })}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Time */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                          <Clock className="w-4 h-4 text-[#b11e29]" /> {t('label_time_slot')}
                        </label>
                        <p className="text-base font-bold text-slate-800 mb-2">
                          {new Date(modalDate + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">{t('label_start')}</p>
                            <input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                              value={startTime} onChange={e => { setStartTime(e.target.value); setConflict(null) }} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">{t('label_end')}</p>
                            <input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                              value={endTime} onChange={e => { setEndTime(e.target.value); setConflict(null) }} />
                          </div>
                        </div>
                        {duration > 0 && (
                          <p className="text-xs text-slate-400 mt-1">{t('label_duration')}: {Math.floor(duration / 60)}h{duration % 60 > 0 ? ` ${duration % 60}m` : ''}</p>
                        )}
                      </div>

                      {/* Tiền thuê không gian */}
                      {selectedSpace && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                          <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-[#b11e29]" /> {t('section_space_price')}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">{t('label_unit_price')}</span>
                            <span className="font-medium text-slate-700">
                              {pricePerHour > 0 ? t('price_per_hour', { price: formatPrice(pricePerHour) }) : <span className="text-slate-400 italic">{t('no_price')}</span>}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">{t('label_duration')}</span>
                            <span className="font-medium text-slate-700">
                              {duration > 0
                                ? `${Math.floor(duration / 60)}h${duration % 60 > 0 ? ` ${duration % 60}m` : ''} (${(durationHours % 1 === 0 ? durationHours.toFixed(0) : durationHours.toFixed(2).replace(/0+$/, ''))} ${t('duration_hours', { hours: '' }).trim()})`
                                : <span className="text-slate-400 italic">{t('no_time_selected')}</span>}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className="font-semibold text-slate-700 text-sm">{t('label_rental_total')}</span>
                            <span className={`text-base font-bold ${spacePrice > 0 ? 'text-[#b11e29]' : 'text-slate-400'}`}>
                              {spacePrice > 0 ? formatPrice(spacePrice) : '—'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Space amenities */}
                      {selectedSpace?.amenities && selectedSpace.amenities.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-2">{t('section_amenities')}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedSpace.amenities.map((a: string) => (
                              <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                ✓ {a}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{t('amenities_included')}</p>
                        </div>
                      )}

                      {/* Add-on services */}
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">{t('section_addons')}</p>
                        {(['av', 'catering', 'printing', 'internet', 'support', 'other'] as const).map(cat => {
                          const catAddOns = mockBookingAddOns.filter(a => a.category === cat)
                          const catLabels: Record<string, string> = {
                            av: t('addon_cat_av'), catering: t('addon_cat_catering'), printing: t('addon_cat_printing'),
                            internet: t('addon_cat_internet'), support: t('addon_cat_support'), other: t('addon_cat_other'),
                          }
                          return (
                            <div key={cat} className="mb-3">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{catLabels[cat]}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {catAddOns.map(addon => {
                                  const qty = selectedAddOns[addon.id] ?? 0
                                  const checked = qty > 0
                                  return (
                                    <div key={addon.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all ${checked ? 'border-[#b11e29] bg-[#b11e29]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                                      <input type="checkbox" className="accent-[#b11e29] shrink-0"
                                        checked={checked} onChange={() => toggleAddOn(addon.id)} />
                                      <span className="text-lg leading-none shrink-0">{addon.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700">{addon.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{addon.description}</p>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="text-xs font-semibold text-slate-700">{formatPrice(addon.unitPrice)}</p>
                                        <p className="text-[10px] text-slate-400">/{addon.unit}</p>
                                      </div>
                                      {checked && (
                                        <div className="flex items-center gap-1 shrink-0">
                                          <button type="button" onClick={() => setAddOnQty(addon.id, qty - 1)}
                                            className="w-6 h-6 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-100">
                                            <Minus className="w-3 h-3 text-slate-500" />
                                          </button>
                                          <span className="w-6 text-center text-sm font-semibold text-slate-700">{qty}</span>
                                          <button type="button" onClick={() => setAddOnQty(addon.id, qty + 1)}
                                            className="w-6 h-6 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-100">
                                            <Plus className="w-3 h-3 text-slate-500" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Discount & Notes */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-2">{t('section_discount')}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 w-20 shrink-0">{t('label_discount')}</span>
                            <button type="button" onClick={() => setDiscountPercent(v => Math.max(0, v - 5))}
                              className="p-1 border border-slate-200 rounded hover:bg-slate-50">
                              <Minus className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                            <input type="number" min={0} max={100}
                              className="w-16 text-center px-2 py-1 border border-slate-200 rounded text-sm"
                              value={discountPercent}
                              onChange={e => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))} />
                            <button type="button" onClick={() => setDiscountPercent(v => Math.min(100, v + 5))}
                              className="p-1 border border-slate-200 rounded hover:bg-slate-50">
                              <Plus className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                            {discountAmount > 0 && <span className="text-xs text-green-600">-{formatPrice(discountAmount)}</span>}
                          </div>
                        </div>
                        <div>
                          <textarea rows={2} placeholder={t('placeholder_notes')}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                            value={notes} onChange={e => setNotes(e.target.value)} />
                        </div>
                      </div>

                    </div>

                    {/* ── Sticky footer ── */}
                    <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 space-y-3">
                      {/* Price summary */}
                      {totalPrice > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-sm">
                          <div className="flex justify-between text-slate-500">
                            <span>{t('label_space_bottom')} ({durationHours.toFixed(1)}h × {formatPrice(pricePerHour)})</span>
                            <span>{formatPrice(spacePrice)}</span>
                          </div>
                          {servicesPrice > 0 && (
                            <div className="flex justify-between text-slate-500">
                              <span>{t('label_addons')}</span>
                              <span>{formatPrice(servicesPrice)}</span>
                            </div>
                          )}
                          {discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>{t('label_discount_bottom')} ({discountPercent}%)</span>
                              <span>-{formatPrice(discountAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-500">
                            <span>{t('vat_label')}</span>
                            <span>+{formatPrice(taxAmount)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1.5">
                            <span>{t('total')}</span>
                            <span className="text-[#b11e29]">{formatPrice(totalPrice)}</span>
                          </div>
                        </div>
                      )}
                      {/* Conflict error */}
                      {conflict && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{conflict}</span>
                        </div>
                      )}
                      {/* Book button */}
                      <button
                        onClick={handleBook}
                        className="w-full py-3 bg-[#b11e29] text-white rounded-xl font-semibold hover:bg-[#8f1820] transition-colors"
                      >
                        {t('btn_book')}
                      </button>
                    </div>
                    </>
                  ) : (
                    /* ---- PAYMENT STEP ---- */
                    <div className="flex-1 overflow-auto p-5 space-y-4">
                      {/* Summary */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
                        {customerName && (
                          <div className="flex justify-between text-slate-600">
                            <span>{t('section_customer_info')}</span>
                            <span className="font-medium text-right">
                              {customerName}
                              {customerPhone ? ` – ${customerPhone}` : ''}
                              {customerEmail ? ` · ${customerEmail}` : ''}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-600">
                          <span>{t('label_date')}</span>
                          <span className="font-medium">{new Date(modalDate + 'T00:00:00').toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>{t('label_time_slot')}</span>
                          <span className="font-medium">{startTime} – {endTime}</span>
                        </div>
                        {selectedSpace && (
                          <div className="flex justify-between text-slate-600">
                            <span>{t('label_space_short')}</span>
                            <span className="font-medium">{selectedSpace.name}</span>
                          </div>
                        )}
                        {Object.keys(selectedAddOns).length > 0 && (
                          <div className="flex justify-between text-slate-600">
                            <span>{t('label_addons')}</span>
                            <span className="font-medium text-right max-w-[60%]">
                              {Object.entries(selectedAddOns).map(([id, qty]) => {
                                const a = mockBookingAddOns.find(x => x.id === id)
                                return a ? `${a.icon} ${a.name} ×${qty}` : ''
                              }).filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-500">
                          <span>{t('vat_label')}</span>
                          <span className="font-medium text-slate-700">+{formatPrice(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2">
                          <span className="text-slate-700">{t('total')}</span>
                          <span className="text-[#b11e29]">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>

                      {/* Payment method */}
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">{t('section_payment_method')}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {PAYMENT_METHODS.map(m => (
                            <label key={m.id} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                              ${paymentMethod === m.id ? 'border-[#b11e29] bg-[#b11e29]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                              <input type="radio" name="pm" value={m.id} className="accent-[#b11e29]"
                                checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
                              {m.icon}
                              <span className="text-sm font-medium text-slate-700">{t(PAYMENT_METHOD_KEYS[m.id])}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Gửi hóa đơn */}
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">{t('section_send_invoice')}</p>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="accent-[#b11e29] w-4 h-4"
                              checked={sendInvoiceZalo} onChange={e => setSendInvoiceZalo(e.target.checked)} />
                            <div>
                              <p className="text-sm font-medium text-slate-700">{t('send_invoice_zalo')}</p>
                              <p className="text-xs text-slate-400">{t('send_invoice_zalo_desc')}</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="accent-[#b11e29] w-4 h-4"
                              checked={sendInvoiceEmail} onChange={e => setSendInvoiceEmail(e.target.checked)} />
                            <div>
                              <p className="text-sm font-medium text-slate-700">{t('send_invoice_email')}</p>
                              <p className="text-xs text-slate-400">{customerEmail ? t('send_invoice_email_desc', { email: customerEmail }) : t('send_invoice_no_email')}</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setModalStep(1)}
                          className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                        >
                          {t('btn_back')}
                        </button>
                        <button
                          type="button"
                          onClick={handlePayment}
                          disabled={!paymentMethod}
                          className="flex-1 py-2.5 bg-[#b11e29] text-white rounded-xl font-semibold hover:bg-[#8f1820] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          {t('btn_confirm_payment')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCalendarPage
