import { useEffect, useState } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { UserRole } from '../types/auth'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, user, ensureValidToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        setIsValid(false)
        return
      }

      // Ensure token is still valid
      const valid = await ensureValidToken()
      setIsValid(valid)
      setIsLoading(false)
    }

    checkAuth()
  }, [isAuthenticated, ensureValidToken])

  // Loading state - prevent flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-[#b11e29] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-600 text-sm">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login with return URL
  if (!isValid) {
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  // Check role-based access
  if (allowedRoles && user) {
    const hasPermission = allowedRoles.includes(user.role)
    
    if (!hasPermission) {
      return <Navigate to="/forbidden" replace />
    }
  }

  return <Outlet />
}
