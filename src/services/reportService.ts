import { api } from './api'
import type {
  RevenueReport,
  OccupancyReport,
  CustomerAnalyticsReport,
  ServiceUsageReport,
  AssetReport,
  ReportFilter,
} from '../types/report'

export const reportService = {
  getRevenueReport: async (filter: Partial<ReportFilter>): Promise<RevenueReport> => {
    const r = await api.get<RevenueReport>('/reports/revenue', { params: filter })
    return r.data
  },

  getOccupancyReport: async (filter: Partial<ReportFilter>): Promise<OccupancyReport> => {
    const r = await api.get<OccupancyReport>('/reports/occupancy', { params: filter })
    return r.data
  },

  getCustomerReport: async (filter: Partial<ReportFilter>): Promise<CustomerAnalyticsReport> => {
    const r = await api.get<CustomerAnalyticsReport>('/reports/customers', { params: filter })
    return r.data
  },

  getServiceReport: async (filter: Partial<ReportFilter>): Promise<ServiceUsageReport> => {
    const r = await api.get<ServiceUsageReport>('/reports/services', { params: filter })
    return r.data
  },

  getAssetReport: async (filter: Partial<{ buildingId: string; category: string; dateFrom: string; dateTo: string }>): Promise<AssetReport> => {
    const r = await api.get<AssetReport>('/reports/assets', { params: filter })
    return r.data
  },
}
