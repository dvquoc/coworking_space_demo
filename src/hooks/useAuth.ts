import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api, getErrorMessage } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/auth'

// Mock mode flag
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

// Mock delay helper
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms))

// Mock user data by role
const mockUsers: Record<string, LoginResponse> = {
  'admin@cobi.vn': {
    accessToken: 'mock-access-token-admin',
    user: {
        id: '1',
        email: 'admin@cobi.vn',
        name: 'Admin User',
        role: 'admin',
        avatarUrl: undefined,
        permissions: []
    },
  },
  'manager@cobi.vn': {
    accessToken: 'mock-access-token-manager',
    user: {
        id: '2',
        email: 'manager@cobi.vn',
        name: 'Manager User',
        role: 'manager',
        avatarUrl: undefined,
        permissions: []
    },
  },
  'sale@cobi.vn': {
    accessToken: 'mock-access-token-sale',
    user: {
        id: '3',
        email: 'sale@cobi.vn',
        name: 'Sale User',
        role: 'sale',
        avatarUrl: undefined,
        permissions: []
    },
  },
  'accountant@cobi.vn': {
    accessToken: 'mock-access-token-accountant',
    user: {
        id: '4',
        email: 'accountant@cobi.vn',
        name: 'Accountant User',
        role: 'accountant',
        avatarUrl: undefined,
        permissions: []
    },
  },
  'maintenance@cobi.vn': {
    accessToken: 'mock-access-token-maintenance',
    user: {
        id: '5',
        email: 'maintenance@cobi.vn',
        name: 'Maintenance User',
        role: 'maintenance',
        avatarUrl: undefined,
        permissions: []
    },
  },
  'investor@cobi.vn': {
    accessToken: 'mock-access-token-investor',
    user: {
        id: '6',
        email: 'investor@cobi.vn',
        name: 'Investor User',
        role: 'investor',
        avatarUrl: undefined,
        permissions: []
    },
  },
}

// Login hook
export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      console.log('🔐 Login attempt:', { email: data.email, mockMode: MOCK_API })
      
      if (MOCK_API) {
        await mockDelay()
        // Check if email exists in mock users
        const mockUser = mockUsers[data.email]
        console.log('👤 Mock user found:', mockUser ? 'Yes' : 'No')
        if (!mockUser) {
          throw new Error('Email không tồn tại')
        }
        // Any password works in mock mode
        console.log('✅ Mock login success:', mockUser.user.email, mockUser.user.role)
        return mockUser
      }
      
      const response = await api.post<LoginResponse>('/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      // Save to store
      setAuth(data.accessToken, data.user)
      
      // Remember me - save email to localStorage
      if (data.user.email) {
        localStorage.setItem('rememberedEmail', data.user.email)
      }

      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        admin: '/dashboard',
        manager: '/dashboard',
        sale: '/customers',
        accountant: '/invoices',
        maintenance: '/maintenance',
        investor: '/reports',
      }
      
      const redirectPath = roleRedirects[data.user.role] || '/dashboard'
      navigate(redirectPath)
    },
  })
}

// Forgot password hook
export function useForgotPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      if (MOCK_API) {
        await mockDelay()
        return { message: 'OTP sent successfully' }
      }
      
      const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', data)
      return response.data
    },
    onSuccess: (_data, variables) => {
      // Navigate to verify OTP page with email
      navigate(`/auth/otp?email=${encodeURIComponent(variables.email)}`)
    },
  })
}

// Verify OTP hook
export function useVerifyOTP() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: VerifyOTPRequest) => {
      if (MOCK_API) {
        await mockDelay()
        // Accept any 6-digit OTP in mock mode
        if (data.otp.length !== 6) {
          throw new Error('Mã OTP phải có 6 chữ số')
        }
        return { resetToken: 'mock-reset-token' }
      }
      
      const response = await api.post<VerifyOTPResponse>('/auth/verify-otp', data)
      return response.data
    },
    onSuccess: (data) => {
      // Navigate to reset password with token
      navigate(`/auth/reset-password?token=${encodeURIComponent(data.resetToken)}`)
    },
  })
}

// Resend OTP hook
export function useResendOTP() {
  return useMutation({
    mutationFn: async (email: string) => {
      if (MOCK_API) {
        await mockDelay(500)
        return { message: 'OTP resent successfully' }
      }
      
      const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email })
      return response.data
    },
  })
}

// Reset password hook
export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      if (MOCK_API) {
        await mockDelay()
        return { message: 'Password reset successfully' }
      }
      
      const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data)
      return response.data
    },
    onSuccess: () => {
      // Show success message and redirect after 3 seconds
      setTimeout(() => {
        navigate('/auth/login')
      }, 3000)
    },
  })
}

// Logout hook
export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: async () => {
      if (MOCK_API) {
        await mockDelay(300)
      }
      await logout()
    },
    onSuccess: () => {
      navigate('/auth/login')
    },
  })
}

// Export error handler
export { getErrorMessage }
