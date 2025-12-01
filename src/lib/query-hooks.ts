import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dataService } from '@/lib/data-service'
import { storage } from '@/lib/storage'
import type { AccessorialFees, VendorStatus } from '@/types'

export const queryKeys = {
  vendors: ['vendors'] as const,
  routes: (portCityId?: string) => ['routes', portCityId ?? 'all'] as const,
  bidsByPort: (portCityId: string) => ['bids', 'port', portCityId] as const,
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

export const useRoutesQuery = (portCityId?: string) =>
  useQuery({
    queryKey: queryKeys.routes(portCityId),
    queryFn: async () => (portCityId ? storage.getRoutesByPort(portCityId) : storage.getRoutes()),
  })

export const useBidsByRouteQuery = (routeId: string) =>
  useQuery({
    queryKey: queryKeys.bidsByRoute(routeId),
    queryFn: async () => storage.getBidsByRoute(routeId),
    enabled: Boolean(routeId),
  })

export const useBidsByPortQuery = (portCityId: string) =>
  useQuery({
    queryKey: queryKeys.bidsByPort(portCityId),
    queryFn: async () => storage.getBidsByPort(portCityId),
    enabled: Boolean(portCityId),
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
      portCityId: string
      inlandCityId: string
      baseRate: number
      fsc: number
      accessorials: AccessorialFees
    }) => dataService.submitBid(payload),
    onSuccess: (bid) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bidsByRoute(bid.routeId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.bidsByPort(bid.portCityId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendorCounts(bid.vendorId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
    },
  })
}

export const useCreateRouteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ portCityId, inlandCityId }: { portCityId: string; inlandCityId: string }) =>
      dataService.createRoute(portCityId, inlandCityId),
    onSuccess: (route) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routes(route.portCityId) })
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
    mutationFn: async (email: string) => dataService.addVendor(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
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
    mutationFn: async ({ vendorId, cityId }: { vendorId: string; cityId: string }) => {
      const isFavorite = dataService.toggleFavorite(vendorId, cityId)
      return { vendorId, cityId, isFavorite }
    },
    onSuccess: ({ vendorId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites(vendorId) })
    },
  })
}

