import type {
  InvestorDashboardData,
  AdminDashboardData,
  ManagerDashboardData,
  MaintenanceDashboardData,
  AccountingDashboardData,
  SalesDashboardData,
} from '../types/dashboard'

// ========== INVESTOR DASHBOARD MOCK ==========

export const investorDashboardMock: InvestorDashboardData = {
  kpis: {
    totalRevenue: 450000000,
    revenueChangePercent: 12.5,
    occupancyRate: 78.0,
    occupancyChange: 3.2,
    activeCustomers: 142,
    customersChange: 8,
    profitMargin: 28.0,
    profitMarginChange: -1.5,
  },
  charts: {
    revenueByMonth: [
      { month: '2025-05', amount: 320000000 },
      { month: '2025-06', amount: 335000000 },
      { month: '2025-07', amount: 340000000 },
      { month: '2025-08', amount: 358000000 },
      { month: '2025-09', amount: 375000000 },
      { month: '2025-10', amount: 380000000 },
      { month: '2025-11', amount: 395000000 },
      { month: '2025-12', amount: 420000000 },
      { month: '2026-01', amount: 410000000 },
      { month: '2026-02', amount: 425000000 },
      { month: '2026-03', amount: 440000000 },
      { month: '2026-04', amount: 450000000 },
    ],
    occupancyByBuilding: [
      { buildingId: 'b1', name: 'Cobi Tower A', rate: 82.0 },
      { buildingId: 'b2', name: 'Cobi Tower B', rate: 74.0 },
    ],
    revenueBySpaceType: [
      { type: 'hot_desk', label: 'Hot Desk', amount: 67500000, percent: 15.0 },
      { type: 'fixed_desk', label: 'Fixed Desk', amount: 90000000, percent: 20.0 },
      { type: 'private_office', label: 'Văn phòng riêng', amount: 180000000, percent: 40.0 },
      { type: 'meeting_room', label: 'Phòng họp', amount: 45000000, percent: 10.0 },
      { type: 'event_space', label: 'Event Space', amount: 36000000, percent: 8.0 },
      { type: 'virtual_office', label: 'Virtual Office', amount: 31500000, percent: 7.0 },
    ],
  },
  period: { month: 4, year: 2026 },
}

// ========== ADMIN DASHBOARD MOCK ==========

export const adminDashboardMock: AdminDashboardData = {
  kpis: {
    totalUsers: 45,
    activeSessions: 12,
    systemUptime: 99.8,
    pendingApprovals: 3,
  },
  recentActivities: [
    { id: 'act1', timestamp: '2026-04-17T08:30:00Z', userId: 'u1', userName: 'manager@cobi.vn', action: 'LOGIN', ipAddress: '192.168.1.10', result: 'success' },
    { id: 'act2', timestamp: '2026-04-17T08:25:00Z', userId: 'u2', userName: 'sale@cobi.vn', action: 'LOGIN', ipAddress: '192.168.1.15', result: 'success' },
    { id: 'act3', timestamp: '2026-04-17T08:20:00Z', userId: 'u3', userName: 'unknown@test.com', action: 'LOGIN', ipAddress: '45.33.22.11', result: 'failed' },
    { id: 'act4', timestamp: '2026-04-17T08:15:00Z', userId: 'u4', userName: 'accounting@cobi.vn', action: 'CREATE_INVOICE', ipAddress: '192.168.1.20', result: 'success' },
    { id: 'act5', timestamp: '2026-04-17T08:10:00Z', userId: 'u5', userName: 'maintenance@cobi.vn', action: 'UPDATE_ASSET', ipAddress: '192.168.1.25', result: 'success' },
    { id: 'act6', timestamp: '2026-04-17T08:05:00Z', userId: 'u1', userName: 'manager@cobi.vn', action: 'CREATE_BOOKING', ipAddress: '192.168.1.10', result: 'success' },
    { id: 'act7', timestamp: '2026-04-17T08:00:00Z', userId: 'u6', userName: 'investor@cobi.vn', action: 'LOGIN', ipAddress: '192.168.1.30', result: 'success' },
    { id: 'act8', timestamp: '2026-04-16T17:45:00Z', userId: 'u2', userName: 'sale@cobi.vn', action: 'UPDATE_LEAD', ipAddress: '192.168.1.15', result: 'success' },
  ],
  systemAlerts: [
    { id: 'alert1', severity: 'warning', message: 'Disk usage at 85% on server-01', timestamp: '2026-04-17T06:00:00Z' },
    { id: 'alert2', severity: 'info', message: 'SSL certificate expires in 30 days', timestamp: '2026-04-16T10:00:00Z' },
  ],
  loginStats: [
    { date: '2026-04-11', success: 28, failed: 2 },
    { date: '2026-04-12', success: 32, failed: 1 },
    { date: '2026-04-13', success: 25, failed: 3 },
    { date: '2026-04-14', success: 30, failed: 0 },
    { date: '2026-04-15', success: 35, failed: 2 },
    { date: '2026-04-16', success: 29, failed: 15 },
    { date: '2026-04-17', success: 12, failed: 1 },
  ],
  pendingItems: [
    { id: 'apr1', type: 'new_user', requesterName: 'Nguyễn Văn A', requestedRole: 'manager', requestedAt: '2026-04-16T14:00:00Z' },
    { id: 'apr2', type: 'role_change', requesterName: 'Trần Thị B', requestedRole: 'accountant', requestedAt: '2026-04-15T10:00:00Z' },
    { id: 'apr3', type: 'new_user', requesterName: 'Lê Văn C', requestedRole: 'sale', requestedAt: '2026-04-14T16:30:00Z' },
  ],
}

// ========== MANAGER DASHBOARD MOCK ==========

export const managerDashboardMock: ManagerDashboardData = {
  kpis: {
    todayBookings: 18,
    checkInsToday: 12,
    checkOutsToday: 5,
    pendingRequests: 7,
  },
  charts: {
    bookingByDay: [
      { date: '2026-04-11', count: 14 },
      { date: '2026-04-12', count: 16 },
      { date: '2026-04-13', count: 12 },
      { date: '2026-04-14', count: 20 },
      { date: '2026-04-15', count: 22 },
      { date: '2026-04-16', count: 15 },
      { date: '2026-04-17', count: 18 },
    ],
    utilizationByFloor: [
      { floorId: 'f1', floorLabel: 'Tầng 1', buildingName: 'Cobi Tower A', rate: 85.0 },
      { floorId: 'f2', floorLabel: 'Tầng 2', buildingName: 'Cobi Tower A', rate: 72.0 },
      { floorId: 'f3', floorLabel: 'Tầng 3', buildingName: 'Cobi Tower A', rate: 90.0 },
      { floorId: 'f4', floorLabel: 'Tầng B1', buildingName: 'Cobi Tower A', rate: 30.0 },
      { floorId: 'f5', floorLabel: 'Tầng 1', buildingName: 'Cobi Tower B', rate: 78.0 },
      { floorId: 'f6', floorLabel: 'Tầng 2', buildingName: 'Cobi Tower B', rate: 65.0 },
    ],
  },
  topCustomers: [
    { rank: 1, customerId: 'c1', name: 'Công ty ABC Tech', spaceType: 'private_office', revenue: 45000000 },
    { rank: 2, customerId: 'c2', name: 'Startup XYZ', spaceType: 'fixed_desk', revenue: 32000000 },
    { rank: 3, customerId: 'c3', name: 'Agency Creative', spaceType: 'private_office', revenue: 28000000 },
    { rank: 4, customerId: 'c4', name: 'Freelancer Hub', spaceType: 'hot_desk', revenue: 18000000 },
    { rank: 5, customerId: 'c5', name: 'Consulting Pro', spaceType: 'meeting_room', revenue: 15000000 },
  ],
  upcomingBookings: [
    { id: 'bk1', startTime: '2026-04-17T09:00:00+07:00', endTime: '2026-04-17T17:00:00+07:00', customerName: 'Nguyễn Anh', spaceName: 'Office 201', status: 'confirmed' },
    { id: 'bk2', startTime: '2026-04-17T10:00:00+07:00', endTime: '2026-04-17T12:00:00+07:00', customerName: 'Trần Minh', spaceName: 'Meeting Room A', status: 'pending' },
    { id: 'bk3', startTime: '2026-04-17T14:00:00+07:00', endTime: '2026-04-17T16:00:00+07:00', customerName: 'Lê Hương', spaceName: 'Hot Desk Zone', status: 'confirmed' },
    { id: 'bk4', startTime: '2026-04-18T09:00:00+07:00', endTime: '2026-04-18T18:00:00+07:00', customerName: 'Công ty DEF', spaceName: 'Office 305', status: 'confirmed' },
    { id: 'bk5', startTime: '2026-04-19T08:00:00+07:00', endTime: '2026-04-19T12:00:00+07:00', customerName: 'Workshop Team', spaceName: 'Event Space', status: 'pending' },
  ],
  expiringContracts: [
    { id: 'ct1', customerName: 'Công ty XYZ', spaceName: 'Office 302', expiryDate: '2026-04-24', daysRemaining: 7 },
    { id: 'ct2', customerName: 'Startup ABC', spaceName: 'Fixed Desk 12', expiryDate: '2026-04-20', daysRemaining: 3 },
    { id: 'ct3', customerName: 'Agency Plus', spaceName: 'Office 401', expiryDate: '2026-05-10', daysRemaining: 23 },
  ],
  recentInquiries: [
    { id: 'inq1', customerName: 'Trần Thị B', type: 'service_request', createdAt: '2026-04-17T08:00:00+07:00', status: 'pending' },
    { id: 'inq2', customerName: 'Nguyễn C', type: 'complaint', createdAt: '2026-04-16T15:30:00+07:00', status: 'in_progress' },
    { id: 'inq3', customerName: 'Lê D', type: 'info_request', createdAt: '2026-04-16T10:00:00+07:00', status: 'resolved' },
  ],
}

// ========== MAINTENANCE DASHBOARD MOCK ==========

export const maintenanceDashboardMock: MaintenanceDashboardData = {
  kpis: {
    totalAssets: 342,
    assetsInMaintenance: 8,
    brokenAssets: 3,
    scheduledTasksThisWeek: 12,
  },
  tasks: [
    { id: 'task1', name: 'Sửa điều hòa Phòng 205', location: 'Tầng 2 - Cobi Tower A - Phòng 205', deadline: '2026-04-16', status: 'overdue', priority: 'critical' },
    { id: 'task2', name: 'Kiểm tra bình chữa cháy', location: 'Tầng 1 - Cobi Tower A', deadline: '2026-04-17', status: 'pending', priority: 'normal' },
    { id: 'task3', name: 'Vệ sinh Meeting Room A', location: 'Tầng 3 - Cobi Tower A', deadline: '2026-04-18', status: 'pending', priority: 'normal' },
    { id: 'task4', name: 'Thay bóng đèn hành lang', location: 'Tầng B1 - Cobi Tower B', deadline: '2026-04-19', status: 'pending', priority: 'normal' },
    { id: 'task5', name: 'Bảo trì thang máy', location: 'Cobi Tower A', deadline: '2026-04-15', status: 'overdue', priority: 'critical' },
  ],
  assetsByStatus: [
    { status: 'active', label: 'Hoạt động', count: 325, percent: 95.0 },
    { status: 'in_maintenance', label: 'Đang bảo trì', count: 8, percent: 2.3 },
    { status: 'broken', label: 'Hỏng', count: 3, percent: 0.9 },
    { status: 'retired', label: 'Ngừng sử dụng', count: 6, percent: 1.8 },
  ],
  recentLogs: [
    { id: 'log1', timestamp: '2026-04-16T15:30:00+07:00', assetName: 'Máy lạnh PK-205', description: 'Thay lọc gió', performedBy: 'Trần Văn C', result: 'completed' },
    { id: 'log2', timestamp: '2026-04-16T10:00:00+07:00', assetName: 'Máy in HP-301', description: 'Thay mực in', performedBy: 'Nguyễn D', result: 'completed' },
    { id: 'log3', timestamp: '2026-04-15T14:00:00+07:00', assetName: 'Projector MR-A', description: 'Vệ sinh lens', performedBy: 'Trần Văn C', result: 'completed' },
  ],
  brokenAssetList: [
    { id: 'ast1', name: 'Máy chiếu MR-A101', location: 'Tầng 1 - Meeting Room A', detectedAt: '2026-04-15T09:00:00+07:00', severity: 'critical' },
    { id: 'ast2', name: 'Máy in HP-Floor2', location: 'Tầng 2 - Khu vực chung', detectedAt: '2026-04-16T11:00:00+07:00', severity: 'normal' },
    { id: 'ast3', name: 'Điều hòa AC-305', location: 'Tầng 3 - Office 305', detectedAt: '2026-04-17T08:00:00+07:00', severity: 'critical' },
  ],
}

// ========== ACCOUNTING DASHBOARD MOCK ==========

export const accountingDashboardMock: AccountingDashboardData = {
  kpis: {
    invoicesIssuedCount: 156,
    invoicesIssuedChange: 8.3,
    totalReceivable: 85000000,
    overdueCount: 12,
    overdueAmount: 8500000,
    collectionRate: 92.0,
    collectionRateChange: -2.1,
  },
  charts: {
    revenueByMonth: [
      { month: '2025-11', actual: 380000000, target: 400000000 },
      { month: '2025-12', actual: 420000000, target: 400000000 },
      { month: '2026-01', actual: 410000000, target: 420000000 },
      { month: '2026-02', actual: 425000000, target: 420000000 },
      { month: '2026-03', actual: 440000000, target: 430000000 },
      { month: '2026-04', actual: 450000000, target: 420000000 },
    ],
    invoiceStatusBreakdown: [
      { status: 'paid', label: 'Đã thanh toán', count: 132, amount: 396000000, percent: 84.6 },
      { status: 'pending', label: 'Chờ thanh toán', count: 12, amount: 36000000, percent: 7.7 },
      { status: 'overdue', label: 'Quá hạn', count: 12, amount: 8500000, percent: 7.7 },
    ],
    arAging: [
      { bucket: '0-30', label: '0-30 ngày', amount: 36000000 },
      { bucket: '31-60', label: '31-60 ngày', amount: 12000000 },
      { bucket: '61-90', label: '61-90 ngày', amount: 5000000 },
      { bucket: '90+', label: '> 90 ngày', amount: 3000000 },
    ],
  },
  recentPayments: [
    { id: 'pmt1', paidAt: '2026-04-17T09:30:00+07:00', invoiceCode: 'INV-1125', customerName: 'Công ty ABC', amount: 15000000, method: 'bank_transfer', status: 'completed' },
    { id: 'pmt2', paidAt: '2026-04-17T08:15:00+07:00', invoiceCode: 'INV-1124', customerName: 'Startup XYZ', amount: 8500000, method: 'bank_transfer', status: 'completed' },
    { id: 'pmt3', paidAt: '2026-04-16T16:00:00+07:00', invoiceCode: 'INV-1120', customerName: 'Agency Plus', amount: 22000000, method: 'card', status: 'completed' },
    { id: 'pmt4', paidAt: '2026-04-16T14:30:00+07:00', invoiceCode: 'INV-1118', customerName: 'Freelancer A', amount: 3500000, method: 'cash', status: 'completed' },
    { id: 'pmt5', paidAt: '2026-04-16T10:00:00+07:00', invoiceCode: 'INV-1115', customerName: 'Company DEF', amount: 18000000, method: 'bank_transfer', status: 'pending' },
  ],
  overdueInvoices: [
    { id: 'inv1', code: 'INV-1024', customerName: 'Công ty ABC', amount: 2500000, dueDate: '2026-04-02', daysOverdue: 15 },
    { id: 'inv2', code: 'INV-1031', customerName: 'Company XYZ', amount: 1200000, dueDate: '2026-04-09', daysOverdue: 8 },
    { id: 'inv3', code: 'INV-1018', customerName: 'Startup OLD', amount: 4800000, dueDate: '2026-03-15', daysOverdue: 33 },
  ],
  upcomingBillings: [
    { customerId: 'c1', customerName: 'Công ty XYZ', serviceName: 'Office 302 - Tháng 5', billingCycle: 'monthly', billingDate: '2026-04-20', estimatedAmount: 18000000 },
    { customerId: 'c2', customerName: 'Startup ABC', serviceName: 'Fixed Desk - Tháng 5', billingCycle: 'monthly', billingDate: '2026-04-22', estimatedAmount: 5500000 },
    { customerId: 'c3', customerName: 'Agency Creative', serviceName: 'Office 401 - Q2', billingCycle: 'quarterly', billingDate: '2026-04-25', estimatedAmount: 75000000 },
  ],
}

// ========== SALES DASHBOARD MOCK ==========

export const salesDashboardMock: SalesDashboardData = {
  kpis: {
    activeLeads: 45,
    conversionRate: 18.0,
    conversionRateChange: 2.5,
    newCustomers: 12,
    newCustomersChange: 3,
    monthlyTarget: 15,
    monthlyAchieved: 12,
    targetPercent: 80.0,
  },
  charts: {
    leadFunnel: [
      { stage: 'inquiry', label: 'Inquiry', count: 67, percent: 100 },
      { stage: 'contacted', label: 'Contacted', count: 52, percent: 77.6 },
      { stage: 'tour_scheduled', label: 'Tour Scheduled', count: 31, percent: 46.3 },
      { stage: 'proposal_sent', label: 'Proposal Sent', count: 18, percent: 26.9 },
      { stage: 'closed_won', label: 'Closed Won', count: 12, percent: 17.9 },
    ],
    conversionByMonth: [
      { month: '2025-11', closedWon: 9, rate: 15.0 },
      { month: '2025-12', closedWon: 11, rate: 16.5 },
      { month: '2026-01', closedWon: 10, rate: 15.8 },
      { month: '2026-02', closedWon: 13, rate: 18.2 },
      { month: '2026-03', closedWon: 14, rate: 17.5 },
      { month: '2026-04', closedWon: 12, rate: 18.0 },
    ],
    leadSourceBreakdown: [
      { source: 'website', label: 'Website', count: 28, percent: 41.8 },
      { source: 'referral', label: 'Giới thiệu', count: 20, percent: 29.9 },
      { source: 'ads', label: 'Quảng cáo', count: 12, percent: 17.9 },
      { source: 'walk_in', label: 'Ghé trực tiếp', count: 7, percent: 10.4 },
    ],
  },
  myLeads: [
    { id: 'lead1', name: 'Nguyễn Thành Đạt', company: 'Startup ABC', source: 'website', status: 'tour_scheduled', createdAt: '2026-04-10', lastContactedAt: '2026-04-15', isStale: false },
    { id: 'lead2', name: 'Trần Minh Hương', company: 'Agency XYZ', source: 'referral', status: 'proposal_sent', createdAt: '2026-04-05', lastContactedAt: '2026-04-16', isStale: false },
    { id: 'lead3', name: 'Lê Văn Nam', company: undefined, source: 'ads', status: 'contacted', createdAt: '2026-04-08', lastContactedAt: '2026-04-08', isStale: true },
    { id: 'lead4', name: 'Phạm Thị Lan', company: 'Tech Solutions', source: 'walk_in', status: 'new', createdAt: '2026-04-16', lastContactedAt: undefined, isStale: false },
    { id: 'lead5', name: 'Hoàng Anh Tuấn', company: 'Consulting Pro', source: 'website', status: 'contacted', createdAt: '2026-04-12', lastContactedAt: '2026-04-14', isStale: false },
  ],
  upcomingActivities: [
    { id: 'act1', scheduledAt: '2026-04-18T10:00:00+07:00', leadName: 'Nguyễn Thành Đạt', type: 'tour', location: 'Cobi Tower A - Tầng 3', status: 'scheduled' },
    { id: 'act2', scheduledAt: '2026-04-18T14:00:00+07:00', leadName: 'Trần Minh Hương', type: 'meeting', location: 'Meeting Room B', status: 'scheduled' },
    { id: 'act3', scheduledAt: '2026-04-19T09:00:00+07:00', leadName: 'Phạm Thị Lan', type: 'call', location: undefined, status: 'scheduled' },
    { id: 'act4', scheduledAt: '2026-04-20T15:00:00+07:00', leadName: 'Lê Văn Nam', type: 'tour', location: 'Cobi Tower B - Tầng 2', status: 'scheduled' },
  ],
  recentDeals: [
    { id: 'deal1', customerName: 'Startup ABC', spaceName: 'Office 305', contractValue: 18000000, closedAt: '2026-04-14' },
    { id: 'deal2', customerName: 'Agency Plus', spaceName: 'Fixed Desk Zone', contractValue: 8500000, closedAt: '2026-04-10' },
    { id: 'deal3', customerName: 'Freelancer Hub', spaceName: 'Hot Desk', contractValue: 3500000, closedAt: '2026-04-08' },
    { id: 'deal4', customerName: 'Tech Solutions', spaceName: 'Office 201', contractValue: 25000000, closedAt: '2026-04-05' },
    { id: 'deal5', customerName: 'Marketing Co', spaceName: 'Meeting Room Package', contractValue: 12000000, closedAt: '2026-04-02' },
  ],
}

// ========== API SIMULATION ==========

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockDashboardAPI = {
  getInvestorDashboard: async (): Promise<InvestorDashboardData> => {
    await delay(500)
    return investorDashboardMock
  },

  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    await delay(500)
    return adminDashboardMock
  },

  getManagerDashboard: async (): Promise<ManagerDashboardData> => {
    await delay(500)
    return managerDashboardMock
  },

  getMaintenanceDashboard: async (): Promise<MaintenanceDashboardData> => {
    await delay(500)
    return maintenanceDashboardMock
  },

  getAccountingDashboard: async (): Promise<AccountingDashboardData> => {
    await delay(500)
    return accountingDashboardMock
  },

  getSalesDashboard: async (): Promise<SalesDashboardData> => {
    await delay(500)
    return salesDashboardMock
  },
}
