// ─── Shared ───────────────────────────────────────────────────

export type ReportGranularity = 'day' | 'week' | 'month' | 'quarter'
export type DatePreset = 'this_month' | 'this_quarter' | 'this_year' | 'last_6_months' | 'last_12_months' | 'custom'

export interface ReportFilter {
  dateFrom: string         // ISO date string YYYY-MM-DD
  dateTo: string
  buildingId?: string      // undefined = all buildings
  spaceType?: string       // undefined = all types
  granularity: ReportGranularity
}

export interface PeriodPoint {
  period: string           // "2026-04", "2026-W14", "2026-04-17"
  label: string            // display label
}

// ─── F-76 Revenue Report ──────────────────────────────────────

export interface RevenueReportSummary {
  totalRevenue: number
  revenueChange: number        // % vs previous period
  paidAmount: number
  unpaidAmount: number
  overdueAmount: number
  totalInvoices: number
}

export interface RevenueByPeriod {
  period: string
  label: string
  revenue: number
  invoiceCount: number
}

export interface RevenueByMethod {
  method: string
  label: string
  amount: number
  percent: number
}

export interface RevenueBySpaceType {
  type: string
  label: string
  amount: number
  percent: number
}

export interface RevenueByBuilding {
  buildingId: string
  buildingName: string
  revenue: number
  percent: number
  change: number             // % vs previous period
}

export interface RecentInvoice {
  id: string
  invoiceCode: string
  customerName: string
  date: string
  amount: number
  status: 'paid' | 'unpaid' | 'overdue' | 'partial' | 'cancelled'
}

export interface RevenueReport {
  filter: ReportFilter
  summary: RevenueReportSummary
  byPeriod: RevenueByPeriod[]
  byMethod: RevenueByMethod[]
  bySpaceType: RevenueBySpaceType[]
  byBuilding: RevenueByBuilding[]
  recentInvoices: RecentInvoice[]
}

// ─── F-77 Occupancy Analytics ─────────────────────────────────

export interface OccupancySummary {
  avgOccupancyRate: number       // %
  avgOccupiedSpaces: number
  totalSpaces: number
  peakRate: number               // %
  peakDate: string
  offPeakRate: number            // %
  offPeakDate: string
  rateChange: number             // pp vs previous period
}

export interface OccupancyByPeriod {
  period: string
  label: string
  occupancyRate: number
}

export interface OccupancyHeatmapCell {
  dayOfWeek: number              // 0 = Mon, 6 = Sun
  hour: number                   // 7-21
  value: number                  // avg occupancy % for that slot
}

export interface OccupancyByType {
  type: string
  label: string
  occupancyRate: number
  totalHoursBooked: number
}

export interface OccupancyByBuilding {
  buildingId: string
  buildingName: string
  occupancyRate: number
}

export interface OccupancySpaceRow {
  spaceId: string
  spaceName: string
  buildingName: string
  type: string
  typeLabel: string
  occupancyRate: number
  totalHoursBooked: number
  revenue: number
}

export interface OccupancyReport {
  filter: ReportFilter
  summary: OccupancySummary
  byPeriod: OccupancyByPeriod[]
  heatmap: OccupancyHeatmapCell[]
  bySpaceType: OccupancyByType[]
  byBuilding: OccupancyByBuilding[]
  spaceRows: OccupancySpaceRow[]
}

// ─── F-78 Customer Analytics ──────────────────────────────────

export interface CustomerAnalyticsSummary {
  totalCustomers: number
  newCustomers: number
  newCustomersChange: number     // % vs previous period
  activeCustomers: number
  churnedCustomers: number
  retentionRate: number          // %
  retentionRateChange: number    // pp
  avgClv: number                 // VND
}

export interface CustomerAcquisitionPoint {
  period: string
  label: string
  newCustomers: number
  churnedCustomers: number
  retentionRate: number
}

export interface CustomerByType {
  type: 'individual' | 'enterprise'
  label: string
  count: number
  revenue: number
  percent: number
}

export interface ClvBucket {
  label: string                  // "< 5M", "5–20M", "20–50M", "> 50M"
  count: number
}

export interface TopCustomerRow {
  customerId: string
  name: string
  type: 'individual' | 'enterprise'
  totalSpend: number
  bookingCount: number
  contractCount: number
  memberSince: string
}

export interface CustomerAnalyticsReport {
  filter: ReportFilter
  summary: CustomerAnalyticsSummary
  acquisitionTrend: CustomerAcquisitionPoint[]
  byType: CustomerByType[]
  clvDistribution: ClvBucket[]
  topCustomers: TopCustomerRow[]
}

// ─── F-79 Service Usage Report ────────────────────────────────

export interface ServiceUsageSummary {
  totalServiceRevenue: number
  totalUsageCount: number
  activeServiceCount: number
}

export interface ServiceRow {
  serviceId: string
  serviceName: string
  usageCount: number
  revenue: number
  revenuePercent: number
  change: number                 // % vs previous period
}

export interface ServiceTrendPoint {
  period: string
  label: string
  services: { name: string; count: number }[]
}

export interface ServiceUsageReport {
  filter: ReportFilter
  summary: ServiceUsageSummary
  services: ServiceRow[]
  top5: ServiceRow[]
  trendTop3: ServiceTrendPoint[]
}

// ─── F-80 Asset Report ────────────────────────────────────────

export interface AssetReportSummary {
  totalAssets: number
  activeAssets: number
  maintenanceAssets: number
  brokenAssets: number
  retiredAssets: number
  totalMaintenanceCost: number
  maintenanceCostChange: number  // % vs previous period
}

export interface AssetByCategory {
  category: string
  label: string
  count: number
  totalValue: number
  maintenanceCost: number
}

export interface MaintenanceCostByPeriod {
  period: string
  label: string
  cost: number
  completedCount: number
}

export interface AssetStatusDistribution {
  status: string
  label: string
  count: number
}

export interface AssetAttentionRow {
  assetId: string
  assetCode: string
  name: string
  category: string
  status: string
  buildingName: string
  spaceName?: string
  actionNeeded: string
}

export interface AssetDepreciationRow {
  assetId: string
  assetCode: string
  name: string
  purchaseDate: string
  purchaseCost: number
  ageYears: number
  currentValue: number
  depreciationPercent: number
}

export interface AssetReport {
  filter: { buildingId?: string; category?: string; dateFrom: string; dateTo: string }
  summary: AssetReportSummary
  byCategory: AssetByCategory[]
  statusDistribution: AssetStatusDistribution[]
  maintenanceCostByPeriod: MaintenanceCostByPeriod[]
  attentionAssets: AssetAttentionRow[]
  depreciation: AssetDepreciationRow[]
}
