// Pricing, Promotions & Voucher Types (EP-17)

// ========== ENUMS / UNIONS ==========

export type PromotionType =
  | 'percent_off'
  | 'fixed_amount'
  | 'buy_x_get_y'
  | 'free_service'
  | 'upgrade'

export type PromotionStatus =
  | 'draft'
  | 'pending_approval'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'expired'
  | 'cancelled'

export type ConditionField =
  | 'space_type'
  | 'building_id'
  | 'booking_day'
  | 'booking_hour'
  | 'duration_months'
  | 'order_amount'
  | 'customer_type'
  | 'customer_tag'
  | 'is_first_booking'
  | 'customer_id'

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'not_in'

// ========== CONDITION & ACTION ==========

export interface PromotionCondition {
  field: ConditionField
  operator: ConditionOperator
  value: string | number | string[] | number[]
}

export interface DiscountAction {
  type: PromotionType
  applyTo: 'space_fee' | 'service_fee' | 'subtotal'
  // percent_off / fixed_amount
  value?: number
  maxDiscountAmount?: number
  // buy_x_get_y
  buyQuantity?: number
  getQuantity?: number
  getUnit?: 'day' | 'week' | 'month'
  // free_service
  freeServiceCode?: string
  freeServiceName?: string
  freeServiceQuantity?: number
}

// ========== PROMOTION PROGRAM ==========

export interface PromotionProgram {
  id: string
  code: string
  name: string
  description: string
  type: PromotionType
  status: PromotionStatus
  startDate: string
  endDate?: string
  conditions: PromotionCondition[]
  discountAction: DiscountAction
  maxUsageTotal?: number
  maxUsagePerCustomer?: number
  currentUsageCount: number
  stackable: boolean
  priority: number
  requiresVoucherCode: boolean
  createdBy: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePromotionRequest {
  name: string
  description: string
  type: PromotionType
  startDate: string
  endDate?: string
  conditions: PromotionCondition[]
  discountAction: DiscountAction
  maxUsageTotal?: number
  maxUsagePerCustomer?: number
  stackable: boolean
  priority: number
  requiresVoucherCode: boolean
}

// ========== VOUCHER ==========

export interface VoucherUsage {
  bookingId: string
  customerId: string
  customerName: string
  usedAt: string
  discountAmount: number
}

export interface VoucherCode {
  id: string
  code: string
  promotionId: string
  promotionName: string
  assignedCustomerId?: string
  assignedCustomerName?: string
  maxUsageTotal?: number
  maxUsagePerCustomer?: number
  currentUsageCount: number
  isActive: boolean
  expiresAt?: string
  usageHistory: VoucherUsage[]
  createdAt: string
  createdBy: string
}

export interface CreateVoucherRequest {
  promotionId: string
  code?: string       // manual codes; omit for auto-generated
  count?: number         // number of auto-generated codes
  assignedCustomerId?: string
  maxUsageTotal?: number
  maxUsagePerCustomer?: number
  expiresAt?: string
}

// ========== SPACE PRICING (F-81) ==========

export type SpaceType =
  | 'hot_desk'
  | 'dedicated_desk'
  | 'private_office'
  | 'meeting_room'
  | 'event_space'
  | 'training_room'
  | 'phone_booth'
  | 'coworking_suite'

export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  private_office: 'Private Office',
  meeting_room: 'Meeting Room',
  event_space: 'Không gian sự kiện',
  training_room: 'Phòng đào tạo',
  phone_booth: 'Phone Booth',
  coworking_suite: 'Coworking Suite',
}

export interface LongTermDiscount {
  unit: 'month' | 'week'
  minQuantity: number
  discountPercent: number
}

export interface SpacePricingRule {
  id: string
  name: string
  spaceType?: SpaceType
  spaceId?: string
  buildingId?: string
  floorId?: string
  pricePerHour?: number
  pricePerDay?: number
  pricePerWeek?: number
  pricePerMonth?: number
  pricePerYear?: number
  minBookingHours?: number
  minBookingDays?: number
  weekendDiscount?: number
  offPeakDiscount?: number
  longTermDiscounts?: LongTermDiscount[]
  effectiveFrom: string
  effectiveTo?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  notes?: string
}

// ========== ADD-ON SERVICE PRICING (F-82) ==========

export type AddOnServiceCategory =
  | 'printing'
  | 'storage'
  | 'connectivity'
  | 'food_drink'
  | 'parking'
  | 'reception'
  | 'meeting'
  | 'other'

export const ADDON_CATEGORY_LABELS: Record<AddOnServiceCategory, string> = {
  printing: 'In ấn & photocopy',
  storage: 'Lưu trữ',
  connectivity: 'Kết nối internet',
  food_drink: 'Đồ ăn & uống',
  parking: 'Giữ xe',
  reception: 'Lễ tân',
  meeting: 'Meeting Room (thiết bị)',
  other: 'Khác',
}

export type BillingType = 'per_use' | 'flat_rate' | 'subscription'

export const BILLING_TYPE_LABELS: Record<BillingType, string> = {
  per_use: 'Theo lượt/số lượng',
  flat_rate: 'Giá cố định',
  subscription: 'Thuê bao tháng',
}

export interface PricingTier {
  fromUnit: number
  toUnit?: number
  pricePerUnit: number
}

export interface AddOnServicePricing {
  id: string
  serviceCode: string
  name: string
  category: AddOnServiceCategory
  description?: string
  unitPrice: number
  unit: string
  billingType: BillingType
  pricingTiers?: PricingTier[]
  availableInBuildings?: string[]
  applicableSpaceTypes?: SpaceType[]
  isActive: boolean
  effectiveFrom: string
  effectiveTo?: string
  createdAt: string
  updatedAt: string
}

// ========== CALCULATOR ==========

export interface CalculatorAddOn {
  serviceId: string
  serviceName: string
  unitPrice: number
  quantity: number
}

export interface CalculatorInput {
  spaceType: string
  buildingId: string
  unit: 'hour' | 'day' | 'week' | 'month'
  quantity: number
  addOns: CalculatorAddOn[]
  voucherCode?: string
}

export interface AppliedDiscount {
  promotionId: string
  promotionName: string
  discountAmount: number
  type: PromotionType
}

export interface CalculatorResult {
  spaceFee: number
  addOnFee: number
  subtotal: number
  appliedDiscounts: AppliedDiscount[]
  totalDiscount: number
  total: number
}

// ========== PRICING HISTORY (F-84) ==========

export interface PricingHistoryChangedField {
  field: string
  label: string
  oldValue: string | number
  newValue: string | number
}

export interface PricingHistoryEntry {
  id: string
  entityType: 'space_pricing' | 'addon_pricing'
  entityId: string
  entityName: string
  action: 'created' | 'updated' | 'activated' | 'deactivated'
  changedFields?: PricingHistoryChangedField[]
  changedBy: string
  changedAt: string
  notes?: string
}

// ========== LABEL MAPS ==========

export const PROMOTION_TYPE_LABELS: Record<PromotionType, string> = {
  percent_off: 'Giảm theo %',
  fixed_amount: 'Giảm số tiền cố định',
  buy_x_get_y: 'Mua X tặng Y',
  free_service: 'Tặng dịch vụ miễn phí',
  upgrade: 'Nâng hạng không gian',
}

export const PROMOTION_STATUS_LABELS: Record<PromotionStatus, string> = {
  draft: 'Nháp',
  pending_approval: 'Chờ duyệt',
  scheduled: 'Đã lên lịch',
  active: 'Đang hoạt động',
  paused: 'Tạm dừng',
  expired: 'Đã hết hạn',
  cancelled: 'Đã hủy',
}

export const PROMOTION_STATUS_COLORS: Record<PromotionStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  pending_approval: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-orange-100 text-orange-700',
  expired: 'bg-slate-100 text-slate-400',
  cancelled: 'bg-red-100 text-red-600',
}
