import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, X, Clock, AlertCircle, CheckCircle2,
  Minus, Plus, CreditCard, Banknote, Smartphone, LayoutGrid, User,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { mockBuildings, mockFloors, mockSpaces, mockPricingRules } from '../../mocks/propertyMocks'
import { mockBookingList } from '../../mocks/bookingMocks'
import { mockBookingAddOns } from '../../mocks/pricingMocks'
import { mockCustomers } from '../../mocks/customerMocks'

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const MONTH_LABELS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-400', confirmed: 'bg-blue-500',
  completed: 'bg-green-500', cancelled: 'bg-slate-300',
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ TT', confirmed: 'Đã XN', completed: 'Hoàn thành', cancelled: 'Đã hủy',
}
const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-slate-100 text-slate-500',
}
const PAYMENT_METHODS = [
  { id: 'vnpay', label: 'VNPay', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'momo', label: 'MoMo', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'zalopay', label: 'ZaloPay', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'cash', label: 'Tiền mặt', icon: <Banknote className="w-4 h-4" /> },
]

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
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Cascading selects
  const floors = useMemo(() => mockFloors.filter(f => f.buildingId === buildingId && f.status === 'active'), [buildingId])
  const spaces = useMemo(() => mockSpaces.filter(s => s.floorId === floorId && s.status !== 'maintenance'), [floorId])
  const selectedSpace = useMemo(() => mockSpaces.find(s => s.id === spaceId), [spaceId])
  const pricePerHour = useMemo(() => {
    if (!selectedSpace) return 0
    return mockPricingRules.find(p => p.spaceType === selectedSpace.type)?.pricePerHour ?? 0
  }, [selectedSpace])

  // Bookings filtered by selected space for calendar display
  const bookingsByDate = useMemo(() => {
    const map: Record<string, typeof mockBookingList> = {}
    for (const b of mockBookingList) {
      if (spaceId && b.spaceName !== selectedSpace?.name) continue
      const key = b.startTime.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(b)
    }
    return map
  }, [spaceId, selectedSpace])

  // Bookings for selected date (in modal) — filtered by space
  const dayBookings = useMemo(() => {
    if (!modalDate) return []
    return mockBookingList.filter(b => {
      const dateMatch = b.startTime.slice(0, 10) === modalDate
      const spaceMatch = !spaceId || b.spaceName === selectedSpace?.name
      return dateMatch && spaceMatch
    })
  }, [modalDate, spaceId, selectedSpace])

  // Price calculation
  const duration = calcMins(startTime, endTime)
  const durationHours = duration / 60
  const spacePrice = pricePerHour * durationHours
  const servicesPrice = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
    const addon = mockBookingAddOns.find(a => a.id === id)
    return sum + (addon ? addon.unitPrice * qty : 0)
  }, 0)
  const discountAmount = (spacePrice + servicesPrice) * discountPercent / 100
  const totalPrice = spacePrice + servicesPrice - discountAmount

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
    setStartTime('')
    setEndTime('')
    setSelectedAddOns({})
    setCustomerId('')
    setCustomerName('')
    setCustomerPhone('')
    setCustomerEmail('')
    setDiscountPercent(0)
    setNotes('')
    setConflict(null)
    setPaymentMethod('')
    setPaymentSuccess(false)
  }

  // Handle booking submit
  const handleBook = () => {
    if (!spaceId) { setConflict('Vui lòng chọn không gian ở bộ lọc phía trên trước khi đặt.'); return }
    if (!startTime || !endTime) { setConflict('Vui lòng chọn giờ bắt đầu và kết thúc.'); return }
    if (calcMins(startTime, endTime) <= 0) { setConflict('Giờ kết thúc phải sau giờ bắt đầu.'); return }
    const overlapping = dayBookings.find(b => {
      if (b.status === 'cancelled') return false
      const bs = b.startTime.slice(11, 16)
      const be = b.endTime.slice(11, 16)
      return startTime < be && endTime > bs
    })
    if (overlapping) {
      setConflict(`Không gian đã được đặt từ ${overlapping.startTime.slice(11, 16)} đến ${overlapping.endTime.slice(11, 16)}. Vui lòng chọn khung giờ khác.`)
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
      <Header title="Đặt Chỗ theo lịch" subtitle='Kiểm tra lịch trùng trước khi đặt chỗ' />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">

          {/* ---- Filter Bar ---- */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tòa nhà</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  value={buildingId}
                  onChange={e => { setBuildingId(e.target.value); setFloorId(''); setSpaceId('') }}
                >
                  <option value="">-- Tất cả tòa nhà --</option>
                  {mockBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tầng</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  value={floorId}
                  onChange={e => { setFloorId(e.target.value); setSpaceId('') }}
                  disabled={!buildingId}
                >
                  <option value="">-- Tất cả tầng --</option>
                  {floors.map(f => <option key={f.id} value={f.id}>{f.floorName || `Tầng ${f.floorNumber}`}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Không gian</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                  value={spaceId}
                  onChange={e => setSpaceId(e.target.value)}
                  disabled={!floorId}
                >
                  <option value="">-- Tất cả không gian --</option>
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
              <h2 className="text-sm font-semibold text-slate-700">{MONTH_LABELS[viewMonth]} {viewYear}</h2>
              <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
            </div>
            {/* Day labels */}
            <div className="grid grid-cols-7 border-b border-slate-100">
              {DAY_LABELS.map(d => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">{d}</div>
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
            {Object.entries(STATUS_LABEL).map(([s, l]) => (
              <div key={s} className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />{l}</div>
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
                  {[{ no: 1, label: 'Thông tin đặt chỗ' }, { no: 2, label: 'Thanh toán' }].map((s, i, arr) => (
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
                <h3 className="text-lg font-bold text-slate-800">Đặt chỗ thành công!</h3>
                <p className="text-sm text-slate-500">Booking đã được xác nhận. Chỗ đã được giữ cho khách hàng.</p>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/bookings')} className="px-5 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820]">
                    Xem danh sách
                  </button>
                  <button onClick={() => setModalDate(null)} className="px-5 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 overflow-hidden">

                {/* ---- LEFT: existing bookings ---- */}
                <div className="w-72 shrink-0 border-r border-slate-100 flex flex-col bg-slate-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-white">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Lịch đã đặt</p>
                    {!spaceId && <p className="text-[11px] text-slate-400 mt-0.5">Chọn không gian để lọc lịch</p>}
                  </div>
                  <div className="flex-1 overflow-auto p-3 space-y-2">
                    {dayBookings.filter(b => b.status !== 'cancelled').length === 0 ? (
                      <div className="flex flex-col items-center justify-center pt-10 gap-2 text-slate-400">
                        <LayoutGrid className="w-8 h-8 opacity-30" />
                        <p className="text-xs text-center">{spaceId ? 'Chưa có booking nào ngày này' : 'Chưa có dữ liệu'}</p>
                      </div>
                    ) : (
                      dayBookings.filter(b => b.status !== 'cancelled').map(b => (
                        <div key={b.id} className="bg-white rounded-lg border border-slate-100 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_BADGE[b.status]}`}>
                              {STATUS_LABEL[b.status]}
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
                          <User className="w-4 h-4 text-[#b11e29]" /> Khách hàng
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
                          <option value="">-- Chọn từ danh sách --</option>
                          {mockCustomers.filter(c => c.status === 'active').map(c => (
                            <option key={c.id} value={c.id}>{c.fullName} ({c.customerCode})</option>
                          ))}
                        </select>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                            placeholder="Tên khách hàng *"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                          />
                          <input
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                            placeholder="Số điện thoại"
                            value={customerPhone}
                            onChange={e => setCustomerPhone(e.target.value)}
                          />
                          <input
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                            placeholder="Email"
                            type="email"
                            value={customerEmail}
                            onChange={e => setCustomerEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Time */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                          <Clock className="w-4 h-4 text-[#b11e29]" /> Khung giờ
                        </label>
                        <p className="text-base font-bold text-slate-800 mb-2">
                          {new Date(modalDate + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Bắt đầu *</p>
                            <input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                              value={startTime} onChange={e => { setStartTime(e.target.value); setConflict(null) }} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Kết thúc *</p>
                            <input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                              value={endTime} onChange={e => { setEndTime(e.target.value); setConflict(null) }} />
                          </div>
                        </div>
                        {duration > 0 && (
                          <p className="text-xs text-slate-400 mt-1">Thời lượng: {Math.floor(duration / 60)}h{duration % 60 > 0 ? ` ${duration % 60}m` : ''}</p>
                        )}
                      </div>

                      {/* Tiền thuê không gian */}
                      {selectedSpace && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                          <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-[#b11e29]" /> Tiền thuê không gian
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Đơn giá</span>
                            <span className="font-medium text-slate-700">
                              {pricePerHour > 0 ? formatPrice(pricePerHour) + ' / giờ' : <span className="text-slate-400 italic">Chưa có giá</span>}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Thời lượng</span>
                            <span className="font-medium text-slate-700">
                              {duration > 0
                                ? `${Math.floor(duration / 60)}h${duration % 60 > 0 ? ` ${duration % 60}m` : ''} (${(durationHours % 1 === 0 ? durationHours.toFixed(0) : durationHours.toFixed(2).replace(/0+$/, ''))} giờ)`
                                : <span className="text-slate-400 italic">Chưa chọn thời gian</span>}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className="font-semibold text-slate-700 text-sm">Thành tiền thuê</span>
                            <span className={`text-base font-bold ${spacePrice > 0 ? 'text-[#b11e29]' : 'text-slate-400'}`}>
                              {spacePrice > 0 ? formatPrice(spacePrice) : '—'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Space amenities */}
                      {selectedSpace?.amenities && selectedSpace.amenities.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-2">Tiện ích đi kèm không gian</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedSpace.amenities.map((a: string) => (
                              <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                ✓ {a}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Đã bao gồm trong giá thuê không gian</p>
                        </div>
                      )}

                      {/* Add-on services */}
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Dịch vụ sử dụng thêm</p>
                        {(['av', 'catering', 'printing', 'internet', 'support', 'other'] as const).map(cat => {
                          const catAddOns = mockBookingAddOns.filter(a => a.category === cat)
                          const catLabels: Record<string, string> = {
                            av: 'Âm thanh & Hình ảnh', catering: 'Ăn uống', printing: 'In ấn',
                            internet: 'Internet', support: 'Hỗ trợ', other: 'Khác',
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
                          <p className="text-sm font-semibold text-slate-700 mb-2">Ưu đãi & Ghi chú</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 w-20 shrink-0">Giảm giá (%)</span>
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
                          <textarea rows={2} placeholder="Yêu cầu đặc biệt..."
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
                            <span>Không gian ({durationHours.toFixed(1)}h × {formatPrice(pricePerHour)})</span>
                            <span>{formatPrice(spacePrice)}</span>
                          </div>
                          {servicesPrice > 0 && (
                            <div className="flex justify-between text-slate-500">
                              <span>Dịch vụ thêm</span>
                              <span>{formatPrice(servicesPrice)}</span>
                            </div>
                          )}
                          {discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Giảm giá ({discountPercent}%)</span>
                              <span>-{formatPrice(discountAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1.5">
                            <span>Tổng cộng</span>
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
                        Đặt chỗ
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
                            <span>Khách hàng</span>
                            <span className="font-medium text-right">
                              {customerName}
                              {customerPhone ? ` – ${customerPhone}` : ''}
                              {customerEmail ? ` · ${customerEmail}` : ''}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-600">
                          <span>Ngày</span>
                          <span className="font-medium">{new Date(modalDate + 'T00:00:00').toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Khung giờ</span>
                          <span className="font-medium">{startTime} – {endTime}</span>
                        </div>
                        {selectedSpace && (
                          <div className="flex justify-between text-slate-600">
                            <span>Không gian</span>
                            <span className="font-medium">{selectedSpace.name}</span>
                          </div>
                        )}
                        {Object.keys(selectedAddOns).length > 0 && (
                          <div className="flex justify-between text-slate-600">
                            <span>Dịch vụ thêm</span>
                            <span className="font-medium text-right max-w-[60%]">
                              {Object.entries(selectedAddOns).map(([id, qty]) => {
                                const a = mockBookingAddOns.find(x => x.id === id)
                                return a ? `${a.icon} ${a.name} ×${qty}` : ''
                              }).filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2">
                          <span className="text-slate-700">Tổng cộng</span>
                          <span className="text-[#b11e29]">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>

                      {/* Payment method */}
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Phương thức thanh toán</p>
                        <div className="grid grid-cols-2 gap-2">
                          {PAYMENT_METHODS.map(m => (
                            <label key={m.id} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                              ${paymentMethod === m.id ? 'border-[#b11e29] bg-[#b11e29]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                              <input type="radio" name="pm" value={m.id} className="accent-[#b11e29]"
                                checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
                              {m.icon}
                              <span className="text-sm font-medium text-slate-700">{m.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setModalStep(1)}
                          className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                        >
                          Quay lại
                        </button>
                        <button
                          type="button"
                          onClick={handlePayment}
                          disabled={!paymentMethod}
                          className="flex-1 py-2.5 bg-[#b11e29] text-white rounded-xl font-semibold hover:bg-[#8f1820] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Xác nhận & Thanh toán
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
