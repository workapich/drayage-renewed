import { storage } from '@/lib/storage'
import type { Account, AuthResponse, User, Vendor } from '@/types'

const API_BASE_URL = '/api'
const ACCESS_TOKEN_KEY = 'drayage-access-token'
const REFRESH_TOKEN_KEY = 'drayage-refresh-token'
const CURRENT_USER_KEY = 'drayage-current-user'

const readFromLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

const writeToLocalStorage = (key: string, value: string | null) => {
  if (typeof window === 'undefined') return
  if (value === null) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, value)
  }
}

let accessToken: string | null = readFromLocalStorage(ACCESS_TOKEN_KEY)
let refreshToken: string | null = readFromLocalStorage(REFRESH_TOKEN_KEY)

export const setAccessToken = (token: string | null) => {
  accessToken = token
  writeToLocalStorage(ACCESS_TOKEN_KEY, token)
}

export const setRefreshToken = (token: string | null) => {
  refreshToken = token
  writeToLocalStorage(REFRESH_TOKEN_KEY, token)
}

export const getAccessToken = () => accessToken
export const getRefreshToken = () => refreshToken

const setCurrentUser = (user: User | null) => {
  if (!user) {
    writeToLocalStorage(CURRENT_USER_KEY, null)
    return
  }
  writeToLocalStorage(CURRENT_USER_KEY, JSON.stringify(user))
}

export const getStoredUser = (): User | null => {
  const raw = readFromLocalStorage(CURRENT_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const createToken = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2)}`

const buildUserFromAccount = (account: Account): User => ({
  id: account.id,
  email: account.email,
  role: account.role,
  mcid: account.mcid,
  vendorId: account.vendorId,
})

const ensureVendorAccountActive = (account: Account, vendor: Vendor | undefined) => {
  if (account.role === 'vendor') {
    if (account.status === 'blocked' || vendor?.status === 'blocked') {
      throw new Error('Your account has been blocked. Please contact support.')
    }
    if (vendor?.status === 'inactive') {
      throw new Error('Your vendor profile is inactive.')
    }
  }
}

// Mock API functions
export const api = {
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(400)

    const account = storage.findAccountByEmail(email)
    if (!account || account.password !== password) {
      throw new Error('Invalid credentials')
    }

    const vendor = account.vendorId ? storage.getVendorById(account.vendorId) : undefined
    ensureVendorAccountActive(account, vendor)

    const user = buildUserFromAccount(account)
    const response: AuthResponse = {
      accessToken: createToken('access'),
      refreshToken: createToken('refresh'),
      user,
    }

    setAccessToken(response.accessToken)
    setRefreshToken(response.refreshToken)
    setCurrentUser(user)

    return response
  },

  async register(mcid: string, email: string, password: string): Promise<{ message: string }> {
    await delay(400)
    const existing = storage.findAccountByEmail(email)
    if (existing) {
      throw new Error('An account with this email already exists.')
    }

    storage.addPendingRegistration({ email, mcid, password })
    return { message: 'Registration successful. Please enter the 6-digit confirmation code.' }
  },

  async confirmEmail(email: string, code: string): Promise<User> {
    await delay(400)

    if (!/^[0-9]{6}$/.test(code)) {
      throw new Error('Invalid confirmation code')
    }

    const pending = storage.consumePendingRegistration(email)
    if (!pending) {
      throw new Error('No pending registration found for this email.')
    }

    const vendorId = crypto.randomUUID?.() ?? `vendor-${Date.now()}`
    const vendor: Vendor = {
      id: vendorId,
      email,
      mcid: pending.mcid,
      status: 'active',
      totalBids: 0,
      joinedDate: new Date().toLocaleDateString('en-US'),
    }

    storage.upsertVendor(vendor)

    const account: Account = {
      id: `acct-${vendorId}`,
      email,
      password: pending.password,
      role: 'vendor',
      mcid: pending.mcid,
      vendorId,
      status: 'active',
    }
    storage.upsertAccount(account)

    return buildUserFromAccount(account)
  },

  async refreshAccessToken(): Promise<{ accessToken: string }> {
    await delay(200)

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const newAccessToken = createToken('access')
    setAccessToken(newAccessToken)
    return { accessToken: newAccessToken }
  },

  async logout(): Promise<void> {
    await delay(150)
    setAccessToken(null)
    setRefreshToken(null)
    setCurrentUser(null)
  },
}

// Fetch wrapper with token injection
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = getAccessToken()

  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Try to refresh token
      try {
        const { accessToken: newToken } = await api.refreshAccessToken()
        headers.set('Authorization', `Bearer ${newToken}`)
        return fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
        })
      } catch {
        // Refresh failed, clear tokens
        setAccessToken(null)
        setRefreshToken(null)
        throw new Error('Authentication failed')
      }
    }

    return response
  } catch (error) {
    throw error
  }
}

