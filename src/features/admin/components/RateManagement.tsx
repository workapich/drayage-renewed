import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Layout } from '@/components/Layout'
import { getCityById } from '@/lib/mock-data'
import { RouteCreationModal } from './RouteCreationModal'
import { useBidsByRouteQuery, useRoutesQuery } from '@/lib/query-hooks'

export const RateManagement = () => {
  const { portCityId } = useParams<{ portCityId: string }>()
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const { data: routes = [] } = useRoutesQuery(portCityId)
  const { data: bids = [] } = useBidsByRouteQuery(selectedDestinationId ?? '')

  const portCity = portCityId ? getCityById(portCityId) : null

  useEffect(() => {
    if (!selectedDestinationId && routes.length > 0) {
      setSelectedDestinationId(routes[0].id)
    }
  }, [routes, selectedDestinationId])

  useEffect(() => {
    if (routes.length === 0) {
      setSelectedDestinationId(null)
    }
  }, [routes])

  const selectedRoute = routes.find((r) => r.id === selectedDestinationId) ?? routes[0]

  if (!portCity) {
    return (
      <Layout showBackButton backTo="/admin/dashboard" backLabel="Back to Cities" showLogout fullWidth>
        <div className="rounded-3xl border border-white/70 bg-white/95 p-8 text-center text-lg text-slate-600 shadow">
          City not found.
        </div>
      </Layout>
    )
  }

  const sortedBids = useMemo(() => {
    const clone = [...bids]
    return clone.sort((a, b) => {
      const dateA = new Date(a.submittedAt).getTime()
      const dateB = new Date(b.submittedAt).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
  }, [bids, sortOrder])

  const filteredBids = sortedBids.filter(
    (bid) =>
      bid.vendorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.vendorId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)

  return (
    <Layout
      showBackButton
      backTo="/admin/dashboard"
      backLabel="Back to Cities"
      showLogout
      fullWidth
      subtitle={`${portCity.name} · Rate Management`}
    >
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Select Destination</p>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-slate-200 text-xs font-semibold text-slate-600"
              onClick={() => setIsRouteModalOpen(true)}
            >
              + Add
            </Button>
          </div>
          <div className="mt-4 max-h-[600px] space-y-3 overflow-y-auto pr-1">
            {routes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-16 text-center text-sm text-slate-500">
                No inland destinations yet.
              </div>
            )}
            {routes.map((route) => {
              const count = bids.filter((bid) => bid.routeId === route.id).length
              const isSelected = route.id === selectedDestinationId
              return (
                <button
                  key={route.id}
                  onClick={() => {
                    setSelectedDestinationId(route.id)
                    setSearchQuery('')
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-[#1f62f7] bg-blue-50 text-blue-700 shadow-inner'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/70'
                  }`}
                >
                  <p className="text-base font-semibold">
                    {route.inlandCity.name}, {route.inlandCity.state}
                  </p>
                  <p className="text-xs text-slate-400">#{route.inlandCityId.toUpperCase()}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">{count} rates</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_35px_75px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Viewing Rates For</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {portCity.name} → {selectedRoute?.inlandCity.name}
              </h2>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by vendor ID or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-2xl border-slate-200 pl-12"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-100">
            <Table>
              <TableHeader className="bg-slate-50/60">
                <TableRow className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <TableHead>Vendor ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-800"
                    >
                      Submitted
                      <ChevronDown className={`h-4 w-4 transition ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    </button>
                  </TableHead>
                  <TableHead>Base Rate</TableHead>
                  <TableHead>FSC %</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBids.map((bid) => (
                  <TableRow key={bid.id} className="text-sm">
                    <TableCell className="font-semibold text-slate-900">{bid.vendorId}</TableCell>
                    <TableCell className="text-slate-600">{bid.vendorEmail}</TableCell>
                    <TableCell className="text-slate-600">
                      {selectedRoute?.inlandCity.name}, {selectedRoute?.inlandCity.state}
                    </TableCell>
                    <TableCell className="text-slate-500">{formatDate(bid.submittedAt)}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{formatCurrency(bid.baseRate)}</TableCell>
                    <TableCell className="text-slate-600">{bid.fsc.toFixed(2)}%</TableCell>
                    <TableCell className="font-semibold text-blue-600">{formatCurrency(bid.total)}</TableCell>
                  </TableRow>
                ))}
                {filteredBids.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                      No bids found for this destination.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <RouteCreationModal
        open={isRouteModalOpen}
        onOpenChange={setIsRouteModalOpen}
        defaultPortId={portCityId}
      />
    </Layout>
  )
}

