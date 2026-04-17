import { useState, useMemo } from 'react'
import {
  Tag,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Pause,
  Play,
  BadgeCheck,
  CalendarRange,
  TrendingDown,
  X,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import {
  usePromotions,
  useCreatePromotion,
  useApprovePromotion,
  usePauseResumePromotion,
} from '../../hooks/usePricing'
import type {
  PromotionProgram,
  PromotionType,
  PromotionStatus,
  DiscountAction,
  PromotionCondition,
  ConditionField,
  ConditionOperator,
} from '../../types/pricing'
import {
  PROMOTION_TYPE_LABELS,
  PROMOTION_STATUS_LABELS,
  PROMOTION_STATUS_COLORS,
} from '../../types/pricing'
import { mockBuildings } from '../../mocks/propertyMocks'
import { SPACE_TYPE_LABELS } from '../../types/pricing'

// ========== CONDITIONS BUILDER (F-86) ==========

const CONDITION_FIELD_LABELS: Record<ConditionField, string> = {
  space_type:       'Loại không gian',
  building_id:      'Tòa nhà',
  booking_day:      'Ngày trong tuần',
  booking_hour:     'Giờ đặt',
  duration_months:  'Thời hạn (tháng)',
  order_amount:     'Giá trị đơn hàng (₫)',
  customer_type:    'Loại khách hàng',
  customer_tag:     'Tag khách hàng',
  is_first_booking: 'Lần đặt đầu tiên',
  customer_id:      'Khách hàng cụ thể',
}

const OPERATOR_LABELS: Record<ConditionOperator, string> = {
  equals:       '=',
  not_equals:   '≠',
  greater_than: '>',
  less_than:    '<',
  in:           'trong danh sách',
  not_in:       'ngoài danh sách',
}

const FIELD_ALLOWED_OPS: Record<ConditionField, ConditionOperator[]> = {
  space_type:       ['equals', 'not_equals', 'in', 'not_in'],
  building_id:      ['equals', 'not_equals', 'in', 'not_in'],
  booking_day:      ['equals', 'not_equals', 'in', 'not_in'],
  booking_hour:     ['equals', 'greater_than', 'less_than'],
  duration_months:  ['equals', 'greater_than', 'less_than'],
  order_amount:     ['greater_than', 'less_than', 'equals'],
  customer_type:    ['equals', 'not_equals'],
  customer_tag:     ['in', 'not_in', 'equals'],
  is_first_booking: ['equals'],
  customer_id:      ['equals', 'not_equals', 'in', 'not_in'],
}

const DAY_OPTIONS = [
  { value: '1', label: 'Thứ Hai' }, { value: '2', label: 'Thứ Ba' },
  { value: '3', label: 'Thứ Tư' }, { value: '4', label: 'Thứ Năm' },
  { value: '5', label: 'Thứ Sáu' }, { value: '6', label: 'Thứ Bảy' },
  { value: '0', label: 'Chủ Nhật' },
]

function ConditionValueInput({
  field, value, onChange,
}: {
  field: ConditionField
  value: string
  onChange: (v: string) => void
}) {
  const inputCls = 'border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white flex-1 focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 focus:border-[#b11e29]'

  if (field === 'space_type') {
    return (
      <select className={inputCls} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Chọn loại...</option>
        {(Object.entries(SPACE_TYPE_LABELS) as [string, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    )
  }
  if (field === 'building_id') {
    return (
      <select className={inputCls} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Chọn tòa nhà...</option>
        {mockBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
    )
  }
  if (field === 'booking_day') {
    return (
      <select className={inputCls} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Chọn ngày...</option>
        {DAY_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
      </select>
    )
  }
  if (field === 'booking_hour' || field === 'duration_months') {
    return <input type="number" min={0} className={inputCls} value={value} onChange={e => onChange(e.target.value)} placeholder={field === 'booking_hour' ? '0–23' : 'Số tháng'} />
  }
  if (field === 'order_amount') {
    return <input type="number" min={0} className={inputCls} value={value} onChange={e => onChange(e.target.value)} placeholder="VD: 500000" />
  }
  if (field === 'customer_type') {
    return (
      <select className={inputCls} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Chọn loại...</option>
        <option value="individual">Cá nhân</option>
        <option value="company">Doanh nghiệp</option>
      </select>
    )
  }
  if (field === 'is_first_booking') {
    return (
      <select className={inputCls} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Chọn...</option>
        <option value="true">Có (lần đầu tiên)</option>
        <option value="false">Không</option>
      </select>
    )
  }
  return <input className={inputCls} value={value} onChange={e => onChange(e.target.value)} placeholder="Nhập giá trị..." />
}

function ConditionsBuilder({
  conditions, onChange,
}: {
  conditions: Array<{ field: ConditionField; operator: ConditionOperator; value: string }>
  onChange: (c: typeof conditions) => void
}) {
  const inputCls = 'border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 focus:border-[#b11e29]'

  const addCondition = () =>
    onChange([...conditions, { field: 'space_type', operator: 'equals', value: '' }])

  const remove = (i: number) => onChange(conditions.filter((_, idx) => idx !== i))

  const update = (i: number, patch: Partial<{ field: ConditionField; operator: ConditionOperator; value: string }>) =>
    onChange(conditions.map((c, idx) => {
      if (idx !== i) return c
      const next = { ...c, ...patch }
      if (patch.field) {
        next.operator = FIELD_ALLOWED_OPS[patch.field][0]
        next.value = ''
      }
      return next
    }))

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Điều kiện áp dụng (F-86)</p>
        <button type="button" onClick={addCondition} className="text-xs text-[#b11e29] hover:underline flex items-center gap-1">
          <Plus className="w-3 h-3" /> Thêm điều kiện
        </button>
      </div>

      {conditions.length === 0 && (
        <p className="text-xs text-slate-400 italic">Không có điều kiện — áp dụng cho tất cả đơn hàng</p>
      )}

      {conditions.map((cond, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-2 flex-wrap">
          {i > 0 && <span className="text-xs font-medium text-slate-500 px-1">VÀ</span>}
          <select
            className={inputCls}
            value={cond.field}
            onChange={e => update(i, { field: e.target.value as ConditionField })}>
            {(Object.keys(CONDITION_FIELD_LABELS) as ConditionField[]).map(f => (
              <option key={f} value={f}>{CONDITION_FIELD_LABELS[f]}</option>
            ))}
          </select>
          <select
            className={inputCls}
            value={cond.operator}
            onChange={e => update(i, { operator: e.target.value as ConditionOperator })}>
            {FIELD_ALLOWED_OPS[cond.field].map(op => (
              <option key={op} value={op}>{OPERATOR_LABELS[op]}</option>
            ))}
          </select>
          <ConditionValueInput
            field={cond.field}
            value={cond.value}
            onChange={v => update(i, { value: v })}
          />
          <button type="button" onClick={() => remove(i)} className="text-slate-400 hover:text-red-500 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

// ========== CREATE MODAL ==========

interface CreateModalProps {
  onClose: () => void
  onCreate: (data: {
    name: string
    description: string
    type: PromotionType
    startDate: string
    endDate?: string
    discountAction: DiscountAction
    maxUsageTotal?: number
    maxUsagePerCustomer?: number
    stackable: boolean
    priority: number
    requiresVoucherCode: boolean
    conditions: PromotionCondition[]
  }) => void
  saving: boolean
}

function CreateModal({ onClose, onCreate, saving }: CreateModalProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'percent_off' as PromotionType,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    value: '',
    maxUsageTotal: '',
    maxUsagePerCustomer: '',
    stackable: false,
    priority: '3',
    requiresVoucherCode: false,
  })
  const [conditions, setConditions] = useState<Array<{ field: ConditionField; operator: ConditionOperator; value: string }>>([]) 

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let discountAction: DiscountAction = {
      type: form.type,
      applyTo: 'space_fee',
    }
    if (form.type === 'percent_off' || form.type === 'fixed_amount') {
      discountAction.value = Number(form.value)
    }
    if (form.type === 'buy_x_get_y') {
      discountAction.buyQuantity = 3
      discountAction.getQuantity = 1
      discountAction.getUnit = 'month'
    }
    onCreate({
      name: form.name,
      description: form.description,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      discountAction,
      maxUsageTotal: form.maxUsageTotal ? Number(form.maxUsageTotal) : undefined,
      maxUsagePerCustomer: form.maxUsagePerCustomer ? Number(form.maxUsagePerCustomer) : undefined,
      stackable: form.stackable,
      priority: Number(form.priority),
      requiresVoucherCode: form.requiresVoucherCode,
      conditions: conditions.map(c => ({
        field: c.field,
        operator: c.operator,
        value: c.value,
      } as PromotionCondition)),
    })
  }

  const inputCls =
    'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 focus:border-[#b11e29]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-800 mb-5">Tạo chương trình khuyến mãi</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tên chương trình *</label>
            <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="VD: Khai trương Building 2 – Giảm 20%" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Mô tả</label>
            <textarea className={inputCls} rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về chương trình..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Loại khuyến mãi *</label>
              <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                {Object.entries(PROMOTION_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Độ ưu tiên (1 = cao nhất)</label>
              <input type="number" min={1} max={10} className={inputCls} value={form.priority} onChange={e => set('priority', e.target.value)} />
            </div>
          </div>

          {(form.type === 'percent_off' || form.type === 'fixed_amount') && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {form.type === 'percent_off' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VND)'}
              </label>
              <input type="number" min={0} className={inputCls} value={form.value} onChange={e => set('value', e.target.value)} placeholder={form.type === 'percent_off' ? '20' : '100000'} required />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ngày bắt đầu *</label>
              <input type="date" className={inputCls} value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ngày kết thúc</label>
              <input type="date" className={inputCls} value={form.endDate} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tổng lượt dùng tối đa</label>
              <input type="number" min={0} className={inputCls} value={form.maxUsageTotal} onChange={e => set('maxUsageTotal', e.target.value)} placeholder="Không giới hạn" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Lượt/khách tối đa</label>
              <input type="number" min={0} className={inputCls} value={form.maxUsagePerCustomer} onChange={e => set('maxUsagePerCustomer', e.target.value)} placeholder="Không giới hạn" />
            </div>
          </div>

          <ConditionsBuilder conditions={conditions} onChange={setConditions} />

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input type="checkbox" checked={form.stackable} onChange={e => set('stackable', e.target.checked)} className="w-4 h-4 rounded accent-[#b11e29]" />
              Có thể kết hợp với KM khác
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input type="checkbox" checked={form.requiresVoucherCode} onChange={e => set('requiresVoucherCode', e.target.checked)} className="w-4 h-4 rounded accent-[#b11e29]" />
              Yêu cầu nhập mã voucher
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Hủy</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-[#b11e29] text-white font-medium hover:bg-[#8e1820] disabled:opacity-50">
              {saving ? 'Đang lưu...' : 'Tạo (Trạng thái: Nháp)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========== DISCOUNT DISPLAY ==========

function DiscountLabel({ action }: { action: DiscountAction }) {
  switch (action.type) {
    case 'percent_off': return <span className="text-green-700 font-semibold">-{action.value}%</span>
    case 'fixed_amount': return <span className="text-green-700 font-semibold">-{new Intl.NumberFormat('vi-VN').format(action.value ?? 0)} đ</span>
    case 'buy_x_get_y': return <span className="text-purple-700 font-semibold">Mua {action.buyQuantity} tặng {action.getQuantity} {action.getUnit}</span>
    case 'free_service': return <span className="text-blue-700 font-semibold">Tặng {action.freeServiceQuantity} {action.freeServiceName}</span>
    case 'upgrade': return <span className="text-indigo-700 font-semibold">Nâng hạng miễn phí</span>
    default: return null
  }
}

// ========== MAIN PAGE ==========

export function PromotionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PromotionStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<PromotionType | ''>('')
  const [showCreate, setShowCreate] = useState(false)

  const filters = useMemo(() => ({
    search: search || undefined,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  }), [search, statusFilter, typeFilter])

  const { data: promotions = [], isLoading } = usePromotions(filters)
  const createMutation = useCreatePromotion()
  const approveMutation = useApprovePromotion()
  const pauseMutation = usePauseResumePromotion()

  const stats = useMemo(() => ({
    total: promotions.length,
    active: promotions.filter(p => p.status === 'active').length,
    scheduled: promotions.filter(p => p.status === 'scheduled').length,
    totalUsage: promotions.reduce((s, p) => s + p.currentUsageCount, 0),
  }), [promotions])

  const handleCreate = async (data: Parameters<typeof createMutation.mutateAsync>[0]) => {
    try {
      await createMutation.mutateAsync(data)
      setShowCreate(false)
    } catch {
      alert('Không thể tạo chương trình. Vui lòng thử lại.')
    }
  }

  const handleApprove = async (p: PromotionProgram) => {
    if (confirm(`Duyệt chương trình "${p.name}"?`)) {
      try {
        await approveMutation.mutateAsync(p.id)
      } catch {
        alert('Thao tác thất bại.')
      }
    }
  }

  const handlePauseResume = async (p: PromotionProgram) => {
    const action = p.status === 'paused' ? 'tiếp tục' : 'tạm dừng'
    if (confirm(`Xác nhận ${action} chương trình "${p.name}"?`)) {
      try {
        await pauseMutation.mutateAsync(p.id)
      } catch {
        alert('Thao tác thất bại.')
      }
    }
  }

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '–'

  return (
    <>
      <Header title="Chương trình khuyến mãi" subtitle="Quản lý promotions và chiến dịch giảm giá" />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Tổng chương trình', value: stats.total, icon: <Tag className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
              { label: 'Đang hoạt động', value: stats.active, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
              { label: 'Đã lên lịch', value: stats.scheduled, icon: <CalendarRange className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600' },
              { label: 'Tổng lượt đã áp dụng', value: stats.totalUsage, icon: <TrendingDown className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
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
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#b11e29]" />
                <h2 className="font-semibold text-slate-800">Danh sách khuyến mãi</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]" placeholder="Tìm tên, mã..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]" value={statusFilter} onChange={e => setStatusFilter(e.target.value as PromotionStatus | '')}>
                  <option value="">Tất cả trạng thái</option>
                  {Object.entries(PROMOTION_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]" value={typeFilter} onChange={e => setTypeFilter(e.target.value as PromotionType | '')}>
                  <option value="">Tất cả loại</option>
                  {Object.entries(PROMOTION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#b11e29] text-white text-sm font-medium rounded-lg hover:bg-[#8e1820] transition-colors whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  Tạo chương trình
                </button>
              </div>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm">Đang tải...</div>
            ) : promotions.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">Chưa có chương trình khuyến mãi nào</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {promotions.map(p => (
                  <div key={p.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PROMOTION_STATUS_COLORS[p.status]}`}>
                            {PROMOTION_STATUS_LABELS[p.status]}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{p.code}</span>
                          {!p.requiresVoucherCode && (
                            <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">Auto-apply</span>
                          )}
                          {p.stackable && (
                            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">Có thể stack</span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-800 mt-1.5">{p.name}</p>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>Loại: <span className="text-slate-700">{PROMOTION_TYPE_LABELS[p.type]}</span></span>
                          <span>Giảm: <DiscountLabel action={p.discountAction} /></span>
                          <span>Lượt đã dùng: <span className="text-slate-700 font-medium">{p.currentUsageCount}{p.maxUsageTotal ? `/${p.maxUsageTotal}` : ''}</span></span>
                          <span>{formatDate(p.startDate)} – {formatDate(p.endDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {p.status === 'draft' && (
                          <button onClick={() => handleApprove(p)} disabled={approveMutation.isPending} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            Duyệt
                          </button>
                        )}
                        {p.status === 'pending_approval' && (
                          <button onClick={() => handleApprove(p)} disabled={approveMutation.isPending} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            Duyệt
                          </button>
                        )}
                        {(p.status === 'active' || p.status === 'scheduled') && (
                          <button onClick={() => handlePauseResume(p)} disabled={pauseMutation.isPending} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium transition-colors">
                            <Pause className="w-3.5 h-3.5" />
                            Tạm dừng
                          </button>
                        )}
                        {p.status === 'paused' && (
                          <button onClick={() => handlePauseResume(p)} disabled={pauseMutation.isPending} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors">
                            <Play className="w-3.5 h-3.5" />
                            Tiếp tục
                          </button>
                        )}
                        {p.status === 'scheduled' && (
                          <span className="flex items-center gap-1 text-xs text-slate-400 px-2">
                            <Clock className="w-3.5 h-3.5" />
                            Bắt đầu {formatDate(p.startDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          saving={createMutation.isPending}
        />
      )}
    </>
  )
}
