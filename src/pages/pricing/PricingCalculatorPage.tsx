import { useState, useMemo, useCallback } from 'react'
import {
  Calculator,
  Building2,
  ChevronDown,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import { mockPricingRules } from '../../mocks/propertyMocks'
import { mockPromotions } from '../../mocks/pricingMocks'
import { useValidateVoucher } from '../../hooks/usePricing'
import { SpaceType } from '../../types/property'

// ========== CONSTANTS ==========

const SPACE_TYPE_LABELS: Record<string, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  private_office: 'Văn phòng riêng',
  meeting_room: 'Phòng họp',
  conference_room: 'Phòng hội nghị',
  open_space: 'Khu làm việc mở',
  training_room: 'Phòng đào tạo',
  event_space: 'Không gian sự kiện',
}

const UNIT_LABELS: Record<string, string> = {
  hour: 'Giờ',
  day: 'Ngày',
  week: 'Tuần',
  month: 'Tháng',
}

const MOCK_BUILDINGS = [
  { id: '1', name: 'Cobi Building 1' },
  { id: '2', name: 'Cobi Building 2' },
]

type BillingUnit = 'hour' | 'day' | 'week' | 'month'

interface AddOnLine {
  key: string
  serviceId: string
  quantity: number
}

interface AppliedPromotion {
  id: string
  name: string
  discountAmount: number
  type: string
}

// ========== HELPERS ==========

function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function getUnitPrice(rule: (typeof mockPricingRules)[number] | undefined, unit: BillingUnit): number | undefined {
  if (!rule) return undefined
  switch (unit) {
    case 'hour': return rule.pricePerHour
    case 'day': return rule.pricePerDay
    case 'week': return rule.pricePerWeek
    case 'month': return rule.pricePerMonth
  }
}

// Inline add-on services (EP-07 removed)
interface AddonService {
  id: string
  name: string
  unitPrice: number
  unit: string
}

const ADDON_SERVICES: AddonService[] = [
  { id: 'addon-wifi', name: 'WiFi Premium 100Mbps', unitPrice: 300000, unit: 'tháng' },
  { id: 'addon-print-bw', name: 'In A4 trắng đen', unitPrice: 500, unit: 'trang' },
  { id: 'addon-print-color', name: 'In A4 màu', unitPrice: 2000, unit: 'trang' },
  { id: 'addon-locker', name: 'Tủ cá nhân (Locker)', unitPrice: 200000, unit: 'tháng' },
  { id: 'addon-parking-motorbike', name: 'Đỗ xe máy', unitPrice: 150000, unit: 'tháng' },
  { id: 'addon-parking-car', name: 'Đỗ xe ô tô', unitPrice: 1500000, unit: 'tháng' },
  { id: 'addon-pa', name: 'Hệ thống PA / âm thanh', unitPrice: 500000, unit: 'lần' },
  { id: 'addon-projector', name: 'Máy chiếu', unitPrice: 200000, unit: 'buổi' },
]

// ========== SECTION COMPONENTS ==========

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <label className="block text-xs font-medium text-slate-600 mb-1">
      {label}{hint && <span className="ml-1 text-slate-400 font-normal">{hint}</span>}
    </label>
  )
}

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 focus:border-[#b11e29]'

// ========== MAIN PAGE ==========

export function PricingCalculatorPage() {
  const navigate = useNavigate()

  // Inputs
  const [spaceType, setSpaceType] = useState<string>('hot_desk')
  const [buildingId, setBuildingId] = useState<string>('1')
  const [unit, setUnit] = useState<BillingUnit>('day')
  const [quantity, setQuantity] = useState<number>(1)
  const [addOns, setAddOns] = useState<AddOnLine[]>([])
  const [voucherInput, setVoucherInput] = useState('')
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('')
  const [copied, setCopied] = useState(false)

  const validateMutation = useValidateVoucher()

  // Pricing rule matching
  const rule = useMemo(() =>
    mockPricingRules.find(r => r.spaceType === (spaceType as SpaceType)),
    [spaceType]
  )

  const unitPrice = useMemo(() => getUnitPrice(rule, unit), [rule, unit])

  // Available units for selected space type
  const availableUnits = useMemo<BillingUnit[]>(() => {
    if (!rule) return []
    const u: BillingUnit[] = []
    if (rule.pricePerHour) u.push('hour')
    if (rule.pricePerDay) u.push('day')
    if (rule.pricePerWeek) u.push('week')
    if (rule.pricePerMonth) u.push('month')
    return u
  }, [rule])

  // If unit not available after space type change, reset
  const effectiveUnit: BillingUnit = availableUnits.includes(unit) ? unit : (availableUnits[0] ?? 'day')

  // Space fee
  const spaceFee = useMemo(() => {
    const price = getUnitPrice(rule, effectiveUnit) ?? 0
    return price * quantity
  }, [rule, effectiveUnit, quantity])

  // Add-ons fee
  const addOnFee = useMemo(() =>
    addOns.reduce((total, line) => {
      const svc = ADDON_SERVICES.find(s => s.id === line.serviceId)
      return total + (svc ? svc.unitPrice * line.quantity : 0)
    }, 0),
    [addOns]
  )

  const subtotal = spaceFee + addOnFee

  // Auto-apply promotions: match building & active
  const autoPromotions = useMemo<AppliedPromotion[]>(() => {
    if (subtotal === 0) return []
    const result: AppliedPromotion[] = []
    for (const promo of mockPromotions) {
      if (promo.status !== 'active') continue
      if (promo.requiresVoucherCode) continue
      // Check conditions
      const buildingCond = promo.conditions.find(c => c.field === 'building_id')
      if (buildingCond && buildingCond.value !== buildingId) continue
      const typeCond = promo.conditions.find(c => c.field === 'space_type')
      if (typeCond) {
        const vals = Array.isArray(typeCond.value) ? typeCond.value : [typeCond.value]
        if (!vals.includes(spaceType)) continue
      }
      // Calculate discount
      let discountAmount = 0
      if (promo.discountAction.type === 'percent_off') {
        discountAmount = Math.round(subtotal * (promo.discountAction.value ?? 0) / 100)
        if (promo.discountAction.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, promo.discountAction.maxDiscountAmount)
        }
      } else if (promo.discountAction.type === 'fixed_amount') {
        discountAmount = promo.discountAction.value ?? 0
      }
      if (discountAmount > 0) {
        result.push({ id: promo.id, name: promo.name, discountAmount, type: promo.discountAction.type })
      }
    }
    return result
  }, [subtotal, buildingId, spaceType])

  // Voucher result
  const voucherValidation = validateMutation.data
  const voucherPromotion = voucherValidation?.valid ? voucherValidation.promotion : undefined
  const voucherDiscountAmount = useMemo(() => {
    if (!voucherPromotion || !appliedVoucherCode) return 0
    const action = voucherPromotion.discountAction
    if (action.type === 'percent_off') {
      const amt = Math.round(subtotal * (action.value ?? 0) / 100)
      return action.maxDiscountAmount ? Math.min(amt, action.maxDiscountAmount) : amt
    }
    if (action.type === 'fixed_amount') {
      return action.value ?? 0
    }
    return 0
  }, [voucherPromotion, appliedVoucherCode, subtotal])

  const autoDiscountTotal = useMemo(() => autoPromotions.reduce((s, p) => s + p.discountAmount, 0), [autoPromotions])
  const totalDiscount = autoDiscountTotal + voucherDiscountAmount
  const grandTotal = Math.max(0, subtotal - totalDiscount)

  // Handlers
  const handleSpaceTypeChange = useCallback((val: string) => {
    setSpaceType(val)
    const newRule = mockPricingRules.find(r => r.spaceType === val)
    if (newRule) {
      const units: BillingUnit[] = []
      if (newRule.pricePerHour) units.push('hour')
      if (newRule.pricePerDay) units.push('day')
      if (newRule.pricePerWeek) units.push('week')
      if (newRule.pricePerMonth) units.push('month')
      if (units.length && !units.includes(unit)) setUnit(units[0])
    }
  }, [unit])

  const addAddOnLine = () => {
    const firstSvc = ADDON_SERVICES[0]
    if (!firstSvc) return
    setAddOns(prev => [...prev, { key: Date.now().toString(), serviceId: firstSvc.id, quantity: 1 }])
  }

  const removeAddOnLine = (key: string) =>
    setAddOns(prev => prev.filter(l => l.key !== key))

  const updateAddOnLine = (key: string, field: 'serviceId' | 'quantity', value: string | number) =>
    setAddOns(prev => prev.map(l => l.key === key ? { ...l, [field]: value } : l))

  const handleApplyVoucher = async () => {
    const code = voucherInput.trim().toUpperCase()
    if (!code) return
    try {
      await validateMutation.mutateAsync(code)
      setAppliedVoucherCode(code)
    } catch {
      alert('Mã voucher không hợp lệ hoặc đã hết hạn.')
    }
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucherCode('')
    setVoucherInput('')
    validateMutation.reset()
  }

  const buildQuoteText = () => {
    const lines: string[] = [
      '=== BÁO GIÁ COBI COWORKING SPACE ===',
      '',
      `Loại không gian: ${SPACE_TYPE_LABELS[spaceType] ?? spaceType}`,
      `Tòa nhà: ${MOCK_BUILDINGS.find(b => b.id === buildingId)?.name ?? buildingId}`,
      `Đơn vị: ${UNIT_LABELS[effectiveUnit]} × ${quantity}`,
      '',
      `Phí không gian:         ${formatVND(spaceFee)}`,
    ]
    if (addOns.length > 0) {
      lines.push(`Phí dịch vụ thêm:       ${formatVND(addOnFee)}`)
      addOns.forEach(l => {
        const svc = ADDON_SERVICES.find(s => s.id === l.serviceId)
        if (svc) lines.push(`  • ${svc.name} × ${l.quantity} ${svc.unit || ''}: ${formatVND(svc.unitPrice * l.quantity)}`)
      })
    }
    lines.push(`Tạm tính:               ${formatVND(subtotal)}`)
    if (totalDiscount > 0) {
      lines.push(`Giảm giá:               -${formatVND(totalDiscount)}`)
      autoPromotions.forEach(p => lines.push(`  • ${p.name}: -${formatVND(p.discountAmount)}`))
      if (voucherDiscountAmount > 0 && appliedVoucherCode) {
        lines.push(`  • Voucher ${appliedVoucherCode}: -${formatVND(voucherDiscountAmount)}`)
      }
    }
    lines.push('')
    lines.push(`TỔNG THANH TOÁN: ${formatVND(grandTotal)}`)
    return lines.join('\n')
  }

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(buildQuoteText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleCreateBooking = () => {
    navigate('/bookings/new')
  }

  return (
    <>
      <Header title="Công cụ tính giá" subtitle="Tạo báo giá nhanh theo loại không gian và dịch vụ" />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT — Inputs */}
            <div className="space-y-5">

              {/* Space & Building */}
              <SectionCard title="Thông tin không gian">
                <div className="space-y-3">
                  <div>
                    <FieldLabel label="Loại không gian" />
                    <div className="relative">
                      <select className={`${inputCls} appearance-none pr-8`} value={spaceType} onChange={e => handleSpaceTypeChange(e.target.value)}>
                        {mockPricingRules.map(r => (
                          <option key={r.id} value={r.spaceType ?? ''}>
                            {SPACE_TYPE_LABELS[r.spaceType ?? ''] ?? r.spaceType}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    {rule && (
                      <div className="mt-1.5 text-xs text-slate-500 flex flex-wrap gap-3">
                        {rule.pricePerHour && <span>Giờ: <b className="text-slate-700">{formatVND(rule.pricePerHour)}</b></span>}
                        {rule.pricePerDay && <span>Ngày: <b className="text-slate-700">{formatVND(rule.pricePerDay)}</b></span>}
                        {rule.pricePerWeek && <span>Tuần: <b className="text-slate-700">{formatVND(rule.pricePerWeek)}</b></span>}
                        {rule.pricePerMonth && <span>Tháng: <b className="text-slate-700">{formatVND(rule.pricePerMonth)}</b></span>}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel label="Tòa nhà" />
                    <div className="relative">
                      <select className={`${inputCls} appearance-none pr-8`} value={buildingId} onChange={e => setBuildingId(e.target.value)}>
                        {MOCK_BUILDINGS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      <Building2 className="absolute right-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel label="Đơn vị thuê" />
                      <div className="relative">
                        <select className={`${inputCls} appearance-none pr-8`} value={effectiveUnit} onChange={e => setUnit(e.target.value as BillingUnit)}>
                          {availableUnits.map(u => <option key={u} value={u}>{UNIT_LABELS[u]}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <FieldLabel label="Số lượng" />
                      <input
                        type="number"
                        min={1}
                        max={999}
                        className={inputCls}
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Add-on Services */}
              <SectionCard title="Dịch vụ đi kèm">
                <div className="space-y-2">
                  {addOns.length === 0 && (
                    <p className="text-xs text-slate-400 py-2">Chưa có dịch vụ đi kèm nào</p>
                  )}
                  {addOns.map(line => {
                    const svc = ADDON_SERVICES.find(s => s.id === line.serviceId)
                    return (
                      <div key={line.key} className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <select
                            className={`${inputCls} pr-8 appearance-none`}
                            value={line.serviceId}
                            onChange={e => updateAddOnLine(line.key, 'serviceId', e.target.value)}
                          >
                            {ADDON_SERVICES.map(s => (
                              <option key={s.id} value={s.id}>{s.name} – {formatVND(s.unitPrice)}/{s.unit || 'lần'}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                        <input
                          type="number"
                          min={1}
                          className="w-20 border border-slate-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 focus:border-[#b11e29]"
                          value={line.quantity}
                          onChange={e => updateAddOnLine(line.key, 'quantity', Math.max(1, Number(e.target.value)))}
                        />
                        {svc && (
                          <span className="text-xs text-slate-500 w-24 text-right shrink-0">
                            = {formatVND(svc.unitPrice * line.quantity)}
                          </span>
                        )}
                        <button onClick={() => removeAddOnLine(line.key)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                  <button onClick={addAddOnLine} className="flex items-center gap-1.5 text-sm text-[#b11e29] hover:text-[#8e1820] font-medium mt-1 transition-colors">
                    <Plus className="w-4 h-4" />
                    Thêm dịch vụ
                  </button>
                </div>
              </SectionCard>

              {/* Voucher */}
              <SectionCard title="Mã giảm giá (Voucher)">
                {appliedVoucherCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <div>
                        <span className="font-mono font-semibold text-green-800">{appliedVoucherCode}</span>
                        <span className="text-xs text-green-600 ml-2">
                          – {voucherPromotion ? `Giảm ${formatVND(voucherDiscountAmount)}` : 'Miễn phí dịch vụ'}
                        </span>
                      </div>
                    </div>
                    <button onClick={handleRemoveVoucher} className="text-xs text-red-500 hover:text-red-700 font-medium">Xóa</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      className={`${inputCls} flex-1 font-mono uppercase`}
                      placeholder="Nhập mã voucher..."
                      value={voucherInput}
                      onChange={e => setVoucherInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
                    />
                    <button
                      onClick={handleApplyVoucher}
                      disabled={!voucherInput.trim() || validateMutation.isPending}
                      className="px-4 py-2 text-sm rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 disabled:opacity-40 whitespace-nowrap transition-colors"
                    >
                      {validateMutation.isPending ? 'Đang kiểm tra...' : 'Áp dụng'}
                    </button>
                  </div>
                )}
                {validateMutation.isError && !appliedVoucherCode && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Mã không hợp lệ hoặc đã hết lượt sử dụng
                  </div>
                )}
              </SectionCard>
            </div>

            {/* RIGHT — Result */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-8">
                <div className="flex items-center gap-2 mb-5">
                  <Calculator className="w-5 h-5 text-[#b11e29]" />
                  <h3 className="font-semibold text-slate-800">Chi tiết báo giá</h3>
                </div>

                {/* Summary table */}
                <div className="space-y-3">

                  {/* Space fee */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-700 font-medium">
                        {SPACE_TYPE_LABELS[spaceType] ?? spaceType}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {unitPrice ? formatVND(unitPrice) : '–'} × {quantity} {UNIT_LABELS[effectiveUnit]}
                        {' · '}{MOCK_BUILDINGS.find(b => b.id === buildingId)?.name}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 shrink-0">{formatVND(spaceFee)}</span>
                  </div>

                  {/* Add-ons */}
                  {addOns.map(line => {
                    const svc = ADDON_SERVICES.find(s => s.id === line.serviceId)
                    if (!svc) return null
                    return (
                      <div key={line.key} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-600">{svc.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatVND(svc.unitPrice)} × {line.quantity} {svc.unit || 'lần'}</p>
                        </div>
                        <span className="text-sm text-slate-700 shrink-0">{formatVND(svc.unitPrice * line.quantity)}</span>
                      </div>
                    )
                  })}

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-600">Tạm tính</span>
                    <span className="text-sm font-medium text-slate-700">{formatVND(subtotal)}</span>
                  </div>

                  {/* Auto promotions */}
                  {autoPromotions.map(p => (
                    <div key={p.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        <span className="text-sm text-green-700">{p.name}</span>
                      </div>
                      <span className="text-sm font-medium text-green-700 shrink-0">–{formatVND(p.discountAmount)}</span>
                    </div>
                  ))}

                  {/* Voucher discount */}
                  {appliedVoucherCode && voucherDiscountAmount > 0 && (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        <span className="text-sm text-green-700">Voucher: {appliedVoucherCode}</span>
                      </div>
                      <span className="text-sm font-medium text-green-700 shrink-0">–{formatVND(voucherDiscountAmount)}</span>
                    </div>
                  )}

                  {totalDiscount > 0 && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm text-green-600">Tổng giảm giá</span>
                      <span className="text-sm font-semibold text-green-600">–{formatVND(totalDiscount)}</span>
                    </div>
                  )}

                  {/* Grand total */}
                  <div className="bg-[#b11e29]/5 rounded-xl p-4 mt-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold text-slate-800">Tổng thanh toán</span>
                      <span className="text-2xl font-bold text-[#b11e29]">{formatVND(grandTotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        Tiết kiệm {formatVND(totalDiscount)} ({Math.round(totalDiscount / subtotal * 100)}% tổng giá trị)
                      </p>
                    )}
                  </div>
                </div>

                {/* Long-term discounts hint */}
                {rule?.longTermDiscount && rule.longTermDiscount.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
                    <p className="font-medium mb-1">Ưu đãi thuê dài hạn có thể áp dụng:</p>
                    {rule.longTermDiscount.map(d => (
                      <p key={d.months}>• Thuê ≥ {d.months} tháng: giảm thêm <b>{d.discountPercent}%</b></p>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={handleCopyQuote}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copied
                      ? <><Check className="w-4 h-4 text-green-500" />Đã sao chép</>
                      : <><Copy className="w-4 h-4" />Sao chép báo giá</>
                    }
                  </button>
                  <button
                    onClick={handleCreateBooking}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#b11e29] rounded-xl text-sm font-medium text-white hover:bg-[#8e1820] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Tạo booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
