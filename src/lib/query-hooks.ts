import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dataService } from '@/lib/data-service'
import { storage } from '@/lib/storage'
import type { AccessorialFees, VendorStatus } from '@/types'

export const queryKeys = {
  vendors: ['vendors'] as const,
  routes: (portRampRegionId?: string) => ['routes', portRampRegionId ?? 'all'] as const,
  bidsByPortRampRegion: (portRampRegionId: string) => ['bids', 'portRampRegion', portRampRegionId] as const,
  bidsByRoute: (routeId: string) => ['bids', 'route', routeId] as const,
  statistics: ['statistics'] as const,
  vendorCounts: (vendorId: string) => ['vendor-counts', vendorId] as const,
  templates: (vendorId: string) => ['templates', vendorId] as const,
  favorites: (vendorId: string) => ['favorites', vendorId] as const,
}

export const useVendorsQuery = () =>
  useQuery({
    queryKey: queryKeys.vendors,
    queryFn: async () => storage.getVendors(),
  })

export const useRoutesQuery = (portRampRegionId?: string) =>
  useQuery({
    queryKey: queryKeys.routes(portRampRegionId),
    queryFn: async () => (portRampRegionId ? storage.getRoutesByPortRampRegion(portRampRegionId) : storage.getRoutes()),
  })

export const useBidsByRouteQuery = (routeId: string) =>
  useQuery({
    queryKey: queryKeys.bidsByRoute(routeId),
    queryFn: async () => storage.getBidsByRoute(routeId),
    enabled: Boolean(routeId),
  })

export const useBidsByPortRampRegionQuery = (portRampRegionId: string) =>
  useQuery({
    queryKey: queryKeys.bidsByPortRampRegion(portRampRegionId),
    queryFn: async () => storage.getBidsByPortRampRegion(portRampRegionId),
    enabled: Boolean(portRampRegionId),
  })

export const useStatisticsQuery = () =>
  useQuery({
    queryKey: queryKeys.statistics,
    queryFn: async () => storage.getStatistics(),
  })

export const useVendorBidCountsQuery = (vendorId?: string) =>
  useQuery({
    queryKey: queryKeys.vendorCounts(vendorId ?? 'unknown'),
    queryFn: async () => (vendorId ? storage.getVendorBidCounts(vendorId) : {}),
    enabled: Boolean(vendorId),
  })

export const useSubmitBidMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      vendorId: string
      vendorEmail: string
      routeId: string
      portRampRegionId: string
      inlandLocationId: string
      baseRate: number
      fsc: number
      accessorials: AccessorialFees
    }) => dataService.submitBid(payload),
    onSuccess: (bid) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bidsByRoute(bid.routeId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.bidsByPortRampRegion(bid.portRampRegionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendorCounts(bid.vendorId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
    },
  })
}

export const useCreateRouteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ portRampRegionId, inlandLocationId }: { portRampRegionId: string; inlandLocationId: string }) =>
      dataService.createRoute(portRampRegionId, inlandLocationId),
    onSuccess: (route) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routes(route.portRampRegionId) })
    },
  })
}

export const useVendorStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ vendorId, status }: { vendorId: string; status: VendorStatus }) =>
      dataService.updateVendorStatus(vendorId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
    },
  })
}

export const useDeleteVendorMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (vendorId: string) => dataService.deleteVendor(vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
    },
  })
}

export const useAddVendorMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { email: string; createdByVendorId?: string; canWhitelistVendors?: boolean }) =>
      dataService.addVendor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
    },
  })
}

export const useVendorWhitelistPermissionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ vendorId, canWhitelistVendors }: { vendorId: string; canWhitelistVendors: boolean }) =>
      dataService.updateVendorWhitelistPermission(vendorId, canWhitelistVendors),
    onSuccess: (vendor) => {
      if (vendor) {
        queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
      }
    },
  })
}

export const useTemplatesQuery = (vendorId?: string) =>
  useQuery({
    queryKey: queryKeys.templates(vendorId ?? 'unknown'),
    queryFn: async () => (vendorId ? storage.getTemplates(vendorId) : []),
    enabled: Boolean(vendorId),
  })

export const useSaveTemplateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      vendorId,
      name,
      accessorials,
    }: {
      vendorId: string
      name: string
      accessorials: Record<string, number>
    }) => dataService.saveTemplate(vendorId, name, accessorials),
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates(template.vendorId) })
    },
  })
}

export const useDeleteTemplateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ vendorId, templateId }: { vendorId: string; templateId: string }) => {
      dataService.deleteTemplate(vendorId, templateId)
      return { vendorId, templateId }
    },
    onSuccess: ({ vendorId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates(vendorId) })
    },
  })
}

export const useFavoritesQuery = (vendorId?: string) =>
  useQuery({
    queryKey: queryKeys.favorites(vendorId ?? 'unknown'),
    queryFn: async () => (vendorId ? storage.getFavorites(vendorId) : []),
    enabled: Boolean(vendorId),
  })

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ vendorId, portRampRegionId }: { vendorId: string; portRampRegionId: string }) => {
      const isFavorite = dataService.toggleFavorite(vendorId, portRampRegionId)
      return { vendorId, portRampRegionId, isFavorite }
    },
    onSuccess: ({ vendorId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites(vendorId) })
    },
  })
}

