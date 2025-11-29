import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/types'
import { api, setAccessToken, setRefreshToken, getAccessToken, getRefreshToken } from '@/lib/api-client'
import { getCurrentUser, refreshTokenIfNeeded } from '@/lib/auth'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing tokens
        const token = getAccessToken()
        const refresh = getRefreshToken()
        
        if (token && refresh) {
          // Try to refresh if needed
          await refreshTokenIfNeeded()
          const currentUser = getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        setAccessToken(null)
        setRefreshToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)
    setUser(response.user)
    return response.user
  }

  const register = async (mcid: string, email: string, password: string) => {
    await api.register(mcid, email, password)
  }

  const confirmEmail = async (email: string, code: string) => {
    return api.confirmEmail(email, code)
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        confirmEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

