import { User } from '@/types'
import { getAccessToken, getRefreshToken, api, getStoredUser } from './api-client'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

// Get current user from token (in real app, decode JWT)
export const getCurrentUser = (): User | null => {
  return getStoredUser()
}

// Check if token needs refresh (mock: always false for simplicity)
export const shouldRefreshToken = (): boolean => {
  // In real app, check token expiry
  return false
}

// Refresh token if needed
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  if (!getRefreshToken()) return false
  
  try {
    await api.refreshAccessToken()
    return true
  } catch {
    return false
  }
}

