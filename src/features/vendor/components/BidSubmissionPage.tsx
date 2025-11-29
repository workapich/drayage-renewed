import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, MapPin, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Layout } from '@/components/Layout'
import { getCityById } from '@/lib/mock-data'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useBidsByPortQuery, useBidsByRouteQuery, useRoutesQuery, useSubmitBidMutation } from '@/lib/query-hooks'

const emptyAccessorials = {
  chassis: '',
  yardStorage: '',
  hazmat: '',
  bond: '',
  split: '',
  flip: '',
  overweight: '',
  prepull: '',
}

const parseNumeric = (value: string) => {
  if (!value) return 0
  const cleaned = value.replace(/[^0-9.]/g, '')
  return Number(cleaned) || 0
}

export const BidSubmissionPage = () => {
  const { t } = useTranslation()
  const { portCityId } = useParams<{ portCityId: string }>()
  const { user } = useAuth()
  const { data: routes = [] } = useRoutesQuery(portCityId)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [baseRate, setBaseRate] = useState('')
  const [fsc, setFsc] = useState('')
  const [accessorials, setAccessorials] = useState<Record<string, string>>(emptyAccessorials)
  const [statusMessage, setStatusMessage] = useState('')
  const submitBidMutation = useSubmitBidMutation()

  const portCity = portCityId ? getCityById(portCityId) : null

  useEffect(() => {
    if (!selectedRouteId && routes.length > 0) {
      setSelectedRouteId(routes[0].id)
    }
  }, [routes, selectedRouteId])

  const { data: routeBids = [] } = useBidsByRouteQuery(selectedRouteId ?? '')
  const { data: portBids = [] } = useBidsByPortQuery(portCityId ?? '')
  const selectedRoute = routes.find((route) => route.id === selectedRouteId)
  const vendorBid = routeBids.find((bid) => bid.vendorId === user?.vendorId)

  useEffect(() => {
    if (vendorBid) {
      setBaseRate(vendorBid.baseRate ? vendorBid.baseRate.toString() : '')
      setFsc(vendorBid.fsc ? vendorBid.fsc.toString() : '')
      setAccessorials(
        Object.entries(vendorBid.accessorials).reduce<Record<string, string>>((acc, [key, value]) => {
          acc[key] = value ? value.toString() : ''
          return acc
        }, {}),
      )
    } else {
      setBaseRate('')
      setFsc('')
      setAccessorials(emptyAccessorials)
    }
  }, [vendorBid])

  const routeStatus = useMemo(() => {
    return routes.reduce<Record<string, 'submitted' | 'pending' | 'new'>>((acc, route) => {
      const bid = portBids.find((item) => item.vendorId === user?.vendorId && item.routeId === route.id)
      if (bid?.status === 'submitted') acc[route.id] = 'submitted'
      else if (bid) acc[route.id] = 'pending'
      else acc[route.id] = 'new'
      return acc
    }, {})
  }, [portBids, routes, user?.vendorId])

  if (!portCity || !portCityId) {
    return (
      <Layout showBackButton backTo="/vendor/cities" backLabel={t('vendor.bid.backToCities')} showLogout fullWidth>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 text-center text-lg font-semibold text-slate-700 shadow-[0_40px_80px_rgba(15,23,42,0.1)]">
          {t('vendor.bid.portNotFound')}
        </div>
      </Layout>
    )
  }

  const numericBaseRate = parseNumeric(baseRate)
  const numericFsc = parseNumeric(fsc)
  const numericAccessorials = Object.entries(accessorials).reduce<Record<string, number>>(
    (acc, [key, value]) => {
      acc[key] = parseNumeric(value)
      return acc
    },
    {},
  )

  const accessorialTotal = Object.values(numericAccessorials).reduce((sum, value) => sum + value, 0)
  const total = numericBaseRate + numericBaseRate * (numericFsc / 100) + accessorialTotal
  const canSubmit = Boolean(selectedRoute && user?.vendorId && numericBaseRate > 0 && numericFsc >= 0)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)

  const handleSubmit = async () => {
    if (!selectedRoute || !user?.vendorId || !canSubmit) return
    await submitBidMutation.mutateAsync({
      vendorId: user.vendorId,
      vendorEmail: user.email,
      routeId: selectedRoute.id,
      portCityId,
      inlandCityId: selectedRoute.inlandCityId,
      baseRate: numericBaseRate,
      fsc: numericFsc,
      accessorials: {
        chassis: numericAccessorials.chassis || 0,
        yardStorage: numericAccessorials.yardStorage || 0,
        hazmat: numericAccessorials.hazmat || 0,
        bond: numericAccessorials.bond || 0,
        split: numericAccessorials.split || 0,
        flip: numericAccessorials.flip || 0,
        overweight: numericAccessorials.overweight || 0,
        prepull: numericAccessorials.prepull || 0,
      },
    })
    setStatusMessage(t('vendor.bid.ratesSaved', { city: selectedRoute.inlandCity.name, state: selectedRoute.inlandCity.state }))
  }

  const resetAccessorials = () => setAccessorials(emptyAccessorials)

  return (
    <Layout
      showBackButton
      backTo="/vendor/cities"
      backLabel={t('vendor.bid.backToCities')}
      showLogout
      fullWidth
      subtitle={`${portCity.name}, ${portCity.state ?? ''}`.trim()}
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-white/70 bg-white/90 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t('vendor.bid.selectDestination')}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{t('vendor.bid.inlandRoutes', { city: portCity.name })}</p>
          </div>
          <button className="mx-6 mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 hover:border-blue-300 hover:text-blue-600">
            {t('vendor.bid.addDestination')}
          </button>
          <div className="mt-4 max-h-[620px] space-y-3 overflow-y-auto px-4 pb-6">
            {routes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-16 text-center text-sm font-medium text-slate-500">
                {t('vendor.bid.noDestinations')}
              </div>
            )}
            {routes.map((route) => {
              const status = routeStatus[route.id]
              const isSelected = route.id === selectedRouteId
              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={[
                    'w-full rounded-2xl border p-4 text-left transition',
                    isSelected
                      ? 'border-[#1f62f7] bg-gradient-to-br from-[#1f62f7] to-[#3f82ff] text-white shadow-lg shadow-blue-500/30'
                      : status === 'submitted'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50/60',
                  ].join(' ')}
                >
                  <p className="text-base font-semibold">
                    {route.inlandCity.name}, {route.inlandCity.state}
                  </p>
                  <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {route.inlandCityId.toUpperCase()}
                  </p>
                  {status === 'submitted' && !isSelected && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-600">
                      <Check className="h-3 w-3" />
                      {t('vendor.bid.ratesSubmitted')}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-[0_35px_60px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{t('vendor.bid.portLocation')}</p>
                <p className="text-2xl font-semibold text-slate-900">{portCity.name.toUpperCase()}</p>
              </div>
            </div>
            {statusMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {statusMessage}
              </div>
            )}
          </div>

          <div className="mt-8 space-y-10">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t('vendor.bid.requiredFees')}</p>
              <div className="mt-4 grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="base-rate" className="text-xs font-semibold text-slate-500">
                    {t('vendor.bid.baseRate')}
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      $
                    </span>
                    <Input
                      id="base-rate"
                      value={baseRate}
                      onChange={(e) => setBaseRate(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      inputMode="decimal"
                      className="h-12 rounded-2xl border-slate-200 pl-10 text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fsc" className="text-xs font-semibold text-slate-500">
                    {t('vendor.bid.fsc')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="fsc"
                      value={fsc}
                      onChange={(e) => setFsc(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      inputMode="decimal"
                      className="h-12 rounded-2xl border-slate-200 pr-10 text-base"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      %
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">{t('vendor.bid.total')}</Label>
                  <div className="h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-lg font-semibold text-slate-900">
                    {total > 0 ? formatCurrency(total) : '$0.00'}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t('vendor.bid.accessorials')}</p>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600"
                  onClick={resetAccessorials}
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('vendor.bid.reset')}
                </Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                {Object.entries(accessorials).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        $
                      </span>
                      <Input
                        value={value}
                        onChange={(e) =>
                          setAccessorials((prev) => ({ ...prev, [key]: e.target.value.replace(/[^0-9.]/g, '') }))
                        }
                        placeholder="0.00"
                        inputMode="decimal"
                        className="h-11 rounded-2xl border-slate-200 pl-8 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-10 flex justify-end">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitBidMutation.isPending}
              className={`h-12 rounded-2xl px-10 text-base font-semibold ${
                canSubmit
                  ? 'bg-gradient-to-r from-[#4f5ef5] to-[#7481ff] text-white hover:from-[#4050e2] hover:to-[#5f6cff]'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {submitBidMutation.isPending ? t('vendor.bid.submitButtonLoading') : t('vendor.bid.submitButton')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

