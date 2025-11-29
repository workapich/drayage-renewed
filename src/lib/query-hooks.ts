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

