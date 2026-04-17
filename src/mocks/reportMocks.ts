import type {
  RevenueReport,
  OccupancyReport,
  CustomerAnalyticsReport,
  ServiceUsageReport,
  AssetReport,
  ReportFilter,
} from '../types/report'

const mockDelay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// ─── Revenue Report Mock ───────────────────────────────────────

export const mockRevenueReport: RevenueReport = {
  filter: {
    dateFrom: '2026-01-01',
    dateTo: '2026-04-30',
    granularity: 'month',
  },
  summary: {
    totalRevenue: 1715000000,
    revenueChange: 12.5,
    paidAmount: 1540000000,
    unpaidAmount: 120000000,
    overdueAmount: 55000000,
    totalInvoices: 284,
  },
  byPeriod: [
    { period: '2026-01', label: 'T1/2026', revenue: 410000000, invoiceCount: 68 },
    { period: '2026-02', label: 'T2/2026', revenue: 425000000, invoiceCount: 71 },
    { period: '2026-03', label: 'T3/2026', revenue: 440000000, invoiceCount: 73 },
    { period: '2026-04', label: 'T4/2026', revenue: 440000000, invoiceCount: 72 },
  ],
  byMethod: [
    { method: 'bank_transfer', label: 'Chuyển khoản', amount: 720000000, percent: 42 },
    { method: 'vnpay',         label: 'VNPay',          amount: 430000000, percent: 25 },
    { method: 'credit',        label: 'Credit',          amount: 258000000, percent: 15 },
    { method: 'momo',          label: 'MoMo',            amount: 172000000, percent: 10 },
    { method: 'cash',          label: 'Tiền mặt',        amount: 86000000,  percent: 5  },
    { method: 'zalopay',       label: 'ZaloPay',         amount: 49000000,  percent: 3  },
  ],
  bySpaceType: [
    { type: 'private_office', label: 'Văn phòng riêng', amount: 686000000,  percent: 40 },
    { type: 'fixed_desk',     label: 'Fixed Desk',       amount: 343000000,  percent: 20 },
    { type: 'hot_desk',       label: 'Hot Desk',         amount: 257250000,  percent: 15 },
    { type: 'meeting_room',   label: 'Phòng họp',        amount: 171500000,  percent: 10 },
    { type: 'event_space',    label: 'Event Space',      amount: 137200000,  percent: 8  },
    { type: 'virtual_office', label: 'Virtual Office',   amount: 120050000,  percent: 7  },
  ],
  byBuilding: [
    { buildingId: '1', buildingName: 'Cobi Building 1', revenue: 1029000000, percent: 60, change: 14.2 },
    { buildingId: '2', buildingName: 'Cobi Building 2', revenue: 686000000,  percent: 40, change: 10.1 },
  ],
  recentInvoices: [
    { id: 'inv1', invoiceCode: 'INV-202604-021', customerName: 'Công ty ABC Tech', date: '2026-04-15', amount: 45000000, status: 'paid' },
    { id: 'inv2', invoiceCode: 'INV-202604-020', customerName: 'Nguyễn Văn An', date: '2026-04-14', amount: 3500000, status: 'paid' },
    { id: 'inv3', invoiceCode: 'INV-202604-019', customerName: 'StartupXYZ', date: '2026-04-13', amount: 22000000, status: 'unpaid' },
    { id: 'inv4', invoiceCode: 'INV-202604-018', customerName: 'Trần Thị Bích', date: '2026-04-12', amount: 2800000, status: 'paid' },
    { id: 'inv5', invoiceCode: 'INV-202604-017', customerName: 'Công ty DEF Corp', date: '2026-04-10', amount: 38000000, status: 'overdue' },
    { id: 'inv6', invoiceCode: 'INV-202604-016', customerName: 'Lê Minh Tú', date: '2026-04-09', amount: 4200000, status: 'paid' },
    { id: 'inv7', invoiceCode: 'INV-202604-015', customerName: 'BlueOcean Ltd', date: '2026-04-08', amount: 15000000, status: 'partial' },
    { id: 'inv8', invoiceCode: 'INV-202603-089', customerName: 'Nguyễn Thu Hà', date: '2026-03-31', amount: 3200000, status: 'paid' },
    { id: 'inv9', invoiceCode: 'INV-202603-088', customerName: 'GreenTech Co.', date: '2026-03-30', amount: 28000000, status: 'paid' },
    { id: 'inv10', invoiceCode: 'INV-202603-087', customerName: 'Phạm Đức Hùng', date: '2026-03-29', amount: 5600000, status: 'overdue' },
  ],
}

// ─── Occupancy Report Mock ─────────────────────────────────────

export const mockOccupancyReport: OccupancyReport = {
  filter: {
    dateFrom: '2026-01-01',
    dateTo: '2026-04-30',
    granularity: 'month',
  },
  summary: {
    avgOccupancyRate: 76.5,
    avgOccupiedSpaces: 83,
    totalSpaces: 109,
    peakRate: 94.5,
    peakDate: '2026-03-15',
    offPeakRate: 51.2,
    offPeakDate: '2026-01-03',
    rateChange: 3.2,
  },
  byPeriod: [
    { period: '2026-01', label: 'T1/2026', occupancyRate: 70.2 },
    { period: '2026-02', label: 'T2/2026', occupancyRate: 74.8 },
    { period: '2026-03', label: 'T3/2026', occupancyRate: 81.3 },
    { period: '2026-04', label: 'T4/2026', occupancyRate: 79.7 },
  ],
  heatmap: (() => {
    const cells = []
    // Generate realistic heatmap: high Mon-Fri 9-17, lower evenings/weekends
    for (let day = 0; day < 7; day++) {
      for (let hour = 7; hour < 22; hour++) {
        const isWeekend = day >= 5
        const isPeak = hour >= 9 && hour <= 17
        const base = isWeekend ? 25 : isPeak ? 78 : 45
        const noise = Math.floor(Math.random() * 15) - 7
        cells.push({ dayOfWeek: day, hour, value: Math.min(100, Math.max(0, base + noise)) })
      }
    }
    return cells
  })(),
  bySpaceType: [
    { type: 'private_office', label: 'Văn phòng riêng', occupancyRate: 88.0, totalHoursBooked: 14256 },
    { type: 'meeting_room',   label: 'Phòng họp',        occupancyRate: 72.5, totalHoursBooked: 4320  },
    { type: 'fixed_desk',     label: 'Fixed Desk',        occupancyRate: 81.2, totalHoursBooked: 9744  },
    { type: 'hot_desk',       label: 'Hot Desk',          occupancyRate: 65.4, totalHoursBooked: 7848  },
    { type: 'event_space',    label: 'Event Space',       occupancyRate: 42.0, totalHoursBooked: 1008  },
    { type: 'virtual_office', label: 'Virtual Office',    occupancyRate: 100.0, totalHoursBooked: 2184 },
  ],
  byBuilding: [
    { buildingId: '1', buildingName: 'Cobi Building 1', occupancyRate: 82.1 },
    { buildingId: '2', buildingName: 'Cobi Building 2', occupancyRate: 70.3 },
  ],
  spaceRows: [
    { spaceId: 's1', spaceName: 'Private Office Suite A', buildingName: 'Cobi Building 1', type: 'private_office', typeLabel: 'VP riêng', occupancyRate: 95.0, totalHoursBooked: 1710, revenue: 128250000 },
    { spaceId: 's2', spaceName: 'Executive Suite B',       buildingName: 'Cobi Building 1', type: 'private_office', typeLabel: 'VP riêng', occupancyRate: 91.2, totalHoursBooked: 1642, revenue: 246300000 },
    { spaceId: 's3', spaceName: 'Fixed Desk Zone A',       buildingName: 'Cobi Building 1', type: 'fixed_desk',     typeLabel: 'Fixed Desk', occupancyRate: 87.5, totalHoursBooked: 1575, revenue: 63000000 },
    { spaceId: 's4', spaceName: 'Meeting Room Alpha',      buildingName: 'Cobi Building 1', type: 'meeting_room',   typeLabel: 'Phòng họp', occupancyRate: 78.3, totalHoursBooked: 1409, revenue: 42270000 },
    { spaceId: 's5', spaceName: 'Hot Desk Zone A',         buildingName: 'Cobi Building 1', type: 'hot_desk',       typeLabel: 'Hot Desk', occupancyRate: 72.1, totalHoursBooked: 1298, revenue: 38940000 },
    { spaceId: 's6', spaceName: 'Private Office C',        buildingName: 'Cobi Building 2', type: 'private_office', typeLabel: 'VP riêng', occupancyRate: 68.4, totalHoursBooked: 1231, revenue: 92325000 },
    { spaceId: 's7', spaceName: 'Event Hall',              buildingName: 'Cobi Building 2', type: 'event_space',    typeLabel: 'Event', occupancyRate: 42.0, totalHoursBooked: 756,  revenue: 75600000 },
    { spaceId: 's8', spaceName: 'Hot Desk Zone B',         buildingName: 'Cobi Building 2', type: 'hot_desk',       typeLabel: 'Hot Desk', occupancyRate: 38.5, totalHoursBooked: 693, revenue: 20790000 },
  ],
}

// ─── Customer Analytics Mock ───────────────────────────────────

export const mockCustomerReport: CustomerAnalyticsReport = {
  filter: {
    dateFrom: '2026-01-01',
    dateTo: '2026-04-30',
    granularity: 'month',
  },
  summary: {
    totalCustomers: 198,
    newCustomers: 34,
    newCustomersChange: 13.3,
    activeCustomers: 142,
    churnedCustomers: 8,
    retentionRate: 87.5,
    retentionRateChange: 2.1,
    avgClv: 28500000,
  },
  acquisitionTrend: [
    { period: '2026-01', label: 'T1/2026', newCustomers: 7,  churnedCustomers: 3, retentionRate: 85.2 },
    { period: '2026-02', label: 'T2/2026', newCustomers: 9,  churnedCustomers: 2, retentionRate: 86.8 },
    { period: '2026-03', label: 'T3/2026', newCustomers: 12, churnedCustomers: 1, retentionRate: 88.3 },
    { period: '2026-04', label: 'T4/2026', newCustomers: 6,  churnedCustomers: 2, retentionRate: 87.5 },
  ],
  byType: [
    { type: 'enterprise', label: 'Doanh nghiệp', count: 68,  revenue: 1372000000, percent: 80 },
    { type: 'individual', label: 'Cá nhân',       count: 130, revenue: 343000000,  percent: 20 },
  ],
  clvDistribution: [
    { label: '< 5M',   count: 72 },
    { label: '5–20M',  count: 68 },
    { label: '20–50M', count: 42 },
    { label: '> 50M',  count: 16 },
  ],
  topCustomers: [
    { customerId: 'c1', name: 'Công ty ABC Technology',  type: 'enterprise', totalSpend: 285000000, bookingCount: 12, contractCount: 2, memberSince: '2024-03-01' },
    { customerId: 'c2', name: 'BlueOcean Ltd',            type: 'enterprise', totalSpend: 210000000, bookingCount: 8,  contractCount: 3, memberSince: '2024-01-15' },
    { customerId: 'c3', name: 'StartupXYZ',               type: 'enterprise', totalSpend: 182000000, bookingCount: 24, contractCount: 1, memberSince: '2024-06-10' },
    { customerId: 'c4', name: 'GreenTech Solutions',      type: 'enterprise', totalSpend: 156000000, bookingCount: 6,  contractCount: 2, memberSince: '2023-11-20' },
    { customerId: 'c5', name: 'DEF Corporation',          type: 'enterprise', totalSpend: 143000000, bookingCount: 5,  contractCount: 1, memberSince: '2024-08-05' },
    { customerId: 'c6', name: 'Nguyễn Văn An',           type: 'individual', totalSpend: 42000000,  bookingCount: 35, contractCount: 0, memberSince: '2024-02-14' },
    { customerId: 'c7', name: 'Trần Thị Bích',           type: 'individual', totalSpend: 38500000,  bookingCount: 28, contractCount: 0, memberSince: '2024-04-20' },
    { customerId: 'c8', name: 'Lê Minh Tú',              type: 'individual', totalSpend: 35200000,  bookingCount: 32, contractCount: 0, memberSince: '2024-07-01' },
    { customerId: 'c9', name: 'Phạm Đức Hùng',           type: 'individual', totalSpend: 28900000,  bookingCount: 22, contractCount: 0, memberSince: '2025-01-10' },
    { customerId: 'c10', name: 'Alpha Ventures',          type: 'enterprise', totalSpend: 125000000, bookingCount: 15, contractCount: 1, memberSince: '2025-03-01' },
  ],
}

// ─── Service Usage Mock ────────────────────────────────────────

export const mockServiceReport: ServiceUsageReport = {
  filter: {
    dateFrom: '2026-01-01',
    dateTo: '2026-04-30',
    granularity: 'month',
  },
  summary: {
    totalServiceRevenue: 142000000,
    totalUsageCount: 1840,
    activeServiceCount: 8,
  },
  services: [
    { serviceId: 'sv1', serviceName: 'Cà phê & Đồ uống',   usageCount: 620, revenue: 37200000,  revenuePercent: 26.2, change: 15.3 },
    { serviceId: 'sv2', serviceName: 'In ấn & Photocopy',   usageCount: 480, revenue: 19200000,  revenuePercent: 13.5, change: 8.7  },
    { serviceId: 'sv3', serviceName: 'Phòng họp theo giờ',  usageCount: 310, revenue: 46500000,  revenuePercent: 32.7, change: 22.1 },
    { serviceId: 'sv4', serviceName: 'Gửi xe (tháng)',      usageCount: 145, revenue: 14500000,  revenuePercent: 10.2, change: 5.0  },
    { serviceId: 'sv5', serviceName: 'Tủ khóa có khóa',    usageCount: 120, revenue: 6000000,   revenuePercent: 4.2,  change: -3.2 },
    { serviceId: 'sv6', serviceName: 'Nhận & Gửi bưu kiện', usageCount: 98,  revenue: 4900000,   revenuePercent: 3.5,  change: 12.0 },
    { serviceId: 'sv7', serviceName: 'Scan tài liệu',       usageCount: 45,  revenue: 2250000,   revenuePercent: 1.6,  change: -8.0 },
    { serviceId: 'sv8', serviceName: 'Dịch vụ lễ tân',      usageCount: 22,  revenue: 11000000,  revenuePercent: 7.7,  change: 45.0 },
  ],
  top5: [],         // populated below
  trendTop3: [
    { period: '2026-01', label: 'T1/2026', services: [{ name: 'Phòng họp', count: 68 }, { name: 'Cà phê', count: 140 }, { name: 'In ấn', count: 108 }] },
    { period: '2026-02', label: 'T2/2026', services: [{ name: 'Phòng họp', count: 75 }, { name: 'Cà phê', count: 148 }, { name: 'In ấn', count: 115 }] },
    { period: '2026-03', label: 'T3/2026', services: [{ name: 'Phòng họp', count: 88 }, { name: 'Cà phê', count: 162 }, { name: 'In ấn', count: 128 }] },
    { period: '2026-04', label: 'T4/2026', services: [{ name: 'Phòng họp', count: 79 }, { name: 'Cà phê', count: 170 }, { name: 'In ấn', count: 129 }] },
  ],
}
// Sort by revenue and take top 5
mockServiceReport.top5 = [...mockServiceReport.services]
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5)

// ─── Asset Report Mock ─────────────────────────────────────────

export const mockAssetReport: AssetReport = {
  filter: { dateFrom: '2026-01-01', dateTo: '2026-04-30' },
  summary: {
    totalAssets: 8,
    activeAssets: 5,
    maintenanceAssets: 1,
    brokenAssets: 1,
    retiredAssets: 0,
    totalMaintenanceCost: 12500000,
    maintenanceCostChange: -8.3,
  },
  byCategory: [
    { category: 'it_equipment',     label: 'IT Equipment',    count: 3, totalValue: 72000000,  maintenanceCost: 5000000 },
    { category: 'appliance',        label: 'Thiết bị điện',  count: 2, totalValue: 55000000,  maintenanceCost: 4500000 },
    { category: 'furniture',        label: 'Nội thất',       count: 2, totalValue: 28000000,  maintenanceCost: 1500000 },
    { category: 'office_equipment', label: 'Văn phòng',      count: 1, totalValue: 8000000,   maintenanceCost: 1500000 },
  ],
  statusDistribution: [
    { status: 'active',      label: 'Đang dùng',  count: 4 },
    { status: 'available',   label: 'Sẵn sàng',   count: 1 },
    { status: 'maintenance', label: 'Bảo trì',    count: 1 },
    { status: 'broken',      label: 'Hỏng',       count: 1 },
    { status: 'retired',     label: 'Thanh lý',   count: 0 },
  ],
  maintenanceCostByPeriod: [
    { period: '2026-01', label: 'T1/2026', cost: 3200000, completedCount: 2 },
    { period: '2026-02', label: 'T2/2026', cost: 2800000, completedCount: 1 },
    { period: '2026-03', label: 'T3/2026', cost: 3800000, completedCount: 2 },
    { period: '2026-04', label: 'T4/2026', cost: 2700000, completedCount: 1 },
  ],
  attentionAssets: [
    { assetId: 'a2', assetCode: 'AST-002', name: 'Điều hòa Daikin 18000BTU', category: 'Thiết bị điện', status: 'broken',      buildingName: 'Cobi Building 1', spaceName: 'Meeting Room Alpha', actionNeeded: 'Cần sửa chữa gấp' },
    { assetId: 'a5', assetCode: 'AST-005', name: 'Máy chiếu Epson EB-X51',   category: 'IT Equipment',  status: 'maintenance', buildingName: 'Cobi Building 2', spaceName: 'Event Hall',         actionNeeded: 'Đang bảo trì' },
    { assetId: 'a7', assetCode: 'AST-007', name: 'UPS APC Smart-UPS 1500',    category: 'IT Equipment',  status: 'available',   buildingName: 'Cobi Building 1',                                  actionNeeded: 'Lên lịch kiểm tra định kỳ (7 ngày tới)' },
  ],
  depreciation: [
    { assetId: 'a1', assetCode: 'AST-001', name: 'Dell Monitor 24"',          purchaseDate: '2022-01-15', purchaseCost: 8500000,  ageYears: 4.2, currentValue: 850000,  depreciationPercent: 90 },
    { assetId: 'a2', assetCode: 'AST-002', name: 'Điều hòa Daikin 18000BTU', purchaseDate: '2023-03-10', purchaseCost: 22000000, ageYears: 3.1, currentValue: 8360000, depreciationPercent: 62 },
    { assetId: 'a3', assetCode: 'AST-003', name: 'Bàn họp 12 chỗ',           purchaseDate: '2023-06-01', purchaseCost: 18000000, ageYears: 2.9, currentValue: 7560000, depreciationPercent: 58 },
    { assetId: 'a4', assetCode: 'AST-004', name: 'Ghế công thái học Ergon',   purchaseDate: '2024-02-20', purchaseCost: 5500000,  ageYears: 2.2, currentValue: 3080000, depreciationPercent: 44 },
    { assetId: 'a5', assetCode: 'AST-005', name: 'Máy chiếu Epson EB-X51',    purchaseDate: '2024-08-01', purchaseCost: 15000000, ageYears: 1.7, currentValue: 9900000, depreciationPercent: 34 },
    { assetId: 'a6', assetCode: 'AST-006', name: 'Bộ loa JBL MK10',           purchaseDate: '2025-01-10', purchaseCost: 12000000, ageYears: 1.3, currentValue: 9120000, depreciationPercent: 24 },
    { assetId: 'a7', assetCode: 'AST-007', name: 'UPS APC Smart-UPS 1500',    purchaseDate: '2025-06-15', purchaseCost: 8000000,  ageYears: 0.8, currentValue: 6720000, depreciationPercent: 16 },
    { assetId: 'a8', assetCode: 'AST-008', name: 'Máy pha cà phê DeLonghi',   purchaseDate: '2026-01-05', purchaseCost: 9500000,  ageYears: 0.3, currentValue: 9215000, depreciationPercent: 6  },
  ],
}

// ─── Mock API ──────────────────────────────────────────────────

export const mockReportAPI = {
  getRevenueReport: async (_filter: Partial<ReportFilter>): Promise<RevenueReport> => {
    await mockDelay()
    return mockRevenueReport
  },
  getOccupancyReport: async (_filter: Partial<ReportFilter>): Promise<OccupancyReport> => {
    await mockDelay()
    return mockOccupancyReport
  },
  getCustomerReport: async (_filter: Partial<ReportFilter>): Promise<CustomerAnalyticsReport> => {
    await mockDelay()
    return mockCustomerReport
  },
  getServiceReport: async (_filter: Partial<ReportFilter>): Promise<ServiceUsageReport> => {
    await mockDelay()
    return mockServiceReport
  },
  getAssetReport: async (_filter: Partial<{ buildingId: string; category: string; dateFrom: string; dateTo: string }>): Promise<AssetReport> => {
    await mockDelay()
    return mockAssetReport
  },
}
