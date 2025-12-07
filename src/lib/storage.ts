import { bids as seedBids, routes as seedRoutes, vendors as seedVendors, statistics as seedStats } from '@/lib/mock-data'
import type { Account, AccessorialTemplate, Bid, Route, Statistics, Vendor, VendorStatus } from '@/types'

const STORAGE_KEY = 'drayage-db'

type PendingRegistration = {
  email: string
  mcid: string
  password: string
}

type Database = {
  vendors: Vendor[]
  routes: Route[]
  bids: Bid[]
  statistics: Statistics
  accounts: Account[]
  pendingRegistrations: PendingRegistration[]
  templates: AccessorialTemplate[]
  favorites: { vendorId: string; cityId: string }[]
}

const seedAccounts: Account[] = [
  {
    id: 'acct-admin',
    email: 'admin@gmail.com',
    password: '123456',
    role: 'admin',
    canWhitelistVendors: true,
  },
  {
    id: 'acct-vendor',
    email: 'vendor@gmail.com',
    password: 'qwerty',
    role: 'vendor',
    mcid: 'MC-123456',
    vendorId: 'v1',
    status: 'active',
    canWhitelistVendors: true,
  },
]

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const createSeedDatabase = (): Database => ({
  vendors: clone(seedVendors),
  routes: clone(seedRoutes),
  bids: clone(seedBids),
  statistics: clone(seedStats),
  accounts: clone(seedAccounts),
  pendingRegistrations: [],
  templates: [],
  favorites: [],
})

const readDatabase = (): Database => {
  if (typeof window === 'undefined') {
    return createSeedDatabase()
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seeded = createSeedDatabase()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }

  try {
    return JSON.parse(raw) as Database
  } catch {
    const seeded = createSeedDatabase()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }
}

const persistDatabase = (db: Database) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

const mutateDb = <T>(mutator: (draft: Database) => T): T => {
  const db = readDatabase()
  const result = mutator(db)
  persistDatabase(db)
  return result
}

export const storage = {
  reset() {
    const seeded = createSeedDatabase()
    persistDatabase(seeded)
    return seeded
  },
  updateVendorWhitelistPermission(vendorId: string, canWhitelistVendors: boolean) {
    return mutateDb((db) => {
      const vendor = db.vendors.find((v) => v.id === vendorId)
      if (!vendor) return null
      vendor.canWhitelistVendors = canWhitelistVendors
      const account = db.accounts.find((acct) => acct.vendorId === vendorId)
      if (account) {
        account.canWhitelistVendors = canWhitelistVendors
      }
      return vendor
    })
  },
  getVendors(): Vendor[] {
    return readDatabase().vendors
  },
  getVendorById(vendorId: string) {
    return readDatabase().vendors.find((vendor) => vendor.id === vendorId)
  },
  upsertVendor(vendor: Vendor) {
    return mutateDb((db) => {
      const index = db.vendors.findIndex((v) => v.id === vendor.id)
      if (index >= 0) {
        db.vendors[index] = vendor
      } else {
        db.vendors.push(vendor)
      }
      return vendor
    })
  },
  updateVendorStatus(vendorId: string, status: VendorStatus) {
    return mutateDb((db) => {
      const vendor = db.vendors.find((v) => v.id === vendorId)
      if (!vendor) return null
      vendor.status = status
      const account = db.accounts.find((acct) => acct.vendorId === vendorId)
      if (account) {
        account.status = status
      }
      return vendor
    })
  },
  deleteVendor(vendorId: string) {
    return mutateDb((db) => {
      db.vendors = db.vendors.filter((v) => v.id !== vendorId)
      db.accounts = db.accounts.filter((acct) => acct.vendorId !== vendorId)
      db.bids = db.bids.filter((bid) => bid.vendorId !== vendorId)
    })
  },
  getRoutes(): Route[] {
    return readDatabase().routes
  },
  getRoutesByPort(portCityId: string) {
    return readDatabase().routes.filter((route) => route.portCityId === portCityId)
  },
  addRoute(portCityId: string, inlandCityId: string, routeBuilder: () => Route) {
    return mutateDb((db) => {
      const exists = db.routes.some(
        (route) => route.portCityId === portCityId && route.inlandCityId === inlandCityId,
      )
      if (exists) {
        return db.routes.find(
          (route) => route.portCityId === portCityId && route.inlandCityId === inlandCityId,
        )!
      }
      const newRoute = routeBuilder()
      db.routes.push(newRoute)
      return newRoute
    })
  },
  getBids(): Bid[] {
    return readDatabase().bids
  },
  getBidsByPort(portCityId: string) {
    return readDatabase().bids.filter((bid) => bid.portCityId === portCityId)
  },
  getBidsByRoute(routeId: string) {
    return readDatabase().bids.filter((bid) => bid.routeId === routeId)
  },
  getBidsForVendor(vendorId: string) {
    return readDatabase().bids.filter((bid) => bid.vendorId === vendorId)
  },
  upsertBid(bid: Bid) {
    return mutateDb((db) => {
      const index = db.bids.findIndex((b) => b.id === bid.id)
      if (index >= 0) {
        db.bids[index] = bid
      } else {
        db.bids.push(bid)
      }
      const vendor = db.vendors.find((v) => v.id === bid.vendorId)
      if (vendor) {
        vendor.totalBids = db.bids.filter((b) => b.vendorId === vendor.id).length
      }
      return bid
    })
  },
  getAccounts(): Account[] {
    return readDatabase().accounts
  },
  findAccountByEmail(email: string) {
    return readDatabase().accounts.find(
      (acct) => acct.email.toLowerCase() === email.toLowerCase(),
    )
  },
  upsertAccount(account: Account) {
    return mutateDb((db) => {
      const index = db.accounts.findIndex((acct) => acct.id === account.id)
      if (index >= 0) {
        db.accounts[index] = account
      } else {
        db.accounts.push(account)
      }
      return account
    })
  },
  addPendingRegistration(entry: PendingRegistration) {
    return mutateDb((db) => {
      db.pendingRegistrations = [
        ...db.pendingRegistrations.filter((reg) => reg.email !== entry.email),
        entry,
      ]
    })
  },
  consumePendingRegistration(email: string) {
    let pending: PendingRegistration | undefined
    mutateDb((db) => {
      const index = db.pendingRegistrations.findIndex((reg) => reg.email === email)
      if (index >= 0) {
        pending = db.pendingRegistrations[index]
        db.pendingRegistrations.splice(index, 1)
      }
    })
    return pending
  },
  getStatistics() {
    return readDatabase().statistics
  },
  getVendorBidCounts(vendorId: string) {
    const counts: Record<string, { submitted: number; pending: number }> = {}
    const bids = this.getBidsForVendor(vendorId)
    bids.forEach((bid) => {
      if (!counts[bid.portCityId]) {
        counts[bid.portCityId] = { submitted: 0, pending: 0 }
      }
      if (bid.status === 'submitted') {
        counts[bid.portCityId].submitted += 1
      } else {
        counts[bid.portCityId].pending += 1
      }
    })
    return counts
  },
  getTemplates(vendorId: string): AccessorialTemplate[] {
    if (!vendorId) return []
    return readDatabase().templates.filter((template) => template.vendorId === vendorId)
  },
  getTemplateById(vendorId: string, templateId: string): AccessorialTemplate | null {
    if (!vendorId || !templateId) return null
    return readDatabase().templates.find((t) => t.id === templateId && t.vendorId === vendorId) ?? null
  },
  saveTemplate(template: AccessorialTemplate): AccessorialTemplate {
    return mutateDb((db) => {
      const existing = db.templates.find((t) => t.id === template.id)
      if (existing) {
        const index = db.templates.indexOf(existing)
        db.templates[index] = template
      } else {
        db.templates.push(template)
      }
      return template
    })
  },
  deleteTemplate(vendorId: string, templateId: string): void {
    mutateDb((db) => {
      db.templates = db.templates.filter((t) => !(t.id === templateId && t.vendorId === vendorId))
    })
  },
  getFavorites(vendorId: string): string[] {
    if (!vendorId) return []
    return readDatabase()
      .favorites.filter((f) => f.vendorId === vendorId)
      .map((f) => f.cityId)
  },
  toggleFavorite(vendorId: string, cityId: string): boolean {
    return mutateDb((db) => {
      const existing = db.favorites.find((f) => f.vendorId === vendorId && f.cityId === cityId)
      if (existing) {
        db.favorites = db.favorites.filter((f) => !(f.vendorId === vendorId && f.cityId === cityId))
        return false // Removed from favorites
      } else {
        db.favorites.push({ vendorId, cityId })
        return true // Added to favorites
      }
    })
  },
  isFavorite(vendorId: string, cityId: string): boolean {
    if (!vendorId || !cityId) return false
    return readDatabase().favorites.some((f) => f.vendorId === vendorId && f.cityId === cityId)
  },
}

