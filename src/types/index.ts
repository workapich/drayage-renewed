export interface User {
  id: string
  email: string
  mcid?: string
  role: 'vendor' | 'admin'
  vendorId?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface City {
  id: string
  name: string
  state?: string
  isPort: boolean
  isInland: boolean
}

export interface Route {
  id: string
  portCityId: string
  inlandCityId: string
  portCity: City
  inlandCity: City
}

export type VendorStatus = 'active' | 'inactive' | 'blocked'

export interface Vendor {
  id: string
  mcid: string
  email: string
  status: VendorStatus
  totalBids: number
  joinedDate: string
}

export interface AccessorialFees {
  chassis: number
  yardStorage: number
  hazmat: number
  bond: number
  split: number
  flip: number
  overweight: number
  prepull: number
}

export interface Bid {
  id: string
  vendorId: string
  vendorEmail: string
  routeId: string
  portCityId: string
  inlandCityId: string
  baseRate: number
  fsc: number
  total: number
  accessorials: AccessorialFees
  submittedAt: string
  status: 'pending' | 'submitted'
}

export interface BidSubmission {
  routeId: string
  baseRate: number
  fsc: number
  accessorials: AccessorialFees
}

export interface Statistics {
  totalBids: number
  bidsLast24h: number
  bidsLast7d: number
  activeRoutes: number
}

export interface Account {
  id: string
  email: string
  password: string
  role: 'vendor' | 'admin'
  mcid?: string
  vendorId?: string
  status?: VendorStatus
}

