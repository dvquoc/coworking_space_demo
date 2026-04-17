import type {
  PromotionProgram,
  VoucherCode,
  CreatePromotionRequest,
  CreateVoucherRequest,
  SpacePricingRule,
  AddOnServicePricing,
  PricingHistoryEntry,
} from '../types/pricing'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ========== ADD-ON SERVICES FOR BOOKING (F-88) ==========

export interface BookingAddOn {
  id: string
  name: string
  description: string
  unitPrice: number  // VND
  unit: string       // 'lần' | 'giờ' | 'trang' | 'tháng' | v.v.
  category: 'av' | 'catering' | 'printing' | 'internet' | 'support' | 'other'
  icon: string       // emoji icon
}

export const mockBookingAddOns: BookingAddOn[] = [
  {
    id: 'addon-projector',
    name: 'Máy chiếu',
    description: 'Máy chiếu Full HD, màn chiếu 100 inch',
    unitPrice: 200000,
    unit: 'buổi',
    category: 'av',
    icon: '📽️',
  },
  {
    id: 'addon-tv-screen',
    name: 'Màn hình TV 55"',
    description: 'Smart TV 55 inch kết nối HDMI/Wireless',
    unitPrice: 150000,
    unit: 'buổi',
    category: 'av',
    icon: '📺',
  },
  {
    id: 'addon-pa-system',
    name: 'Hệ thống âm thanh PA',
    description: 'Loa, micro không dây, mixer cho sự kiện',
    unitPrice: 500000,
    unit: 'buổi',
    category: 'av',
    icon: '🔊',
  },
  {
    id: 'addon-video-conference',
    name: 'Video Conference Setup',
    description: 'Camera 4K, loa thông minh, phần mềm Zoom/Teams',
    unitPrice: 300000,
    unit: 'buổi',
    category: 'av',
    icon: '📹',
  },
  {
    id: 'addon-coffee',
    name: 'Set cà phê & nước giải khát',
    description: 'Cà phê, trà, nước suối cho nhóm (tối đa 10 người)',
    unitPrice: 150000,
    unit: 'set',
    category: 'catering',
    icon: '☕',
  },
  {
    id: 'addon-catering-light',
    name: 'Buffet nhẹ (Light catering)',
    description: 'Bánh ngọt, sandwiches, nước uống cho nhóm',
    unitPrice: 500000,
    unit: 'set',
    category: 'catering',
    icon: '🍰',
  },
  {
    id: 'addon-print-bw',
    name: 'In ấn A4 trắng đen',
    description: 'In tài liệu A4 một mặt, trắng đen',
    unitPrice: 500,
    unit: 'trang',
    category: 'printing',
    icon: '🖨️',
  },
  {
    id: 'addon-print-color',
    name: 'In ấn A4 màu',
    description: 'In tài liệu A4 màu sắc đầy đủ',
    unitPrice: 2000,
    unit: 'trang',
    category: 'printing',
    icon: '🖨️',
  },
  {
    id: 'addon-wifi-premium',
    name: 'WiFi Premium 100Mbps',
    description: 'Đường truyền riêng tốc độ cao không chia sẻ',
    unitPrice: 100000,
    unit: 'buổi',
    category: 'internet',
    icon: '📶',
  },
  {
    id: 'addon-receptionist',
    name: 'Lễ tân hỗ trợ sự kiện',
    description: 'Nhân viên lễ tân hỗ trợ đón tiếp khách mời',
    unitPrice: 300000,
    unit: 'giờ',
    category: 'support',
    icon: '🙋',
  },
  {
    id: 'addon-whiteboard',
    name: 'Bảng trắng & marker',
    description: 'Bảng trắng từ tính + bộ marker xóa được',
    unitPrice: 50000,
    unit: 'buổi',
    category: 'other',
    icon: '📋',
  },
  {
    id: 'addon-flipchart',
    name: 'Giấy Flipchart',
    description: 'Bộ giấy Flipchart A1 + marker (50 tờ)',
    unitPrice: 80000,
    unit: 'bộ',
    category: 'other',
    icon: '📄',
  },
]

// ========== MOCK PROMOTIONS (F-85) ==========

export const mockPromotions: PromotionProgram[] = [
  {
    id: 'promo-001',
    code: 'PROMO-2026-Q2-01',
    name: 'Khai trương Building 2 – Giảm 20%',
    description: 'Ưu đãi đặc biệt mừng khai trương tòa nhà Building 2, áp dụng cho toàn bộ không gian trong tháng 5/2026.',
    type: 'percent_off',
    status: 'active',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    conditions: [
      { field: 'building_id', operator: 'equals', value: '2' },
    ],
    discountAction: {
      type: 'percent_off',
      value: 20,
      applyTo: 'space_fee',
    },
    maxUsageTotal: 100,
    maxUsagePerCustomer: 1,
    currentUsageCount: 12,
    stackable: false,
    priority: 1,
    requiresVoucherCode: false,
    createdBy: 'staff-001',
    approvedBy: 'admin-001',
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 'promo-002',
    code: 'PROMO-2026-LONG3',
    name: 'Thuê 3 tháng tặng 1 tháng – Dedicated Desk',
    description: 'Khách hàng ký hợp đồng Dedicated Desk từ 3 tháng trở lên được tặng thêm 1 tháng miễn phí.',
    type: 'buy_x_get_y',
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    conditions: [
      { field: 'space_type', operator: 'equals', value: 'dedicated_desk' },
      { field: 'duration_months', operator: 'greater_than', value: 2 },
    ],
    discountAction: {
      type: 'buy_x_get_y',
      buyQuantity: 3,
      getQuantity: 1,
      getUnit: 'month',
      applyTo: 'space_fee',
    },
    maxUsageTotal: undefined,
    maxUsagePerCustomer: 1,
    currentUsageCount: 8,
    stackable: false,
    priority: 2,
    requiresVoucherCode: false,
    createdBy: 'staff-001',
    approvedBy: 'admin-001',
    createdAt: '2025-12-15T09:00:00Z',
    updatedAt: '2025-12-15T09:00:00Z',
  },
  {
    id: 'promo-003',
    code: 'PROMO-2026-WELCOME',
    name: 'Chào mừng khách mới – Tặng 100 trang in',
    description: 'Khách hàng tạo booking lần đầu tiên được tặng 100 trang in A4 trắng đen miễn phí.',
    type: 'free_service',
    status: 'active',
    startDate: '2026-01-01',
    conditions: [
      { field: 'is_first_booking', operator: 'equals', value: 'true' },
    ],
    discountAction: {
      type: 'free_service',
      freeServiceCode: 'SVC-005',
      freeServiceName: 'In A4 trắng đen',
      freeServiceQuantity: 100,
      applyTo: 'service_fee',
    },
    maxUsagePerCustomer: 1,
    currentUsageCount: 24,
    stackable: true,
    priority: 3,
    requiresVoucherCode: false,
    createdBy: 'staff-001',
    approvedBy: 'admin-001',
    createdAt: '2025-12-20T09:00:00Z',
    updatedAt: '2025-12-20T09:00:00Z',
  },
  {
    id: 'promo-004',
    code: 'PROMO-2026-VIP50',
    name: 'VIP – Giảm 50% tháng đầu',
    description: 'Dành cho khách VIP theo chỉ định. Giảm 50% tiền thuê tháng đầu cho Private Office.',
    type: 'percent_off',
    status: 'active',
    startDate: '2026-01-01',
    conditions: [
      { field: 'space_type', operator: 'equals', value: 'private_office' },
      { field: 'customer_tag', operator: 'in', value: ['vip'] },
    ],
    discountAction: {
      type: 'percent_off',
      value: 50,
      maxDiscountAmount: 10000000,
      applyTo: 'space_fee',
    },
    maxUsagePerCustomer: 1,
    currentUsageCount: 3,
    stackable: false,
    priority: 1,
    requiresVoucherCode: true,
    createdBy: 'admin-001',
    approvedBy: 'admin-001',
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'promo-005',
    code: 'PROMO-2026-SUMMER',
    name: 'Summer Hot Desk – Giảm 15%',
    description: 'Khuyến mãi hè cho Hot Desk đặt cuối tuần.',
    type: 'percent_off',
    status: 'scheduled',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    conditions: [
      { field: 'space_type', operator: 'equals', value: 'hot_desk' },
      { field: 'booking_day', operator: 'in', value: [0, 6] },
    ],
    discountAction: {
      type: 'percent_off',
      value: 15,
      applyTo: 'space_fee',
    },
    maxUsageTotal: 200,
    currentUsageCount: 0,
    stackable: true,
    priority: 4,
    requiresVoucherCode: false,
    createdBy: 'staff-001',
    createdAt: '2026-04-15T09:00:00Z',
    updatedAt: '2026-04-15T09:00:00Z',
  },
  {
    id: 'promo-006',
    code: 'PROMO-2025-Q4-01',
    name: 'Black Friday 2025 – Giảm 30%',
    description: 'Sự kiện Black Friday năm 2025.',
    type: 'percent_off',
    status: 'expired',
    startDate: '2025-11-24',
    endDate: '2025-11-30',
    conditions: [],
    discountAction: {
      type: 'percent_off',
      value: 30,
      maxDiscountAmount: 5000000,
      applyTo: 'subtotal',
    },
    maxUsageTotal: 50,
    currentUsageCount: 48,
    stackable: false,
    priority: 1,
    requiresVoucherCode: true,
    createdBy: 'admin-001',
    approvedBy: 'admin-001',
    createdAt: '2025-11-01T09:00:00Z',
    updatedAt: '2025-11-30T23:59:00Z',
  },
]

// ========== MOCK VOUCHERS (F-87) ==========

export const mockVouchers: VoucherCode[] = [
  {
    id: 'vch-001',
    code: 'VIP-ABC-50',
    promotionId: 'promo-004',
    promotionName: 'VIP – Giảm 50% tháng đầu',
    assignedCustomerId: 'cus-006',
    assignedCustomerName: 'ABC Technology Co., Ltd',
    maxUsageTotal: 1,
    maxUsagePerCustomer: 1,
    currentUsageCount: 0,
    isActive: true,
    expiresAt: '2026-06-30',
    usageHistory: [],
    createdAt: '2026-04-01T09:00:00Z',
    createdBy: 'admin-001',
  },
  {
    id: 'vch-002',
    code: 'VIP-XYZ-50',
    promotionId: 'promo-004',
    promotionName: 'VIP – Giảm 50% tháng đầu',
    assignedCustomerId: 'cus-007',
    assignedCustomerName: 'XYZ Marketing Agency',
    maxUsageTotal: 1,
    maxUsagePerCustomer: 1,
    currentUsageCount: 1,
    isActive: false,
    expiresAt: '2026-05-31',
    usageHistory: [
      {
        bookingId: 'bk-2604-001',
        customerId: 'cus-007',
        customerName: 'XYZ Marketing Agency',
        usedAt: '2026-04-05T10:30:00Z',
        discountAmount: 7500000,
      },
    ],
    createdAt: '2026-03-20T09:00:00Z',
    createdBy: 'admin-001',
  },
  {
    id: 'vch-003',
    code: 'BF25-X7KP2M',
    promotionId: 'promo-006',
    promotionName: 'Black Friday 2025 – Giảm 30%',
    maxUsageTotal: 1,
    currentUsageCount: 1,
    isActive: false,
    expiresAt: '2025-11-30',
    usageHistory: [
      {
        bookingId: 'bk-2511-005',
        customerId: 'cus-008',
        customerName: 'Global Finance Corp',
        usedAt: '2025-11-25T14:00:00Z',
        discountAmount: 4500000,
      },
    ],
    createdAt: '2025-11-01T09:00:00Z',
    createdBy: 'admin-001',
  },
  {
    id: 'vch-004',
    code: 'BF25-R3NQ8W',
    promotionId: 'promo-006',
    promotionName: 'Black Friday 2025 – Giảm 30%',
    maxUsageTotal: 1,
    currentUsageCount: 0,
    isActive: false,
    expiresAt: '2025-11-30',
    usageHistory: [],
    createdAt: '2025-11-01T09:00:00Z',
    createdBy: 'admin-001',
  },
  {
    id: 'vch-005',
    code: 'WELCOME2026',
    promotionId: 'promo-003',
    promotionName: 'Chào mừng khách mới – Tặng 100 trang in',
    maxUsageTotal: 500,
    currentUsageCount: 24,
    isActive: true,
    usageHistory: [],
    createdAt: '2025-12-20T09:00:00Z',
    createdBy: 'staff-001',
  },
]

// ========== MOCK API ==========

function generateCode(len = 8) {
  return Array.from({ length: len }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')
}

export const mockPricingAPI = {
  // --- Promotions ---
  getPromotions: async (filters?: { status?: string; type?: string; search?: string }) => {
    await delay(300)
    let items = [...mockPromotions]
    if (filters?.status) items = items.filter(p => p.status === filters.status)
    if (filters?.type) items = items.filter(p => p.type === filters.type)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    }
    return items
  },

  getPromotion: async (id: string) => {
    await delay(200)
    return mockPromotions.find(p => p.id === id) ?? null
  },

  createPromotion: async (data: CreatePromotionRequest) => {
    await delay(400)
    const now = new Date().toISOString()
    const newPromo: PromotionProgram = {
      id: `promo-${String(mockPromotions.length + 1).padStart(3, '0')}`,
      code: `PROMO-${new Date().getFullYear()}-${String(mockPromotions.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'draft',
      currentUsageCount: 0,
      createdBy: 'staff-001',
      createdAt: now,
      updatedAt: now,
    }
    mockPromotions.push(newPromo)
    return newPromo
  },

  updatePromotion: async (id: string, data: Partial<PromotionProgram>) => {
    await delay(400)
    const idx = mockPromotions.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Promotion not found')
    mockPromotions[idx] = { ...mockPromotions[idx], ...data, updatedAt: new Date().toISOString() }
    return mockPromotions[idx]
  },

  approvePromotion: async (id: string) => {
    await delay(400)
    const idx = mockPromotions.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Promotion not found')
    const now = new Date().toISOString()
    const p = mockPromotions[idx]
    const startDate = new Date(p.startDate)
    const status: PromotionProgram['status'] = startDate <= new Date() ? 'active' : 'scheduled'
    mockPromotions[idx] = { ...p, status, approvedBy: 'admin-001', updatedAt: now }
    return mockPromotions[idx]
  },

  pauseResumePromotion: async (id: string) => {
    await delay(300)
    const idx = mockPromotions.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Promotion not found')
    const newStatus = mockPromotions[idx].status === 'paused' ? 'active' : 'paused'
    mockPromotions[idx] = { ...mockPromotions[idx], status: newStatus, updatedAt: new Date().toISOString() }
    return mockPromotions[idx]
  },

  // --- Vouchers ---
  getVouchers: async (filters?: { promotionId?: string; isActive?: boolean; search?: string }) => {
    await delay(300)
    let items = [...mockVouchers]
    if (filters?.promotionId) items = items.filter(v => v.promotionId === filters.promotionId)
    if (filters?.isActive !== undefined) items = items.filter(v => v.isActive === filters.isActive)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      items = items.filter(v => v.code.toLowerCase().includes(q) || (v.assignedCustomerName ?? '').toLowerCase().includes(q))
    }
    return items
  },

  createVouchers: async (data: CreateVoucherRequest) => {
    await delay(400)
    const count = data.count ?? 1
    const promo = mockPromotions.find(p => p.id === data.promotionId)
    const now = new Date().toISOString()
    const created: VoucherCode[] = []
    for (let i = 0; i < count; i++) {
      const v: VoucherCode = {
        id: `vch-${String(mockVouchers.length + i + 1).padStart(3, '0')}`,
        code: data?.code ?? (count > 1 ? `GEN-${generateCode(6)}` : `CODE-${generateCode(6)}`),
        promotionId: data.promotionId,
        promotionName: promo?.name ?? '',
        assignedCustomerId: data.assignedCustomerId,
        maxUsageTotal: data.maxUsageTotal ?? 1,
        currentUsageCount: 0,
        isActive: true,
        expiresAt: data.expiresAt,
        usageHistory: [],
        createdAt: now,
        createdBy: 'staff-001',
      }
      mockVouchers.push(v)
      created.push(v)
    }
    return created
  },

  revokeVoucher: async (id: string) => {
    await delay(300)
    const idx = mockVouchers.findIndex(v => v.id === id)
    if (idx === -1) throw new Error('Voucher not found')
    mockVouchers[idx] = { ...mockVouchers[idx], isActive: false }
    return mockVouchers[idx]
  },

  validateVoucher: async (code: string) => {
    await delay(200)
    const voucher = mockVouchers.find(v => v.code === code)
    if (!voucher) return { valid: false, reason: 'Mã không tồn tại' }
    if (!voucher.isActive) return { valid: false, reason: 'Mã đã bị vô hiệu hoá' }
    if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) return { valid: false, reason: 'Mã đã hết hạn' }
    if (voucher.maxUsageTotal !== undefined && voucher.currentUsageCount >= voucher.maxUsageTotal) return { valid: false, reason: 'Mã đã dùng hết lượt' }
    const promo = mockPromotions.find(p => p.id === voucher.promotionId)
    return { valid: true, voucher, promotion: promo }
  },
}

// ========== SPACE PRICING MOCKS (F-81) ==========

export const mockSpacePricingRules: SpacePricingRule[] = [
  {
    id: 'spr-001',
    name: 'Hot Desk – Tiêu chuẩn',
    spaceType: 'hot_desk',
    pricePerHour: 50000,
    pricePerDay: 250000,
    pricePerWeek: 1400000,
    pricePerMonth: 3500000,
    minBookingHours: 2,
    weekendDiscount: 10,
    longTermDiscounts: [
      { unit: 'month', minQuantity: 3, discountPercent: 5 },
      { unit: 'month', minQuantity: 6, discountPercent: 10 },
    ],
    effectiveFrom: '2026-01-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'admin',
  },
  {
    id: 'spr-002',
    name: 'Dedicated Desk – Cố định',
    spaceType: 'dedicated_desk',
    pricePerDay: 400000,
    pricePerWeek: 2200000,
    pricePerMonth: 7000000,
    minBookingDays: 1,
    longTermDiscounts: [
      { unit: 'month', minQuantity: 3, discountPercent: 8 },
      { unit: 'month', minQuantity: 6, discountPercent: 15 },
    ],
    effectiveFrom: '2026-01-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'admin',
  },
  {
    id: 'spr-003',
    name: 'Private Office – Nhỏ (1–4 người)',
    spaceType: 'private_office',
    pricePerMonth: 15000000,
    pricePerYear: 160000000,
    minBookingDays: 30,
    longTermDiscounts: [
      { unit: 'month', minQuantity: 6, discountPercent: 10 },
      { unit: 'month', minQuantity: 12, discountPercent: 18 },
    ],
    effectiveFrom: '2026-01-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'admin',
    notes: 'Office từ 1–4 người',
  },
  {
    id: 'spr-004',
    name: 'Meeting Room – Theo giờ',
    spaceType: 'meeting_room',
    pricePerHour: 200000,
    pricePerDay: 1500000,
    minBookingHours: 1,
    weekendDiscount: 15,
    offPeakDiscount: 20,
    effectiveFrom: '2026-01-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'admin',
    notes: 'Giờ thấp điểm: trước 9h và sau 18h',
  },
  {
    id: 'spr-005',
    name: 'Không gian sự kiện',
    spaceType: 'event_space',
    pricePerHour: 800000,
    pricePerDay: 5000000,
    minBookingHours: 3,
    effectiveFrom: '2026-01-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'admin',
  },
  {
    id: 'spr-006',
    name: 'Phone Booth – Theo giờ',
    spaceType: 'phone_booth',
    pricePerHour: 30000,
    minBookingHours: 1,
    effectiveFrom: '2026-01-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'admin',
  },
]

// ========== ADD-ON SERVICE PRICING MOCKS (F-82) ==========

export const mockAddOnServicePricing: AddOnServicePricing[] = [
  {
    id: 'aop-001',
    serviceCode: 'PRINT-BW-A4',
    name: 'In A4 trắng đen',
    category: 'printing',
    description: 'In laser trắng đen khổ A4',
    unitPrice: 500,
    unit: 'trang',
    billingType: 'per_use',
    pricingTiers: [
      { fromUnit: 1, toUnit: 100, pricePerUnit: 600 },
      { fromUnit: 101, toUnit: 500, pricePerUnit: 500 },
      { fromUnit: 501, pricePerUnit: 400 },
    ],
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-002',
    serviceCode: 'PRINT-COLOR-A4',
    name: 'In A4 màu',
    category: 'printing',
    description: 'In màu chất lượng cao khổ A4',
    unitPrice: 2000,
    unit: 'trang',
    billingType: 'per_use',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-003',
    serviceCode: 'SCAN-DOC',
    name: 'Scan tài liệu',
    category: 'printing',
    description: 'Scan màu, xuất file PDF/JPG',
    unitPrice: 300,
    unit: 'trang',
    billingType: 'per_use',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-004',
    serviceCode: 'LOCKER-MONTHLY',
    name: 'Tủ cá nhân',
    category: 'storage',
    description: 'Tủ khóa cá nhân, truy cập 24/7',
    unitPrice: 200000,
    unit: 'tháng',
    billingType: 'subscription',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-005',
    serviceCode: 'WIFI-PREMIUM',
    name: 'WiFi Premium 100Mbps',
    category: 'connectivity',
    description: 'Đường truyền riêng 100Mbps dedicated',
    unitPrice: 300000,
    unit: 'tháng',
    billingType: 'subscription',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-006',
    serviceCode: 'COFFEE',
    name: 'Cà phê',
    category: 'food_drink',
    description: 'Cà phê pha máy Ý, các loại',
    unitPrice: 25000,
    unit: 'ly',
    billingType: 'per_use',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-007',
    serviceCode: 'WATER-BOTTLE',
    name: 'Nước lọc đóng chai',
    category: 'food_drink',
    description: 'Nước tinh khiết 350ml',
    unitPrice: 10000,
    unit: 'chai',
    billingType: 'per_use',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-008',
    serviceCode: 'PARKING-MOTORBIKE-DAY',
    name: 'Giữ xe máy',
    category: 'parking',
    description: 'Bãi đỗ xe có bảo vệ 24/7',
    unitPrice: 15000,
    unit: 'ngày',
    billingType: 'per_use',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-009',
    serviceCode: 'PARKING-CAR-DAY',
    name: 'Giữ ô tô',
    category: 'parking',
    description: 'Bãi đỗ ô tô tầng hầm',
    unitPrice: 50000,
    unit: 'ngày',
    billingType: 'per_use',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'aop-010',
    serviceCode: 'MAIL-RECEPTION',
    name: 'Nhận bưu phẩm thay',
    category: 'reception',
    description: 'Lễ tân nhận, lưu trữ và thông báo bưu phẩm',
    unitPrice: 200000,
    unit: 'tháng',
    billingType: 'subscription',
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

// ========== PRICING HISTORY MOCKS (F-84) ==========

export let mockPricingHistory: PricingHistoryEntry[] = [
  {
    id: 'hist-006',
    entityType: 'addon_pricing',
    entityId: 'aop-001',
    entityName: 'In A4 trắng đen',
    action: 'updated',
    changedFields: [
      { field: 'unitPrice', label: 'Giá đơn vị', oldValue: 450, newValue: 500 },
    ],
    changedBy: 'accountant',
    changedAt: '2026-04-01T09:00:00Z',
    notes: 'Điều chỉnh giá in Q2 2026',
  },
  {
    id: 'hist-005',
    entityType: 'space_pricing',
    entityId: 'spr-004',
    entityName: 'Meeting Room – Theo giờ',
    action: 'updated',
    changedFields: [
      { field: 'pricePerHour', label: 'Giá/giờ', oldValue: 180000, newValue: 200000 },
      { field: 'weekendDiscount', label: 'Giảm cuối tuần', oldValue: 10, newValue: 15 },
    ],
    changedBy: 'manager',
    changedAt: '2026-03-20T14:00:00Z',
    notes: 'Cập nhật giá Meeting Room sau review Q1',
  },
  {
    id: 'hist-004',
    entityType: 'space_pricing',
    entityId: 'spr-001',
    entityName: 'Hot Desk – Tiêu chuẩn',
    action: 'updated',
    changedFields: [
      { field: 'pricePerHour', label: 'Giá/giờ', oldValue: 45000, newValue: 50000 },
      { field: 'pricePerMonth', label: 'Giá/tháng', oldValue: 3000000, newValue: 3500000 },
    ],
    changedBy: 'manager',
    changedAt: '2026-03-15T10:30:00Z',
    notes: 'Điều chỉnh giá Q2 2026',
  },
  {
    id: 'hist-003',
    entityType: 'addon_pricing',
    entityId: 'aop-005',
    entityName: 'WiFi Premium 100Mbps',
    action: 'activated',
    changedBy: 'admin',
    changedAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'hist-002',
    entityType: 'space_pricing',
    entityId: 'spr-003',
    entityName: 'Private Office – Nhỏ (1–4 người)',
    action: 'created',
    changedBy: 'admin',
    changedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'hist-001',
    entityType: 'space_pricing',
    entityId: 'spr-001',
    entityName: 'Hot Desk – Tiêu chuẩn',
    action: 'created',
    changedBy: 'admin',
    changedAt: '2026-01-01T08:00:00Z',
  },
]

export const mockPricingCatalogAPI = {
  getSpacePricing: async () => {
    await delay(400)
    return [...mockSpacePricingRules]
  },
  getAddOnPricing: async () => {
    await delay(400)
    return [...mockAddOnServicePricing]
  },
  createSpacePricingRule: async (data: Omit<SpacePricingRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(500)
    const newRule: SpacePricingRule = {
      ...data,
      id: `spr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockSpacePricingRules.push(newRule)
    mockPricingHistory.unshift({
      id: `hist-${Date.now()}`,
      entityType: 'space_pricing',
      entityId: newRule.id,
      entityName: newRule.name,
      action: 'created',
      changedBy: data.createdBy,
      changedAt: newRule.createdAt,
    })
    return newRule
  },
  updateSpacePricingRule: async (id: string, data: Partial<SpacePricingRule>) => {
    await delay(500)
    const idx = mockSpacePricingRules.findIndex(r => r.id === id)
    if (idx === -1) throw new Error('Rule not found')
    const old = mockSpacePricingRules[idx]
    mockSpacePricingRules[idx] = { ...old, ...data, updatedAt: new Date().toISOString() }
    mockPricingHistory.unshift({
      id: `hist-${Date.now()}`,
      entityType: 'space_pricing',
      entityId: id,
      entityName: mockSpacePricingRules[idx].name,
      action: 'updated',
      changedBy: 'admin',
      changedAt: new Date().toISOString(),
    })
    return mockSpacePricingRules[idx]
  },
  toggleSpacePricingActive: async (id: string) => {
    await delay(300)
    const idx = mockSpacePricingRules.findIndex(r => r.id === id)
    if (idx === -1) throw new Error('Rule not found')
    mockSpacePricingRules[idx] = { ...mockSpacePricingRules[idx], isActive: !mockSpacePricingRules[idx].isActive, updatedAt: new Date().toISOString() }
    mockPricingHistory.unshift({
      id: `hist-${Date.now()}`,
      entityType: 'space_pricing',
      entityId: id,
      entityName: mockSpacePricingRules[idx].name,
      action: mockSpacePricingRules[idx].isActive ? 'activated' : 'deactivated',
      changedBy: 'admin',
      changedAt: new Date().toISOString(),
    })
    return mockSpacePricingRules[idx]
  },
  createAddOnPricingRule: async (data: Omit<AddOnServicePricing, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(500)
    const newSvc: AddOnServicePricing = {
      ...data,
      id: `aop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockAddOnServicePricing.push(newSvc)
    mockPricingHistory.unshift({
      id: `hist-${Date.now()}`,
      entityType: 'addon_pricing',
      entityId: newSvc.id,
      entityName: newSvc.name,
      action: 'created',
      changedBy: 'admin',
      changedAt: newSvc.createdAt,
    })
    return newSvc
  },
  updateAddOnPricingRule: async (id: string, data: Partial<AddOnServicePricing>) => {
    await delay(500)
    const idx = mockAddOnServicePricing.findIndex(r => r.id === id)
    if (idx === -1) throw new Error('Rule not found')
    mockAddOnServicePricing[idx] = { ...mockAddOnServicePricing[idx], ...data, updatedAt: new Date().toISOString() }
    mockPricingHistory.unshift({
      id: `hist-${Date.now()}`,
      entityType: 'addon_pricing',
      entityId: id,
      entityName: mockAddOnServicePricing[idx].name,
      action: 'updated',
      changedBy: 'admin',
      changedAt: new Date().toISOString(),
    })
    return mockAddOnServicePricing[idx]
  },
  toggleAddOnActive: async (id: string) => {
    await delay(300)
    const idx = mockAddOnServicePricing.findIndex(r => r.id === id)
    if (idx === -1) throw new Error('Rule not found')
    mockAddOnServicePricing[idx] = { ...mockAddOnServicePricing[idx], isActive: !mockAddOnServicePricing[idx].isActive, updatedAt: new Date().toISOString() }
    mockPricingHistory.unshift({
      id: `hist-${Date.now()}`,
      entityType: 'addon_pricing',
      entityId: id,
      entityName: mockAddOnServicePricing[idx].name,
      action: mockAddOnServicePricing[idx].isActive ? 'activated' : 'deactivated',
      changedBy: 'admin',
      changedAt: new Date().toISOString(),
    })
    return mockAddOnServicePricing[idx]
  },
  getPricingHistory: async (entityType?: 'space_pricing' | 'addon_pricing') => {
    await delay(300)
    if (!entityType) return [...mockPricingHistory]
    return mockPricingHistory.filter(h => h.entityType === entityType)
  },
}
