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
import { useTranslation } from 'react-i18next'
import Header from '../../components/layout/Header'
import { mockPricingRules } from '../../mocks/propertyMocks'
import { mockPromotions } from '../../mocks/pricingMocks'
import { useValidateVoucher } from '../../hooks/usePricing'
import { SpaceType } from '../../types/property'

// ========== CONSTANTS ==========

const SPACE_TYPE_KEYS: Record<string, string> = {
  hot_desk: 'space_type_hot_desk',
  dedicated_desk: 'space_type_dedicated_desk',
  private_office: 'space_type_private_office',
  meeting_room: 'space_type_meeting_room',
  conference_room: 'space_type_conference_room',
  open_space: 'space_type_open_space',
  training_room: 'space_type_training_room',
  event_space: 'space_type_event_space',
}

const UNIT_KEYS: Record<string, string> = {
  hour: 'unit_hour',
  day: 'unit_day',
  week: 'unit_week',
  month: 'unit_month',
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
  nameKey: string
  unitPrice: number
  unitKey: string
}

const ADDON_SERVICES: AddonService[] = [
  { id: 'addon-wifi', nameKey: 'addon_wifi_premium', unitPrice: 300000, unitKey: 'addon_unit_month' },
  { id: 'addon-print-bw', nameKey: 'addon_print_bw', unitPrice: 500, unitKey: 'addon_unit_page' },
  { id: 'addon-print-color', nameKey: 'addon_print_color', unitPrice: 2000, unitKey: 'addon_unit_page' },
  { id: 'addon-locker', nameKey: 'addon_locker', unitPrice: 200000, unitKey: 'addon_unit_month' },
  { id: 'addon-parking-motorbike', nameKey: 'addon_parking_motorbike', unitPrice: 150000, unitKey: 'addon_unit_month' },
  { id: 'addon-parking-car', nameKey: 'addon_parking_car', unitPrice: 1500000, unitKey: 'addon_unit_month' },
  { id: 'addon-pa', nameKey: 'addon_pa_system', unitPrice: 500000, unitKey: 'addon_unit_time' },
  { id: 'addon-projector', nameKey: 'addon_projector', unitPrice: 200000, unitKey: 'addon_unit_session' },
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
  const { t } = useTranslation('pricing')

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
      alert(t('voucher_invalid_alert'))
    }
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucherCode('')
    setVoucherInput('')
    validateMutation.reset()
  }

  const buildQuoteText = () => {
    const lines: string[] = [
      t('quote_header'),
      '',
      `${t('quote_space_type')}: ${t(SPACE_TYPE_KEYS[spaceType] ?? spaceType)}`,
      `${t('quote_building')}: ${MOCK_BUILDINGS.find(b => b.id === buildingId)?.name ?? buildingId}`,
      `${t('quote_unit')}: ${t(UNIT_KEYS[effectiveUnit])} × ${quantity}`,
      '',
      `${t('quote_space_fee')}:         ${formatVND(spaceFee)}`,
    ]
    if (addOns.length > 0) {
      lines.push(`${t('quote_addon_fee')}:       ${formatVND(addOnFee)}`)
      addOns.forEach(l => {
        const svc = ADDON_SERVICES.find(s => s.id === l.serviceId)
        if (svc) lines.push(`  • ${t(svc.nameKey)} × ${l.quantity} ${t(svc.unitKey) || ''}: ${formatVND(svc.unitPrice * l.quantity)}`)
      })
    }
    lines.push(`${t('quote_subtotal')}:               ${formatVND(subtotal)}`)
    if (totalDiscount > 0) {
      lines.push(`${t('quote_discount')}:               -${formatVND(totalDiscount)}`)
      autoPromotions.forEach(p => lines.push(`  • ${p.name}: -${formatVND(p.discountAmount)}`))
      if (voucherDiscountAmount > 0 && appliedVoucherCode) {
        lines.push(`  • ${t('quote_voucher', { code: appliedVoucherCode })}: -${formatVND(voucherDiscountAmount)}`)
      }
    }
    lines.push('')
    lines.push(`${t('quote_grand_total')}: ${formatVND(grandTotal)}`)
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
      <Header title={t('page_title_calculator')} subtitle={t('page_subtitle_calculator')} />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT — Inputs */}
            <div className="space-y-5">

              {/* Space & Building */}
              <SectionCard title={t('section_space_info')}>
                <div className="space-y-3">
                  <div>
                    <FieldLabel label={t('label_space_type')} />
                    <div className="relative">
                      <select className={`${inputCls} appearance-none pr-8`} value={spaceType} onChange={e => handleSpaceTypeChange(e.target.value)}>
                        {mockPricingRules.map(r => (
                          <option key={r.id} value={r.spaceType ?? ''}>
                            {t(SPACE_TYPE_KEYS[r.spaceType ?? ''] ?? r.spaceType ?? '')}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    {rule && (
                      <div className="mt-1.5 text-xs text-slate-500 flex flex-wrap gap-3">
                        {rule.pricePerHour && <span>{t('unit_hour')}: <b className="text-slate-700">{formatVND(rule.pricePerHour)}</b></span>}
                        {rule.pricePerDay && <span>{t('unit_day')}: <b className="text-slate-700">{formatVND(rule.pricePerDay)}</b></span>}
                        {rule.pricePerWeek && <span>{t('unit_week')}: <b className="text-slate-700">{formatVND(rule.pricePerWeek)}</b></span>}
                        {rule.pricePerMonth && <span>{t('unit_month')}: <b className="text-slate-700">{formatVND(rule.pricePerMonth)}</b></span>}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel label={t('label_building')} />
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
                      <FieldLabel label={t('label_billing_unit')} />
                      <div className="relative">
                        <select className={`${inputCls} appearance-none pr-8`} value={effectiveUnit} onChange={e => setUnit(e.target.value as BillingUnit)}>
                          {availableUnits.map(u => <option key={u} value={u}>{t(UNIT_KEYS[u])}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <FieldLabel label={t('label_quantity')} />
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
              <SectionCard title={t('section_addons')}>
                <div className="space-y-2">
                  {addOns.length === 0 && (
                    <p className="text-xs text-slate-400 py-2">{t('label_no_addons')}</p>
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
                              <option key={s.id} value={s.id}>{t(s.nameKey)} – {formatVND(s.unitPrice)}/{t(s.unitKey) || t('addon_unit_time')}</option>
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
                    {t('btn_add_service')}
                  </button>
                </div>
              </SectionCard>

              {/* Voucher */}
              <SectionCard title={t('section_voucher')}>
                {appliedVoucherCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <div>
                        <span className="font-mono font-semibold text-green-800">{appliedVoucherCode}</span>
                        <span className="text-xs text-green-600 ml-2">
                          – {voucherPromotion ? t('voucher_applied_discount', { amount: formatVND(voucherDiscountAmount) }) : t('voucher_free_service')}
                        </span>
                      </div>
                    </div>
                    <button onClick={handleRemoveVoucher} className="text-xs text-red-500 hover:text-red-700 font-medium">{t('btn_remove')}</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      className={`${inputCls} flex-1 font-mono uppercase`}
                      placeholder={t('voucher_placeholder')}
                      value={voucherInput}
                      onChange={e => setVoucherInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
                    />
                    <button
                      onClick={handleApplyVoucher}
                      disabled={!voucherInput.trim() || validateMutation.isPending}
                      className="px-4 py-2 text-sm rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 disabled:opacity-40 whitespace-nowrap transition-colors"
                    >
                      {validateMutation.isPending ? t('voucher_checking') : t('btn_apply')}
                    </button>
                  </div>
                )}
                {validateMutation.isError && !appliedVoucherCode && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t('voucher_invalid')}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* RIGHT — Result */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-8">
                <div className="flex items-center gap-2 mb-5">
                  <Calculator className="w-5 h-5 text-[#b11e29]" />
                  <h3 className="font-semibold text-slate-800">{t('section_quote_detail')}</h3>
                </div>

                {/* Summary table */}
                <div className="space-y-3">

                  {/* Space fee */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-700 font-medium">
                        {t(SPACE_TYPE_KEYS[spaceType] ?? spaceType)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {unitPrice ? formatVND(unitPrice) : '–'} × {quantity} {t(UNIT_KEYS[effectiveUnit])}
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
                          <p className="text-sm text-slate-600">{t(svc.nameKey)}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatVND(svc.unitPrice)} × {line.quantity} {t(svc.unitKey) || t('addon_unit_time')}</p>
                        </div>
                        <span className="text-sm text-slate-700 shrink-0">{formatVND(svc.unitPrice * line.quantity)}</span>
                      </div>
                    )
                  })}

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-600">{t('label_subtotal')}</span>
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
                      <span className="text-sm text-green-600">{t('label_total_discount')}</span>
                      <span className="text-sm font-semibold text-green-600">–{formatVND(totalDiscount)}</span>
                    </div>
                  )}

                  {/* Grand total */}
                  <div className="bg-[#b11e29]/5 rounded-xl p-4 mt-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold text-slate-800">{t('label_grand_total')}</span>
                      <span className="text-2xl font-bold text-[#b11e29]">{formatVND(grandTotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        {t('label_savings', { amount: formatVND(totalDiscount), percent: Math.round(totalDiscount / subtotal * 100) })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Long-term discounts hint */}
                {rule?.longTermDiscount && rule.longTermDiscount.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
                    <p className="font-medium mb-1">{t('label_long_term_hint')}</p>
                    {rule.longTermDiscount.map(d => (
                      <p key={d.months}>• {t('label_long_term_months', { months: d.months, percent: d.discountPercent })}</p>
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
                      ? <><Check className="w-4 h-4 text-green-500" />{t('btn_copied')}</>
                      : <><Copy className="w-4 h-4" />{t('btn_copy_quote')}</>
                    }
                  </button>
                  <button
                    onClick={handleCreateBooking}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#b11e29] rounded-xl text-sm font-medium text-white hover:bg-[#8e1820] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('btn_create_booking')}
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
