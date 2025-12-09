import { getCityById } from '@/lib/mock-data'
import { storage } from '@/lib/storage'
import type { AccessorialFees, AccessorialTemplate, Bid, Route, Vendor, VendorStatus } from '@/types'

export const dataService = {
  submitBid({
    vendorId,
    vendorEmail,
    routeId,
    portRampRegionId,
    inlandLocationId,
    baseRate,
    fsc,
    accessorials,
    status = 'submitted',
  }: {
    vendorId: string
    vendorEmail: string
    routeId: string
    portRampRegionId: string
    inlandLocationId: string
    baseRate: number
    fsc: number
    accessorials: AccessorialFees
    status?: 'pending' | 'submitted'
  }): Bid {
    const normalizedBase = Math.max(0, baseRate)
    const normalizedFsc = Math.max(0, fsc)
    const total = Math.round((normalizedBase * (1 + normalizedFsc / 100)) * 100) / 100

    const existingBid = storage
      .getBidsByRoute(routeId)
      .find((bid) => bid.vendorId === vendorId && bid.routeId === routeId)

    const bid: Bid = {
      id: existingBid?.id ?? `bid-${routeId}-${vendorId}`,
      vendorId,
      vendorEmail,
      routeId,
      portRampRegionId,
      inlandLocationId,
      baseRate: normalizedBase,
      fsc: normalizedFsc,
      total,
      accessorials,
      submittedAt: new Date().toISOString(),
      status,
    }

    return storage.upsertBid(bid)
  },

  createRoute(portRampRegionId: string, inlandLocationId: string): Route {
    return storage.addRoute(portRampRegionId, inlandLocationId, () => {
      const portRampRegion = getCityById(portRampRegionId)
      const inlandLocation = getCityById(inlandLocationId)
      if (!portRampRegion || !inlandLocation) {
        throw new Error('Invalid route selection.')
      }

      return {
        id: `route-${portRampRegionId}-${inlandLocationId}`,
        portRampRegionId,
        inlandLocationId,
        portRampRegion,
        inlandLocation,
      }
    })
  },

  updateVendorStatus(vendorId: string, status: VendorStatus) {
    return storage.updateVendorStatus(vendorId, status)
  },

  deleteVendor(vendorId: string) {
    return storage.deleteVendor(vendorId)
  },

  addVendor({
    email,
    createdByVendorId,
    canWhitelistVendors = false,
  }: {
    email: string
    createdByVendorId?: string
    canWhitelistVendors?: boolean
  }): Vendor {
    const existing = storage.getVendors().find((v) => v.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      throw new Error('Vendor with this email already exists')
    }

    const vendor: Vendor = {
      id: crypto.randomUUID?.() ?? `v-${Date.now()}`,
      mcid: `MC-${Math.floor(100000 + Math.random() * 900000)}`,
      email,
      status: 'active',
      totalBids: 0,
      joinedDate: new Date().toLocaleDateString('en-US'),
      createdByVendorId,
      canWhitelistVendors,
    }

    return storage.upsertVendor(vendor)
  },

  updateVendorWhitelistPermission(vendorId: string, canWhitelistVendors: boolean) {
    return storage.updateVendorWhitelistPermission(vendorId, canWhitelistVendors)
  },

  saveTemplate(vendorId: string, name: string, accessorials: Record<string, number>): AccessorialTemplate {
    if (!vendorId) throw new Error('Vendor ID is required')
    if (!name || name.trim() === '') throw new Error('Template name is required')

    const templates = storage.getTemplates(vendorId)

    // Check for duplicate names
    const duplicate = templates.find((t) => t.name.toLowerCase().trim() === name.toLowerCase().trim())
    if (duplicate) {
      throw new Error('Template with this name already exists')
    }

    const template: AccessorialTemplate = {
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      vendorId,
      accessorials,
      createdAt: new Date().toISOString(),
    }

    return storage.saveTemplate(template)
  },

  deleteTemplate(vendorId: string, templateId: string): void {
    storage.deleteTemplate(vendorId, templateId)
  },

  toggleFavorite(vendorId: string, portRampRegionId: string): boolean {
    if (!vendorId || !portRampRegionId) {
      throw new Error('Vendor ID and Port/Ramp Region ID are required')
    }
    return storage.toggleFavorite(vendorId, portRampRegionId)
  },
}

