import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  User,
  Building2,
  Calendar,
  Clock,
  LayoutGrid,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  Wallet,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { mockBuildings, mockFloors, mockSpaces, mockPricingRules } from '../../mocks/propertyMocks'
import { mockBookingAddOns } from '../../mocks/pricingMocks'

// ---- helpers ----
function getDefaultDate() {
  return new Date().toISOString().slice(0, 10)
}

function getDefaultTime(offsetMinutes = 0) {
  const now = new Date()
  now.setMinutes(now.getMinutes() + offsetMinutes)
  return now.toTimeString().slice(0, 5)
}

function calcDurationMinutes(start: string, end: string) {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ'
}

const PAYMENT_METHODS = [
  { id: 'vnpay', label: 'VNPay', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'momo', label: 'MoMo', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'zalopay', label: 'ZaloPay', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'cash', label: 'Tiền mặt', icon: <Banknote className="w-5 h-5" /> },
  { id: 'bank_transfer', label: 'Chuyển khoản', icon: <Landmark className="w-5 h-5" /> },
  { id: 'credit', label: 'Credit', icon: <Wallet className="w-5 h-5" /> },
]

// ---- Step Indicator ----
function StepIndicator({ step }: { step: number }) {
  const steps = [
    { no: 1, label: 'Thông tin đặt chỗ' },
    { no: 2, label: 'Xác nhận & Thanh toán' },
  ]
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.no} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
              ${step === s.no ? 'bg-[#b11e29] border-[#b11e29] text-white' : step > s.no ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
              {step > s.no ? <CheckCircle2 className="w-4 h-4" /> : s.no}
            </div>
            <span className={`text-xs mt-1 font-medium ${step === s.no ? 'text-[#b11e29]' : step > s.no ? 'text-green-600' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-24 mx-2 mb-4 ${step > s.no ? 'bg-green-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ---- Main Component ----
export function BookingFormPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1 state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [buildingId, setBuildingId] = useState('')
  const [floorId, setFloorId] = useState('')
  const [spaceId, setSpaceId] = useState('')
  const [date, setDate] = useState(getDefaultDate)
  const [startTime, setStartTime] = useState(() => getDefaultTime())
  const [endTime, setEndTime] = useState(() => getDefaultTime(60))
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({}) // id -> quantity
  const [discountPercent, setDiscountPercent] = useState(0)
  const [notes, setNotes] = useState('')
  const [conflict, setConflict] = useState<string | null>(null)

  // Step 2 state
  const [paymentMethod, setPaymentMethod] = useState('')
  const [sendInvoiceZalo, setSendInvoiceZalo] = useState(true)
  const [sendInvoiceEmail, setSendInvoiceEmail] = useState(true)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Cascading selects
  const floors = useMemo(() => mockFloors.filter(f => f.buildingId === buildingId && f.status === 'active'), [buildingId])
  const spaces = useMemo(() => mockSpaces.filter(s => s.floorId === floorId && s.status !== 'maintenance'), [floorId])
  const selectedSpace = useMemo(() => mockSpaces.find(s => s.id === spaceId), [spaceId])
  const spacePricePerHour = useMemo(() => {
    if (!selectedSpace) return 0
    return mockPricingRules.find(p => p.spaceType === selectedSpace.type)?.pricePerHour ?? 0
  }, [selectedSpace])

  // Price calculation
  const duration = calcDurationMinutes(startTime, endTime) // phút
  const durationHours = duration / 60
  const spacePrice = spacePricePerHour * durationHours
  const servicesPrice = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
    const addon = mockBookingAddOns.find(a => a.id === id)
    return sum + (addon ? addon.unitPrice * qty : 0)
  }, 0)
  const subtotal = spacePrice + servicesPrice
  const discountAmount = subtotal * (discountPercent / 100)
  const afterDiscount = subtotal - discountAmount
  const taxAmount = afterDiscount * 0.1
  const totalPrice = afterDiscount + taxAmount

  // Toggle/update add-ons
  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => {
      if (prev[id]) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: 1 }
    })
  }

  const setAddOnQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setSelectedAddOns(prev => { const next = { ...prev }; delete next[id]; return next })
    } else {
      setSelectedAddOns(prev => ({ ...prev, [id]: qty }))
    }
  }

  // Giả lập kiểm tra lịch trùng
  const checkConflict = (): boolean => {
    // TODO: thay bằng API thực tế
    if (spaceId === 'sp-002' && date === '2026-04-21' && startTime < '11:00' && endTime > '09:00') {
      setConflict('Không gian đã được đặt từ 09:00 đến 11:00 ngày 21/04/2026. Vui lòng chọn khung giờ khác.')
      return false
    }
    setConflict(null)
    return true
  }

  // Step 1 submit
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkConflict()) return
    setStep(2)
  }

  // Step 2: Xác nhận thanh toán
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: gọi API tạo booking + thanh toán
    setPaymentSuccess(true)
  }

  // Success screen
  if (paymentSuccess) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Tạo Booking" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Đặt chỗ thành công!</h2>
          <p className="text-slate-500 text-sm">Booking đã được xác nhận. Chỗ đã được giữ cho khách hàng.</p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => navigate('/bookings')}
              className="px-5 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820]"
            >
              Xem danh sách booking
            </button>
            <button
              onClick={() => { setStep(1); setPaymentSuccess(false); setCustomerName(''); setSpaceId(''); setDate(''); setStartTime(''); setEndTime('') }}
              className="px-5 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Tạo booking mới
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Tạo Booking Mới" />
      <div className="flex-1 overflow-auto p-6 pb-2">
        <div className="max-w-2xl mx-auto">
          <StepIndicator step={step} />

          {/* ---- STEP 1: Thông tin booking ---- */}
          {step === 1 && (
            <form id="booking-step1" onSubmit={handleStep1Submit} className="space-y-6">
              {/* Khách hàng */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-[#b11e29]" /> Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Tên khách hàng *</label>
                    <input
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      placeholder="Nhập tên hoặc chọn từ danh sách..."
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Số điện thoại</label>
                    <input
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      placeholder="0901234567"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      placeholder="email@example.com"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Chọn không gian */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-[#b11e29]" /> Chọn không gian
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Tòa nhà *</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      value={buildingId}
                      onChange={e => { setBuildingId(e.target.value); setFloorId(''); setSpaceId('') }}
                      required
                    >
                      <option value="">-- Chọn tòa nhà --</option>
                      {mockBuildings.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Tầng *</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      value={floorId}
                      onChange={e => { setFloorId(e.target.value); setSpaceId('') }}
                      disabled={!buildingId}
                      required
                    >
                      <option value="">-- Chọn tầng --</option>
                      {floors.map(f => (
                        <option key={f.id} value={f.id}>{f.floorName || `Tầng ${f.floorNumber}`}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Không gian *</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      value={spaceId}
                      onChange={e => setSpaceId(e.target.value)}
                      disabled={!floorId}
                      required
                    >
                      <option value="">-- Chọn không gian --</option>
                      {spaces.map(s => {
                        const price = mockPricingRules.find(p => p.spaceType === s.type)?.pricePerHour
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name}{price ? ` (${(price / 1000).toLocaleString()}k/giờ)` : ''}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Thời gian */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[#b11e29]" /> Thời gian đặt chỗ
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Ngày *</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Giờ bắt đầu *</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Giờ kết thúc *</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {duration > 0 && (
                  <p className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    Thời lượng: {Math.floor(duration / 60)}h{duration % 60 > 0 ? ` ${duration % 60}m` : ''}
                  </p>
                )}
                {conflict && (
                  <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{conflict}</span>
                  </div>
                )}
              </div>

              {/* Tiền thuê không gian */}
              {selectedSpace && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                    <CreditCard className="w-4 h-4 text-[#b11e29]" /> Tiền thuê không gian
                  </h3>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">Đơn giá</span>
                    <span className="font-medium text-slate-700">
                      {spacePricePerHour > 0 ? formatPrice(spacePricePerHour) + ' / giờ' : <span className="text-slate-400 italic">Chưa có giá</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">Thời lượng</span>
                    <span className="font-medium text-slate-700">
                      {duration > 0
                        ? `${Math.floor(duration / 60)}h${duration % 60 > 0 ? ` ${duration % 60}m` : ''} (${durationHours.toFixed(2).replace(/\.?0+$/, '')} giờ)`
                        : <span className="text-slate-400 italic">Chưa chọn thời gian</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">Thành tiền thuê</span>
                    <span className={`text-lg font-bold ${spacePrice > 0 ? 'text-[#b11e29]' : 'text-slate-400'}`}>
                      {spacePrice > 0 ? formatPrice(spacePrice) : '—'}
                    </span>
                  </div>
                </div>
              )}

              {/* Tiện ích không gian */}
              {selectedSpace && selectedSpace.amenities.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <LayoutGrid className="w-4 h-4 text-[#b11e29]" /> Tiện ích đi kèm không gian
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpace.amenities.map(amenity => (
                      <span key={amenity} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Các tiện ích này đã được bao gồm trong giá thuê không gian.</p>
                </div>
              )}

              {/* Dịch vụ thêm */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-1">
                  <LayoutGrid className="w-4 h-4 text-[#b11e29]" /> Dịch vụ sử dụng thêm
                </h3>
                <p className="text-xs text-slate-400 mb-4">Chọn và nhập số lượng dịch vụ muốn thêm vào booking.</p>
                <div className="grid grid-cols-2 gap-3">
                  {mockBookingAddOns.map(addon => {
                    const qty = selectedAddOns[addon.id] ?? 0
                    const checked = qty > 0
                    return (
                      <div key={addon.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all
                        ${checked ? 'border-[#b11e29] bg-[#b11e29]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input
                          type="checkbox"
                          className="accent-[#b11e29] shrink-0"
                          checked={checked}
                          onChange={() => toggleAddOn(addon.id)}
                        />
                        <span className="text-lg shrink-0">{addon.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700">{addon.name}</p>
                          <p className="text-xs text-slate-400 truncate">{addon.description}</p>
                        </div>
                        <span className="text-xs text-slate-500 shrink-0 whitespace-nowrap">
                          {formatPrice(addon.unitPrice)}/{addon.unit}
                        </span>
                        {checked && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button type="button"
                              onClick={() => setAddOnQty(addon.id, qty - 1)}
                              className="w-6 h-6 rounded-md border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-slate-800">{qty}</span>
                            <button type="button"
                              onClick={() => setAddOnQty(addon.id, qty + 1)}
                              className="w-6 h-6 rounded-md border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Ưu đãi & Ghi chú */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-700 mb-4">Ưu đãi & Ghi chú</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Giảm giá (%)</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setDiscountPercent(v => Math.max(0, v - 5))}
                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <Minus className="w-4 h-4 text-slate-500" />
                      </button>
                      <input
                        type="number" min={0} max={100}
                        className="w-20 text-center px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                        value={discountPercent}
                        onChange={e => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                      />
                      <button type="button" onClick={() => setDiscountPercent(v => Math.min(100, v + 5))}
                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <Plus className="w-4 h-4 text-slate-500" />
                      </button>
                      <span className="text-sm text-slate-500">= -{formatPrice(discountAmount)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Ghi chú</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                      placeholder="Yêu cầu đặc biệt..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            </form>
          )}

          {/* ---- STEP 2: Thanh toán ---- */}
          {step === 2 && (
            <form id="booking-step2" onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Tóm tắt booking */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-700 mb-4">Tóm tắt đặt chỗ</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khách hàng</span>
                    <span className="font-medium text-slate-700 text-right">
                      {customerName}
                      {customerPhone && ` – ${customerPhone}`}
                      {customerEmail && ` · ${customerEmail}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Không gian</span>
                    <span className="font-medium text-slate-700">{selectedSpace?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian</span>
                    <span className="font-medium text-slate-700">{date}, {startTime} – {endTime}</span>
                  </div>
                  {Object.keys(selectedAddOns).length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dịch vụ thêm</span>
                      <span className="font-medium text-slate-700 text-right">
                        {Object.entries(selectedAddOns).map(([id, qty]) => {
                          const a = mockBookingAddOns.find(x => x.id === id)
                          return a ? `${a.name} ×${qty}` : ''
                        }).filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  {notes && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ghi chú</span>
                      <span className="font-medium text-slate-700">{notes}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>VAT (10%)</span>
                    <span className="font-medium text-slate-700">+{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-base">
                    <span className="text-slate-700">Tổng cộng</span>
                    <span className="text-[#b11e29]">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Chọn phương thức thanh toán */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-700 mb-4">Phương thức thanh toán</h3>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === m.id ? 'border-[#b11e29] bg-[#b11e29]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        className="accent-[#b11e29]"
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        required
                      />
                      {m.icon}
                      <span className="font-medium text-sm text-slate-700">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gửi hóa đơn */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-700 mb-4">Gửi hóa đơn</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-[#b11e29] w-4 h-4"
                      checked={sendInvoiceZalo}
                      onChange={e => setSendInvoiceZalo(e.target.checked)}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Gửi hóa đơn qua Zalo</p>
                      <p className="text-xs text-slate-400">Gửi thông báo và hóa đơn tới Zalo của khách hàng</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-[#b11e29] w-4 h-4"
                      checked={sendInvoiceEmail}
                      onChange={e => setSendInvoiceEmail(e.target.checked)}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Gửi hóa đơn qua Email</p>
                      <p className="text-xs text-slate-400">Gửi hóa đơn đến email {customerEmail || '(chưa nhập email)'}</p>
                    </div>
                  </label>
                </div>
              </div>

            </form>
          )}
        </div>
      </div>

      {/* ---- Sticky bottom bar ---- */}
      <div className="shrink-0 border-t border-slate-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          {step === 1 && (
            <>
              {totalPrice > 0 && (
                <div className="flex items-center justify-between mb-3 text-sm">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>Không gian: <span className="text-slate-700 font-medium">{formatPrice(spacePrice)}</span></span>
                    {servicesPrice > 0 && <span>Dịch vụ: <span className="text-slate-700 font-medium">{formatPrice(servicesPrice)}</span></span>}
                    {discountAmount > 0 && <span className="text-green-600">Giảm: <span className="font-medium">-{formatPrice(discountAmount)}</span></span>}
                    <span>VAT 10%: <span className="text-slate-700 font-medium">+{formatPrice(taxAmount)}</span></span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Tổng cộng</p>
                    <p className="text-lg font-bold text-[#b11e29]">{formatPrice(totalPrice)}</p>
                  </div>
                </div>
              )}
              <button
                type="submit"
                form="booking-step1"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#b11e29] text-white rounded-xl font-semibold hover:bg-[#8f1820] transition-colors"
              >
                Tiếp theo: Thanh toán <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-500">Tổng thanh toán</p>
                <p className="text-lg font-bold text-[#b11e29]">{formatPrice(totalPrice)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  form="booking-step2"
                  className="flex-1 py-3 bg-[#b11e29] text-white rounded-xl font-semibold hover:bg-[#8f1820] transition-colors"
                >
                  Xác nhận & Thanh toán
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingFormPage
