// User roles
export type UserRole = 'admin' | 'manager' | 'sale' | 'accountant' | 'maintenance' | 'investor'

// User interface
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  permissions: string[]
}

// Auth responses
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success?: boolean
  accessToken: string
  user: User
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  success?: boolean
  message: string
  email: string // masked email
}

export interface VerifyOTPRequest {
  email: string
  otp: string
}

export interface VerifyOTPResponse {
  success: boolean
  resetToken: string
  message: string
}

export interface ResetPasswordRequest {
  resetToken: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

export interface RefreshTokenResponse {
  success: boolean
  accessToken: string
}

// API Error
export interface APIError {
  message: string
  code?: string
  status?: number
}
