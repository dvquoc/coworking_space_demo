import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { UserRole } from '../types/auth'

// Default pages for each role
const DEFAULT_PAGES: Record<UserRole, string> = {
  admin: '/dashboard',
  manager: '/dashboard',
  sale: '/customers',
  accountant: '/invoices',
  maintenance: '/maintenance',
  investor: '/reports',
}

export function GuestRoute() {
  const { isAuthenticated, user } = useAuthStore()

  // If logged in, redirect to default page based on role
  if (isAuthenticated && user) {
    const defaultPage = DEFAULT_PAGES[user.role] || '/dashboard'
    return <Navigate to={defaultPage} replace />
  }

  return <Outlet />
}
