import { useQuery } from '@tanstack/react-query'
import { mockDashboardAPI } from '../mocks/dashboardMocks'
import type {
  InvestorDashboardData,
  AdminDashboardData,
  ManagerDashboardData,
  MaintenanceDashboardData,
  AccountingDashboardData,
  SalesDashboardData,
} from '../types/dashboard'

// Mock mode flag - always use mock data for dashboard
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

// ========== INVESTOR DASHBOARD ==========

export function useInvestorDashboard() {
  return useQuery<InvestorDashboardData>({
    queryKey: ['dashboard', 'investor'],
    queryFn: () => {
      if (MOCK_API) {
        return mockDashboardAPI.getInvestorDashboard()
      }
      // TODO: Real API call
      return mockDashboardAPI.getInvestorDashboard()
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}

// ========== ADMIN DASHBOARD ==========

export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => {
      if (MOCK_API) {
        return mockDashboardAPI.getAdminDashboard()
      }
      // TODO: Real API call
      return mockDashboardAPI.getAdminDashboard()
    },
    refetchInterval: 60 * 1000, // 1 minute for active sessions
  })
}

// ========== MANAGER DASHBOARD ==========

export function useManagerDashboard() {
  return useQuery<ManagerDashboardData>({
    queryKey: ['dashboard', 'manager'],
    queryFn: () => {
      if (MOCK_API) {
        return mockDashboardAPI.getManagerDashboard()
      }
      // TODO: Real API call
      return mockDashboardAPI.getManagerDashboard()
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}

// ========== MAINTENANCE DASHBOARD ==========

export function useMaintenanceDashboard() {
  return useQuery<MaintenanceDashboardData>({
    queryKey: ['dashboard', 'maintenance'],
    queryFn: () => {
      if (MOCK_API) {
        return mockDashboardAPI.getMaintenanceDashboard()
      }
      // TODO: Real API call
      return mockDashboardAPI.getMaintenanceDashboard()
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}

// ========== ACCOUNTING DASHBOARD ==========

export function useAccountingDashboard() {
  return useQuery<AccountingDashboardData>({
    queryKey: ['dashboard', 'accounting'],
    queryFn: () => {
      if (MOCK_API) {
        return mockDashboardAPI.getAccountingDashboard()
      }
      // TODO: Real API call
      return mockDashboardAPI.getAccountingDashboard()
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}

// ========== SALES DASHBOARD ==========

export function useSalesDashboard() {
  return useQuery<SalesDashboardData>({
    queryKey: ['dashboard', 'sales'],
    queryFn: () => {
      if (MOCK_API) {
        return mockDashboardAPI.getSalesDashboard()
      }
      // TODO: Real API call
      return mockDashboardAPI.getSalesDashboard()
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}
