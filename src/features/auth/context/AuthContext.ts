import { createContext } from 'react'
import type { User } from '@/types'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (mcid: string, email: string, password: string) => Promise<void>
  confirmEmail: (email: string, code: string) => Promise<User>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)


