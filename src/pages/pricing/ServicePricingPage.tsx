import { useState } from 'react'
import {
  Plus, Edit2, ToggleLeft, ToggleRight, History,
  DollarSign, Package, ChevronDown, ChevronUp, X, Check,
  Building2, Layers, LayoutGrid, Clock,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import {
  useSpacePricingRules, useCreateSpacePricingRule, useUpdateSpacePricingRule, useToggleSpacePricingActive,
  useAddOnPricingRules, useCreateAddOnPricingRule, useUpdateAddOnPricingRule, useToggleAddOnActive,
  usePricingHistory,
} from '../../hooks/usePricing'
import type {
  SpacePricingRule, SpaceType, AddOnServicePricing, AddOnServiceCategory, BillingType,
  LongTermDiscount, PricingTier,
} from '../../types/pricing'
import { SPACE_TYPE_LABELS, ADDON_CATEGORY_LABELS, BILLING_TYPE_LABELS } from '../../types/pricing'
import { mockBuildings, mockFloors } from '../../mocks/propertyMocks'

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n?: number) => n !== undefined ? n.toLocaleString('vi-VN') + ' ₫' : '—'
const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 focus:border-[#b11e29]'
const labelCls = 'block text-xs font-medium text-slate-600 mb-1'

const SPACE_TYPE_ICONS: Record<SpaceType, string> = {
  hot_desk: '💻', dedicated_desk: '🖥️', private_office: '🏢',
  meeting_room: '📋', event_space: '🎉', training_room: '📚',
  phone_booth: '📞', coworking_suite: '🏙️',
}

const ADDON_CATEGORY_ICONS: Record<AddOnServiceCategory, string> = {
  printing: '🖨️', storage: '🗄️', connectivity: '📡',
  food_drink: '☕', parking: '🚗', reception: '📬',
  meeting: '📺', other: '📦',
}

// ── SCOPE BADGE ───────────────────────────────────────────────────────────────

type ScopeLevel = 'default' | 'building' | 'floor' | 'space'

function getScopeLevel(rule: SpacePricingRule): ScopeLevel {
  if (rule.spaceId) return 'space'
  if (rule.floorId) return 'floor'
  if (rule.buildingId) return 'building'
  return 'default'
}

const SCOPE_STYLES: Record<ScopeLevel, { label: string; cls: string; icon: React.ReactNode }> = {
  default:  { label: 'Mặc định',       cls: 'bg-slate-100 text-slate-600',   icon: <LayoutGrid className="w-3 h-3" /> },
  building: { label: 'Override tòa',   cls: 'bg-blue-100 text-blue-700',     icon: <Building2 className="w-3 h-3" /> },
  floor:    { label: 'Override tầng',  cls: 'bg-purple-100 text-purple-700', icon: <Layers className="w-3 h-3" /> },
  space:    { label: 'Override space', cls: 'bg-orange-100 text-orange-700', icon: <LayoutGrid className="w-3 h-3" /> },
}

function ScopeBadge({ rule }: { rule: SpacePricingRule }) {
  const level = getScopeLevel(rule)
  const { label, cls, icon } = SCOPE_STYLES[level]
  let suffix = ''
  if (rule.buildingId) {
    const b = mockBuildings.find(x => x.id === rule.buildingId)
    suffix = b ? ` · ${b.name}` : ''
  }
  if (rule.floorId) {
    const f = mockFloors.find(x => x.id === rule.floorId)
    suffix += f ? ` T${f.floorNumber}` : ''
  }
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${cls}`}>
      {icon}{label}{suffix}
    </span>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// CREATE / EDIT SPACE PRICING MODAL
// ══════════════════════════════════════════════════════════════════════════════

interface SpacePricingModalProps {
  initial?: SpacePricingRule
  onClose: () => void
  onSave: (data: Omit<SpacePricingRule, 'id' | 'createdAt' | 'updatedAt'> | Partial<SpacePricingRule>) => void
  saving: boolean
}

function SpacePricingModal({ initial, onClose, onSave, saving }: SpacePricingModalProps) {
  const isEdit = !!initial
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    scopeType: getScopeLevel(initial ?? {} as SpacePricingRule) as ScopeLevel,
    spaceType: (initial?.spaceType ?? 'hot_desk') as SpaceType,
    buildingId: initial?.buildingId ?? '',
    floorId: initial?.floorId ?? '',
    spaceId: initial?.spaceId ?? '',
    pricePerHour: initial?.pricePerHour?.toString() ?? '',
    pricePerDay: initial?.pricePerDay?.toString() ?? '',
    pricePerWeek: initial?.pricePerWeek?.toString() ?? '',
    pricePerMonth: initial?.pricePerMonth?.toString() ?? '',
    pricePerYear: initial?.pricePerYear?.toString() ?? '',
    minBookingHours: initial?.minBookingHours?.toString() ?? '',
    minBookingDays: initial?.minBookingDays?.toString() ?? '',
    weekendDiscount: initial?.weekendDiscount?.toString() ?? '',
    offPeakDiscount: initial?.offPeakDiscount?.toString() ?? '',
    effectiveFrom: initial?.effectiveFrom ?? new Date().toISOString().slice(0, 10),
    effectiveTo: initial?.effectiveTo ?? '',
    notes: initial?.notes ?? '',
  })
  const [longTermDiscounts, setLongTermDiscounts] = useState<LongTermDiscount[]>(
    initial?.longTermDiscounts ?? []
  )

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const addLTD = () => setLongTermDiscounts(p => [...p, { unit: 'month', minQuantity: 3, discountPercent: 5 }])
  const removeLTD = (i: number) => setLongTermDiscounts(p => p.filter((_, idx) => idx !== i))
  const updateLTD = (i: number, k: keyof LongTermDiscount, v: string | number) =>
    setLongTermDiscounts(p => p.map((d, idx) => idx === i ? { ...d, [k]: v } : d))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: Omit<SpacePricingRule, 'id' | 'createdAt' | 'updatedAt'> = {
      name: form.name,
      spaceType: form.scopeType !== 'space' ? form.spaceType : undefined,
      buildingId: form.scopeType !== 'default' ? form.buildingId || undefined : undefined,
      floorId: (form.scopeType === 'floor' || form.scopeType === 'space') ? form.floorId || undefined : undefined,
      spaceId: form.scopeType === 'space' ? form.spaceId || undefined : undefined,
      pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : undefined,
      pricePerDay: form.pricePerDay ? Number(form.pricePerDay) : undefined,
      pricePerWeek: form.pricePerWeek ? Number(form.pricePerWeek) : undefined,
      pricePerMonth: form.pricePerMonth ? Number(form.pricePerMonth) : undefined,
      pricePerYear: form.pricePerYear ? Number(form.pricePerYear) : undefined,
      minBookingHours: form.minBookingHours ? Number(form.minBookingHours) : undefined,
      minBookingDays: form.minBookingDays ? Number(form.minBookingDays) : undefined,
      weekendDiscount: form.weekendDiscount ? Number(form.weekendDiscount) : undefined,
      offPeakDiscount: form.offPeakDiscount ? Number(form.offPeakDiscount) : undefined,
      longTermDiscounts: longTermDiscounts.length ? longTermDiscounts : undefined,
      effectiveFrom: form.effectiveFrom,
      effectiveTo: form.effectiveTo || undefined,
      isActive: initial?.isActive ?? true,
      createdBy: 'admin',
      notes: form.notes || undefined,
    }
    onSave(data)
  }

  const filteredFloors = mockFloors.filter(f => f.buildingId === form.buildingId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {isEdit ? 'Chỉnh sửa bảng giá không gian' : 'Thêm bảng giá không gian'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className={labelCls}>Tên quy tắc giá *</label>
            <input className={inputCls} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Hot Desk – Tiêu chuẩn" />
          </div>

          {/* Scope */}
          <div>
            <label className={labelCls}>Phạm vi áp dụng</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['default', 'building', 'floor', 'space'] as ScopeLevel[]).map(s => (
                <label key={s} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition ${form.scopeType === s ? 'border-[#b11e29] bg-red-50 text-[#b11e29] font-medium' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <input type="radio" className="accent-[#b11e29]" checked={form.scopeType === s} onChange={() => set('scopeType', s)} />
                  {SCOPE_STYLES[s].label}
                </label>
              ))}
            </div>
          </div>

          {/* SpaceType + Building/Floor selects */}
          <div className="grid grid-cols-2 gap-3">
            {form.scopeType !== 'space' && (
              <div>
                <label className={labelCls}>Loại không gian</label>
                <select className={inputCls} value={form.spaceType} onChange={e => set('spaceType', e.target.value)}>
                  {(Object.keys(SPACE_TYPE_LABELS) as SpaceType[]).map(k => (
                    <option key={k} value={k}>{SPACE_TYPE_ICONS[k]} {SPACE_TYPE_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            )}
            {form.scopeType !== 'default' && (
              <div>
                <label className={labelCls}>Tòa nhà</label>
                <select className={inputCls} value={form.buildingId} onChange={e => set('buildingId', e.target.value)}>
                  <option value="">-- Chọn tòa nhà --</option>
                  {mockBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
            {(form.scopeType === 'floor' || form.scopeType === 'space') && (
              <div>
                <label className={labelCls}>Tầng</label>
                <select className={inputCls} value={form.floorId} onChange={e => set('floorId', e.target.value)} disabled={!form.buildingId}>
                  <option value="">-- Chọn tầng --</option>
                  {filteredFloors.map(f => <option key={f.id} value={f.id}>Tầng {f.floorNumber}{f.floorName ? ` – ${f.floorName}` : ''}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Prices */}
          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Bảng giá (để trống = không hỗ trợ đơn vị đó)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'pricePerHour',  label: 'Giá/giờ (₫)' },
                { key: 'pricePerDay',   label: 'Giá/ngày (₫)' },
                { key: 'pricePerWeek',  label: 'Giá/tuần (₫)' },
                { key: 'pricePerMonth', label: 'Giá/tháng (₫)' },
                { key: 'pricePerYear',  label: 'Giá/năm (₫)' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input type="number" min={0} className={inputCls} value={form[key as keyof typeof form] as string} onChange={e => set(key, e.target.value)} placeholder="0" />
                </div>
              ))}
            </div>
          </div>

          {/* Min booking */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Đặt tối thiểu (giờ)</label>
              <input type="number" min={0} className={inputCls} value={form.minBookingHours} onChange={e => set('minBookingHours', e.target.value)} placeholder="VD: 2" />
            </div>
            <div>
              <label className={labelCls}>Đặt tối thiểu (ngày)</label>
              <input type="number" min={0} className={inputCls} value={form.minBookingDays} onChange={e => set('minBookingDays', e.target.value)} placeholder="VD: 1" />
            </div>
          </div>

          {/* Discounts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Giảm cuối tuần (%)</label>
              <input type="number" min={0} max={100} className={inputCls} value={form.weekendDiscount} onChange={e => set('weekendDiscount', e.target.value)} placeholder="VD: 10" />
            </div>
            <div>
              <label className={labelCls}>Giảm giờ thấp điểm (%)</label>
              <input type="number" min={0} max={100} className={inputCls} value={form.offPeakDiscount} onChange={e => set('offPeakDiscount', e.target.value)} placeholder="VD: 20" />
            </div>
          </div>

          {/* Long-term discounts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Giảm giá dài hạn</p>
              <button type="button" onClick={addLTD} className="text-xs text-[#b11e29] hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Thêm bậc
              </button>
            </div>
            {longTermDiscounts.map((d, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500">Từ</span>
                <input type="number" min={1} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm w-16 text-center" value={d.minQuantity} onChange={e => updateLTD(i, 'minQuantity', Number(e.target.value))} />
                <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm" value={d.unit} onChange={e => updateLTD(i, 'unit', e.target.value)}>
                  <option value="month">tháng</option>
                  <option value="week">tuần</option>
                </select>
                <span className="text-xs text-slate-500">giảm</span>
                <input type="number" min={1} max={100} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm w-16 text-center" value={d.discountPercent} onChange={e => updateLTD(i, 'discountPercent', Number(e.target.value))} />
                <span className="text-xs text-slate-500">%</span>
                <button type="button" onClick={() => removeLTD(i)} className="text-slate-400 hover:text-red-500 ml-auto"><X className="w-4 h-4" /></button>
              </div>
            ))}
            {longTermDiscounts.length === 0 && <p className="text-xs text-slate-400 italic">Chưa cấu hình giảm dài hạn</p>}
          </div>

          {/* Effective period */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Hiệu lực từ ngày *</label>
              <input type="date" required className={inputCls} value={form.effectiveFrom} onChange={e => set('effectiveFrom', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Hiệu lực đến ngày</label>
              <input type="date" className={inputCls} value={form.effectiveTo} onChange={e => set('effectiveTo', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Ghi chú</label>
            <textarea rows={2} className={inputCls} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Ghi chú thêm..." />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Hủy</button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-sm rounded-lg bg-[#b11e29] text-white font-medium hover:bg-[#8e1820] disabled:opacity-50 flex items-center gap-2">
              {saving ? 'Đang lưu...' : <><Check className="w-4 h-4" /> {isEdit ? 'Cập nhật' : 'Tạo bảng giá'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SPACE PRICING TAB (F-81, F-83)
// ══════════════════════════════════════════════════════════════════════════════

function SpacePricingTab() {
  const { data: rules = [], isLoading } = useSpacePricingRules()
  const createMut = useCreateSpacePricingRule()
  const updateMut = useUpdateSpacePricingRule()
  const toggleMut = useToggleSpacePricingActive()
  const [modal, setModal] = useState<null | 'create' | SpacePricingRule>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [scopeFilter, setScopeFilter] = useState<ScopeLevel | 'all'>('all')

  const filtered = scopeFilter === 'all' ? rules : rules.filter(r => getScopeLevel(r) === scopeFilter)
  const activeCount = rules.filter(r => r.isActive).length
  const overrideCount = rules.filter(r => getScopeLevel(r) !== 'default').length

  const handleSave = (data: Omit<SpacePricingRule, 'id' | 'createdAt' | 'updatedAt'> | Partial<SpacePricingRule>) => {
    if (modal && typeof modal === 'object') {
      updateMut.mutate({ id: modal.id, data }, { onSuccess: () => setModal(null) })
    } else {
      createMut.mutate(data as Omit<SpacePricingRule, 'id' | 'createdAt' | 'updatedAt'>, { onSuccess: () => setModal(null) })
    }
  }

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Tổng quy tắc',    value: rules.length,   cls: 'text-slate-700' },
          { label: 'Đang áp dụng',    value: activeCount,    cls: 'text-green-600' },
          { label: 'Override cụ thể', value: overrideCount,  cls: 'text-blue-600'  },
        ].map(({ label, value, cls }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-slate-200 text-center">
            <p className={`text-2xl font-bold ${cls}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'default', 'building', 'floor', 'space'] as const).map(s => (
            <button key={s} onClick={() => setScopeFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${scopeFilter === s ? 'bg-[#b11e29] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {s === 'all' ? 'Tất cả' : SCOPE_STYLES[s].label}
              {s !== 'all' && <span className="ml-1 opacity-70">({rules.filter(r => getScopeLevel(r) === s).length})</span>}
            </button>
          ))}
        </div>
        <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b11e29] text-white text-sm font-medium hover:bg-[#8e1820]">
          <Plus className="w-4 h-4" /> Thêm bảng giá
        </button>
      </div>

      {/* Override hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-blue-700 flex items-start gap-2">
        <span>ℹ️</span>
        <span><b>Ưu tiên:</b> Override space cụ thể &gt; Override tầng &gt; Override tòa nhà &gt; Mặc định loại space</span>
      </div>

      {/* Rules list */}
      <div className="space-y-2">
        {filtered.map(rule => {
          const isOpen = expanded === rule.id
          return (
            <div key={rule.id} className={`bg-white rounded-xl border transition ${rule.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 rounded-xl text-left"
                onClick={() => setExpanded(isOpen ? null : rule.id)}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${rule.isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                <ScopeBadge rule={rule} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{rule.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {rule.spaceType ? `${SPACE_TYPE_ICONS[rule.spaceType]} ${SPACE_TYPE_LABELS[rule.spaceType]}` : 'Space cụ thể'} ·
                    Từ {new Date(rule.effectiveFrom).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
                  {rule.pricePerHour  && <div className="text-right"><p className="text-xs text-slate-400">Giờ</p><p className="text-sm font-semibold text-slate-700">{fmt(rule.pricePerHour)}</p></div>}
                  {rule.pricePerMonth && <div className="text-right"><p className="text-xs text-slate-400">Tháng</p><p className="text-sm font-semibold text-slate-700">{fmt(rule.pricePerMonth)}</p></div>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#b11e29]"
                    onClick={e => { e.stopPropagation(); setModal(rule) }} title="Chỉnh sửa">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100"
                    onClick={e => { e.stopPropagation(); toggleMut.mutate(rule.id) }}
                    title={rule.isActive ? 'Tạm ẩn' : 'Kích hoạt'}>
                    {rule.isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-4 py-4 bg-slate-50 rounded-b-xl">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                    {[
                      { label: 'Giá/giờ',   val: rule.pricePerHour  },
                      { label: 'Giá/ngày',  val: rule.pricePerDay   },
                      { label: 'Giá/tuần',  val: rule.pricePerWeek  },
                      { label: 'Giá/tháng', val: rule.pricePerMonth },
                      { label: 'Giá/năm',   val: rule.pricePerYear  },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-white rounded-lg p-2.5 border border-slate-200 text-center">
                        <p className="text-xs text-slate-500 mb-1">{label}</p>
                        <p className={`font-semibold text-sm ${val ? 'text-slate-800' : 'text-slate-300'}`}>{fmt(val)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs mt-1">
                    {rule.minBookingHours  && <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">Tối thiểu {rule.minBookingHours}h</span>}
                    {rule.minBookingDays   && <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">Tối thiểu {rule.minBookingDays} ngày</span>}
                    {rule.weekendDiscount  && <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">Cuối tuần −{rule.weekendDiscount}%</span>}
                    {rule.offPeakDiscount  && <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">Thấp điểm −{rule.offPeakDiscount}%</span>}
                    {rule.longTermDiscounts?.map((d, i) => (
                      <span key={i} className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                        ≥{d.minQuantity} {d.unit === 'month' ? 'tháng' : 'tuần'}: −{d.discountPercent}%
                      </span>
                    ))}
                  </div>
                  {rule.notes && <p className="text-xs text-slate-500 mt-2 italic">{rule.notes}</p>}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">Chưa có quy tắc giá nào</div>}
      </div>

      {modal && (
        <SpacePricingModal
          initial={typeof modal === 'object' ? modal : undefined}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={createMut.isPending || updateMut.isPending}
        />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// CREATE / EDIT ADD-ON MODAL
// ══════════════════════════════════════════════════════════════════════════════

interface AddOnModalProps {
  initial?: AddOnServicePricing
  onClose: () => void
  onSave: (data: Omit<AddOnServicePricing, 'id' | 'createdAt' | 'updatedAt'> | Partial<AddOnServicePricing>) => void
  saving: boolean
}

function AddOnModal({ initial, onClose, onSave, saving }: AddOnModalProps) {
  const isEdit = !!initial
  const [form, setForm] = useState({
    serviceCode:  initial?.serviceCode  ?? '',
    name:         initial?.name         ?? '',
    category:    (initial?.category     ?? 'printing') as AddOnServiceCategory,
    description:  initial?.description  ?? '',
    unit:         initial?.unit         ?? '',
    unitPrice:    initial?.unitPrice?.toString() ?? '',
    billingType: (initial?.billingType  ?? 'per_use') as BillingType,
    effectiveFrom: initial?.effectiveFrom ?? new Date().toISOString().slice(0, 10),
    effectiveTo:   initial?.effectiveTo ?? '',
  })
  const [tiers, setTiers] = useState<PricingTier[]>(initial?.pricingTiers ?? [])

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const addTier = () => setTiers(p => [...p, { fromUnit: 1, pricePerUnit: 0 }])
  const removeTier = (i: number) => setTiers(p => p.filter((_, idx) => idx !== i))
  const updateTier = (i: number, k: keyof PricingTier, v: number | undefined) =>
    setTiers(p => p.map((t, idx) => idx === i ? { ...t, [k]: v } : t))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: Omit<AddOnServicePricing, 'id' | 'createdAt' | 'updatedAt'> = {
      serviceCode: form.serviceCode,
      name: form.name,
      category: form.category,
      description: form.description || undefined,
      unit: form.unit,
      unitPrice: Number(form.unitPrice),
      billingType: form.billingType,
      pricingTiers: form.billingType === 'per_use' && tiers.length ? tiers : undefined,
      isActive: initial?.isActive ?? true,
      effectiveFrom: form.effectiveFrom,
      effectiveTo: form.effectiveTo || undefined,
    }
    onSave(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {isEdit ? 'Chỉnh sửa dịch vụ cộng thêm' : 'Thêm dịch vụ cộng thêm'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Mã dịch vụ *</label>
              <input className={inputCls} required value={form.serviceCode} onChange={e => set('serviceCode', e.target.value)} placeholder="VD: PRINT-BW-A4" />
            </div>
            <div>
              <label className={labelCls}>Danh mục *</label>
              <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
                {(Object.keys(ADDON_CATEGORY_LABELS) as AddOnServiceCategory[]).map(k => (
                  <option key={k} value={k}>{ADDON_CATEGORY_ICONS[k]} {ADDON_CATEGORY_LABELS[k]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Tên dịch vụ *</label>
            <input className={inputCls} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: In A4 trắng đen" />
          </div>

          <div>
            <label className={labelCls}>Mô tả</label>
            <textarea rows={2} className={inputCls} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Đơn vị tính (tự do) *</label>
              <input className={inputCls} required value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="trang, ly, tháng, lần..." />
            </div>
            <div>
              <label className={labelCls}>Giá đơn vị (₫) *</label>
              <input type="number" min={0} required className={inputCls} value={form.unitPrice} onChange={e => set('unitPrice', e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>Hình thức tính phí *</label>
              <select className={inputCls} value={form.billingType} onChange={e => set('billingType', e.target.value)}>
                {(Object.keys(BILLING_TYPE_LABELS) as BillingType[]).map(k => (
                  <option key={k} value={k}>{BILLING_TYPE_LABELS[k]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing tiers */}
          {form.billingType === 'per_use' && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Giá theo bậc số lượng</p>
                <button type="button" onClick={addTier} className="text-xs text-[#b11e29] hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Thêm bậc
                </button>
              </div>
              {tiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-2 mb-2 text-sm flex-wrap">
                  <span className="text-xs text-slate-500">Từ</span>
                  <input type="number" min={0} value={tier.fromUnit}
                    onChange={e => updateTier(i, 'fromUnit', Number(e.target.value))}
                    className="border border-slate-200 rounded-lg px-2 py-1.5 w-16 text-center text-sm bg-white" />
                  <span className="text-xs text-slate-500">đến</span>
                  <input type="number" min={0} placeholder="∞" value={tier.toUnit ?? ''}
                    onChange={e => updateTier(i, 'toUnit', e.target.value ? Number(e.target.value) : undefined)}
                    className="border border-slate-200 rounded-lg px-2 py-1.5 w-16 text-center text-sm bg-white" />
                  <span className="text-xs text-slate-500">{form.unit || '?'}:</span>
                  <input type="number" min={0} value={tier.pricePerUnit}
                    onChange={e => updateTier(i, 'pricePerUnit', Number(e.target.value))}
                    className="border border-slate-200 rounded-lg px-2 py-1.5 flex-1 min-w-[80px] text-sm bg-white" />
                  <span className="text-xs text-slate-500">₫/{form.unit || '?'}</span>
                  <button type="button" onClick={() => removeTier(i)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ))}
              {tiers.length === 0 && <p className="text-xs text-slate-400 italic">Chưa có bậc — áp dụng giá đơn vị thống nhất</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Hiệu lực từ ngày *</label>
              <input type="date" required className={inputCls} value={form.effectiveFrom} onChange={e => set('effectiveFrom', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Hiệu lực đến ngày</label>
              <input type="date" className={inputCls} value={form.effectiveTo} onChange={e => set('effectiveTo', e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Hủy</button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-sm rounded-lg bg-[#b11e29] text-white font-medium hover:bg-[#8e1820] disabled:opacity-50 flex items-center gap-2">
              {saving ? 'Đang lưu...' : <><Check className="w-4 h-4" /> {isEdit ? 'Cập nhật' : 'Tạo dịch vụ'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ADD-ON PRICING TAB (F-82)
// ══════════════════════════════════════════════════════════════════════════════

function AddOnPricingTab() {
  const { data: services = [], isLoading } = useAddOnPricingRules()
  const createMut = useCreateAddOnPricingRule()
  const updateMut = useUpdateAddOnPricingRule()
  const toggleMut = useToggleAddOnActive()
  const [modal, setModal] = useState<null | 'create' | AddOnServicePricing>(null)
  const [catFilter, setCatFilter] = useState<AddOnServiceCategory | 'all'>('all')

  const categories = Array.from(new Set(services.map(s => s.category))) as AddOnServiceCategory[]
  const filtered = catFilter === 'all' ? services : services.filter(s => s.category === catFilter)

  const handleSave = (data: Omit<AddOnServicePricing, 'id' | 'createdAt' | 'updatedAt'> | Partial<AddOnServicePricing>) => {
    if (modal && typeof modal === 'object') {
      updateMut.mutate({ id: modal.id, data }, { onSuccess: () => setModal(null) })
    } else {
      createMut.mutate(data as Omit<AddOnServicePricing, 'id' | 'createdAt' | 'updatedAt'>, { onSuccess: () => setModal(null) })
    }
  }

  if (isLoading) return <div className="grid grid-cols-2 gap-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 bg-slate-100 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setCatFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${catFilter === 'all' ? 'bg-[#b11e29] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Tất cả</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${catFilter === cat ? 'bg-[#b11e29] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {ADDON_CATEGORY_ICONS[cat]} {ADDON_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b11e29] text-white text-sm font-medium hover:bg-[#8e1820]">
          <Plus className="w-4 h-4" /> Thêm dịch vụ
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(svc => (
          <div key={svc.id} className={`bg-white rounded-xl border p-4 flex flex-col gap-3 transition ${svc.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{ADDON_CATEGORY_ICONS[svc.category]}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm leading-tight">{svc.name}</p>
                  <p className="text-xs text-slate-400">{svc.serviceCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#b11e29]" onClick={() => setModal(svc)}><Edit2 className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100" onClick={() => toggleMut.mutate(svc.id)}>
                  {svc.isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>

            {svc.description && <p className="text-xs text-slate-500 leading-relaxed">{svc.description}</p>}

            <div className="flex items-end justify-between mt-auto">
              <div>
                <p className="text-lg font-bold text-[#b11e29]">{svc.unitPrice.toLocaleString('vi-VN')} ₫</p>
                <p className="text-xs text-slate-500">/{svc.unit}</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{BILLING_TYPE_LABELS[svc.billingType]}</span>
            </div>

            {svc.pricingTiers && svc.pricingTiers.length > 0 && (
              <div className="border-t border-slate-100 pt-2">
                <p className="text-xs font-medium text-slate-600 mb-1">Giá theo bậc:</p>
                {svc.pricingTiers.map((t, i) => (
                  <div key={i} className="flex justify-between text-xs text-slate-500">
                    <span>{t.fromUnit}{t.toUnit ? `–${t.toUnit}` : '+'} {svc.unit}</span>
                    <span className="font-medium">{t.pricePerUnit.toLocaleString('vi-VN')} ₫/{svc.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-3 text-center py-10 text-slate-400 text-sm">Chưa có dịch vụ nào</div>}
      </div>

      {modal && (
        <AddOnModal
          initial={typeof modal === 'object' ? modal : undefined}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={createMut.isPending || updateMut.isPending}
        />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PRICING HISTORY TAB (F-84)
// ══════════════════════════════════════════════════════════════════════════════

const ACTION_META = {
  created:     { label: 'Tạo mới',      cls: 'bg-green-100 text-green-700',     dot: 'bg-green-500'   },
  updated:     { label: 'Cập nhật giá', cls: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500'    },
  activated:   { label: 'Kích hoạt',    cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  deactivated: { label: 'Tạm ẩn',       cls: 'bg-slate-100 text-slate-500',     dot: 'bg-slate-400'   },
}

function PricingHistoryTab() {
  const [entityFilter, setEntityFilter] = useState<'space_pricing' | 'addon_pricing' | undefined>(undefined)
  const { data: history = [], isLoading } = usePricingHistory(entityFilter)

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {([
          { val: undefined,              label: 'Tất cả'              },
          { val: 'space_pricing' as const, label: '🏢 Giá không gian'    },
          { val: 'addon_pricing' as const, label: '📦 Dịch vụ cộng thêm' },
        ]).map(({ val, label }) => (
          <button key={String(val)} onClick={() => setEntityFilter(val)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${entityFilter === val ? 'bg-[#b11e29] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200" />
        <div className="space-y-3">
          {history.map(entry => {
            const meta = ACTION_META[entry.action]
            return (
              <div key={entry.id} className="relative">
                <div className={`absolute -left-6 top-4 w-3 h-3 rounded-full ${meta.dot} ring-2 ring-white`} />
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.cls}`}>{meta.label}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {entry.entityType === 'space_pricing' ? '🏢 Giá không gian' : '📦 Dịch vụ'}
                      </span>
                      <span className="font-medium text-slate-800 text-sm">{entry.entityName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.changedAt).toLocaleDateString('vi-VN')}
                      {' '}
                      {new Date(entry.changedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      <span className="ml-1 font-medium text-slate-600">· {entry.changedBy}</span>
                    </div>
                  </div>
                  {entry.changedFields && entry.changedFields.length > 0 && (
                    <div className="mt-2 space-y-1 pl-1">
                      {entry.changedFields.map((cf, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 w-28 flex-shrink-0">{cf.label}</span>
                          <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded line-through">
                            {typeof cf.oldValue === 'number' ? cf.oldValue.toLocaleString('vi-VN') : cf.oldValue}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">
                            {typeof cf.newValue === 'number' ? cf.newValue.toLocaleString('vi-VN') : cf.newValue}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {entry.notes && <p className="text-xs text-slate-400 mt-1.5 italic">{entry.notes}</p>}
                </div>
              </div>
            )
          })}
          {history.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">Chưa có lịch sử thay đổi</div>}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

type Tab = 'space' | 'addon' | 'history'

export function ServicePricingPage() {
  const [tab, setTab] = useState<Tab>('space')

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'space',   label: 'Giá không gian',     icon: <DollarSign className="w-4 h-4" /> },
    { id: 'addon',   label: 'Dịch vụ cộng thêm',  icon: <Package className="w-4 h-4" />   },
    { id: 'history', label: 'Lịch sử thay đổi giá', icon: <History className="w-4 h-4" />  },
  ]

  return (
    <>
      <Header title="Bảng giá dịch vụ" subtitle="Quản lý giá không gian, dịch vụ cộng thêm và lịch sử thay đổi giá · F-81 · F-82 · F-83 · F-84" />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {tab === 'space'   && <SpacePricingTab />}
          {tab === 'addon'   && <AddOnPricingTab />}
          {tab === 'history' && <PricingHistoryTab />}
        </div>
      </main>
    </>
  )
}
