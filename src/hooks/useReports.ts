import { useQuery } from '@tanstack/react-query'
import { mockReportAPI } from '../mocks/reportMocks'
import { reportService } from '../services/reportService'
import type {
  RevenueReport,
  OccupancyReport,
  CustomerAnalyticsReport,
  ServiceUsageReport,
  AssetReport,
  ReportFilter,
} from '../types/report'

const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

export function useRevenueReport(filter: Partial<ReportFilter>) {
  return useQuery<RevenueReport>({
    queryKey: ['report-revenue', filter],
    queryFn: () =>
      MOCK_API
        ? mockReportAPI.getRevenueReport(filter)
        : reportService.getRevenueReport(filter),
  })
}

export function useOccupancyReport(filter: Partial<ReportFilter>) {
  return useQuery<OccupancyReport>({
    queryKey: ['report-occupancy', filter],
    queryFn: () =>
      MOCK_API
        ? mockReportAPI.getOccupancyReport(filter)
        : reportService.getOccupancyReport(filter),
  })
}

export function useCustomerReport(filter: Partial<ReportFilter>) {
  return useQuery<CustomerAnalyticsReport>({
    queryKey: ['report-customers', filter],
    queryFn: () =>
      MOCK_API
        ? mockReportAPI.getCustomerReport(filter)
        : reportService.getCustomerReport(filter),
  })
}

export function useServiceReport(filter: Partial<ReportFilter>) {
  return useQuery<ServiceUsageReport>({
    queryKey: ['report-services', filter],
    queryFn: () =>
      MOCK_API
        ? mockReportAPI.getServiceReport(filter)
        : reportService.getServiceReport(filter),
  })
}

export function useAssetReport(filter: Partial<{ buildingId: string; category: string; dateFrom: string; dateTo: string }>) {
  return useQuery<AssetReport>({
    queryKey: ['report-assets', filter],
    queryFn: () =>
      MOCK_API
        ? mockReportAPI.getAssetReport(filter)
        : reportService.getAssetReport(filter),
  })
}
