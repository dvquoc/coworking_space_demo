import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/auth'
import { api } from '../services/api'

// Mock mode flag
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

interface AuthState {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
  
  // Actions
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  logout: () => Promise<void>
  ensureValidToken: () => Promise<boolean>
}

// Helper: decode JWT to check expiry (client-side only, don't trust)
function isTokenExpiringSoon(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiresAt = payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    const twoMinutes = 2 * 60 * 1000
    return expiresAt - now < twoMinutes
  } catch {
    return true // If can't decode, treat as expiring
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token: string, user: User) => {
        set({ 
          accessToken: token, 
          user, 
          isAuthenticated: true 
        })
      },

      clearAuth: () => {
        set({ 
          accessToken: null, 
          user: null, 
          isAuthenticated: false 
        })
      },

      logout: async () => {
        try {
          // Skip API call in mock mode
          if (!MOCK_API) {
            await api.post('/auth/logout')
          }
        } catch (error) {
          console.error('Logout API error:', error)
        } finally {
          // Always clear local state
          get().clearAuth()
        }
      },

      ensureValidToken: async () => {
        const { accessToken } = get()
        
        if (!accessToken) {
          return false
        }

        // In mock mode, always return true without checking expiry
        if (MOCK_API) {
          console.log('🔄 Mock mode: Token validation skipped')
          return true
        }

        // Check if token is expiring soon
        if (isTokenExpiringSoon(accessToken)) {
          try {
            const response = await api.post<{ accessToken: string }>('/auth/refresh')
            const newToken = response.data.accessToken
            
            // Update token in store
            set({ accessToken: newToken })
            return true
          } catch (error) {
            console.error('Token refresh failed:', error)
            get().clearAuth()
            return false
          }
        }

        return true
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
