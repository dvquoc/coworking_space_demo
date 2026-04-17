// ========== COMMON TYPES ==========

export interface KPI {
  value: number
  change?: number  // % change vs last period
  label?: string
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

// ========== INVESTOR DASHBOARD ==========

export interface InvestorDashboardData {
  kpis: {
    totalRevenue: number
    revenueChangePercent: number
    occupancyRate: number
    occupancyChange: number
    activeCustomers: number
    customersChange: number
    profitMargin: number
    profitMarginChange: number
  }
  charts: {
    revenueByMonth: Array<{ month: string; amount: number }>
    occupancyByBuilding: Array<{ buildingId: string; name: string; rate: number }>
    revenueBySpaceType: Array<{ type: string; label: string; amount: number; percent: number }>
  }
  period: { month: number; year: number }
}

// ========== ADMIN DASHBOARD ==========

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  ipAddress: string
  result: 'success' | 'failed'
}

export interface SystemAlert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
}

export interface ApprovalRequest {
  id: string
  type: 'new_user' | 'role_change' | 'delete_account'
  requesterName: string
  requestedRole?: string
  requestedAt: string
}

export interface AdminDashboardData {
  kpis: {
    totalUsers: number
    activeSessions: number
    systemUptime: number
    pendingApprovals: number
  }
  recentActivities: AuditLogEntry[]
  systemAlerts: SystemAlert[]
  loginStats: Array<{ date: string; success: number; failed: number }>
  pendingItems: ApprovalRequest[]
}

// ========== MANAGER DASHBOARD ==========

export interface UpcomingBooking {
  id: string
  startTime: string
  endTime: string
  customerName: string
  spaceName: string
  status: 'confirmed' | 'pending'
}

export interface ExpiringContract {
  id: string
  customerName: string
  spaceName: string
  expiryDate: string
  daysRemaining: number
}

export interface CustomerInquiry {
  id: string
  customerName: string
  type: string
  createdAt: string
  status: 'pending' | 'in_progress' | 'resolved'
}

export interface ManagerDashboardData {
  kpis: {
    todayBookings: number
    checkInsToday: number
    checkOutsToday: number
    pendingRequests: number
  }
  charts: {
    bookingByDay: Array<{ date: string; count: number }>
    utilizationByFloor: Array<{ floorId: string; floorLabel: string; buildingName: string; rate: number }>
  }
  topCustomers: Array<{ rank: number; customerId: string; name: string; spaceType: string; revenue: number }>
  upcomingBookings: UpcomingBooking[]
  expiringContracts: ExpiringContract[]
  recentInquiries: CustomerInquiry[]
}

// ========== MAINTENANCE DASHBOARD ==========

export interface MaintenanceTask {
  id: string
  name: string
  location: string
  deadline: string
  status: 'overdue' | 'pending' | 'in_progress'
  priority: 'critical' | 'normal'
}

export interface MaintenanceLog {
  id: string
  timestamp: string
  assetName: string
  description: string
  performedBy: string
  result: 'completed' | 'pending' | 'failed'
}

export interface BrokenAsset {
  id: string
  name: string
  location: string
  detectedAt: string
  severity: 'critical' | 'normal'
}

export interface MaintenanceDashboardData {
  kpis: {
    totalAssets: number
    assetsInMaintenance: number
    brokenAssets: number
    scheduledTasksThisWeek: number
  }
  tasks: MaintenanceTask[]
  assetsByStatus: Array<{ status: string; label: string; count: number; percent: number }>
  recentLogs: MaintenanceLog[]
  brokenAssetList: BrokenAsset[]
}

// ========== ACCOUNTING DASHBOARD ==========

export interface RecentPayment {
  id: string
  paidAt: string
  invoiceCode: string
  customerName: string
  amount: number
  method: 'cash' | 'bank_transfer' | 'card'
  status: 'completed' | 'pending' | 'failed'
}

export interface OverdueInvoice {
  id: string
  code: string
  customerName: string
  amount: number
  dueDate: string
  daysOverdue: number
}

export interface UpcomingBilling {
  customerId: string
  customerName: string
  serviceName: string
  billingCycle: 'monthly' | 'quarterly' | 'yearly'
  billingDate: string
  estimatedAmount: number
}

export interface AccountingDashboardData {
  kpis: {
    invoicesIssuedCount: number
    invoicesIssuedChange: number
    totalReceivable: number
    overdueCount: number
    overdueAmount: number
    collectionRate: number
    collectionRateChange: number
  }
  charts: {
    revenueByMonth: Array<{ month: string; actual: number; target: number }>
    invoiceStatusBreakdown: Array<{ status: string; label: string; count: number; amount: number; percent: number }>
    arAging: Array<{ bucket: string; label: string; amount: number }>
  }
  recentPayments: RecentPayment[]
  overdueInvoices: OverdueInvoice[]
  upcomingBillings: UpcomingBilling[]
}

// ========== SALES DASHBOARD ==========

export interface Lead {
  id: string
  name: string
  company?: string
  source: 'website' | 'referral' | 'ads' | 'walk_in' | 'event'
  status: 'new' | 'contacted' | 'tour_scheduled' | 'proposal_sent' | 'closed_won' | 'closed_lost'
  createdAt: string
  lastContactedAt?: string
  isStale: boolean
}

export interface SalesActivity {
  id: string
  scheduledAt: string
  leadName: string
  type: 'tour' | 'meeting' | 'call'
  location?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface RecentDeal {
  id: string
  customerName: string
  spaceName: string
  contractValue: number
  closedAt: string
}

export interface SalesDashboardData {
  kpis: {
    activeLeads: number
    conversionRate: number
    conversionRateChange: number
    newCustomers: number
    newCustomersChange: number
    monthlyTarget: number
    monthlyAchieved: number
    targetPercent: number
  }
  charts: {
    leadFunnel: Array<{ stage: string; label: string; count: number; percent: number }>
    conversionByMonth: Array<{ month: string; closedWon: number; rate: number }>
    leadSourceBreakdown: Array<{ source: string; label: string; count: number; percent: number }>
  }
  myLeads: Lead[]
  upcomingActivities: SalesActivity[]
  recentDeals: RecentDeal[]
}
