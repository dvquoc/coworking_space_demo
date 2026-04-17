import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { UserRole } from '../types/auth'

const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  investor: '/dashboard/investor',
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  maintenance: '/dashboard/maintenance',
  accountant: '/dashboard/accounting',
  sale: '/dashboard/sales',
}

export default function DashboardPage() {
  const user = useAuthStore(state => state.user)
  
  // Redirect to role-specific dashboard
  if (user?.role) {
    const dashboardPath = ROLE_DASHBOARD_MAP[user.role]
    if (dashboardPath) {
      return <Navigate to={dashboardPath} replace />
    }
  }

  // Fallback for unknown role or no user
  return <Navigate to="/auth/login" replace />
}
