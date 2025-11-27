import { getCityById } from '@/lib/mock-data'
import { storage } from '@/lib/storage'
import type { AccessorialFees, Bid, Route, VendorStatus } from '@/types'

const sumAccessorials = (fees: AccessorialFees) =>
  Object.values(fees).reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0)

export const dataService = {
  submitBid({
    vendorId,
    vendorEmail,
    routeId,
    portCityId,
    inlandCityId,
    baseRate,
    fsc,
    accessorials,
    status = 'submitted',
  }: {
    vendorId: string
    vendorEmail: string
    routeId: string
    portCityId: string
    inlandCityId: string
    baseRate: number
    fsc: number
    accessorials: AccessorialFees
    status?: 'pending' | 'submitted'
  }): Bid {
    const normalizedBase = Math.max(0, baseRate)
    const normalizedFsc = Math.max(0, fsc)
    const totalAccessorials = sumAccessorials(accessorials)
    const total = Math.round((normalizedBase * (1 + normalizedFsc / 100) + totalAccessorials) * 100) / 100

    const existingBid = storage
      .getBidsByRoute(routeId)
      .find((bid) => bid.vendorId === vendorId && bid.routeId === routeId)

    const bid: Bid = {
      id: existingBid?.id ?? `bid-${routeId}-${vendorId}`,
      vendorId,
      vendorEmail,
      routeId,
      portCityId,
      inlandCityId,
      baseRate: normalizedBase,
      fsc: normalizedFsc,
      total,
      accessorials,
      submittedAt: new Date().toISOString(),
      status,
    }

    return storage.upsertBid(bid)
  },

  createRoute(portCityId: string, inlandCityId: string): Route {
    return storage.addRoute(portCityId, inlandCityId, () => {
      const portCity = getCityById(portCityId)
      const inlandCity = getCityById(inlandCityId)
      if (!portCity || !inlandCity) {
        throw new Error('Invalid route selection.')
      }

      return {
        id: `route-${portCityId}-${inlandCityId}`,
        portCityId,
        inlandCityId,
        portCity,
        inlandCity,
      }
    })
  },

  updateVendorStatus(vendorId: string, status: VendorStatus) {
    return storage.updateVendorStatus(vendorId, status)
  },

  deleteVendor(vendorId: string) {
    return storage.deleteVendor(vendorId)
  },
}

