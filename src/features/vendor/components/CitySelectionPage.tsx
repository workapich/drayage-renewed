import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Layout } from '@/components/Layout'
import { getBidCountsByPortRampRegion, getPortRampRegions } from '@/lib/mock-data'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useVendorBidCountsQuery, useFavoritesQuery, useToggleFavoriteMutation } from '@/lib/query-hooks'

export const CitySelectionPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  const portRampRegions = useMemo(() => getPortRampRegions(), [])
  const systemCounts = useMemo(() => getBidCountsByPortRampRegion(), [])
  const { data: vendorCounts = {} } = useVendorBidCountsQuery(user?.vendorId)
  const { data: favoriteCityIds = [] } = useFavoritesQuery(user?.vendorId)
  const toggleFavoriteMutation = useToggleFavoriteMutation()

  const filteredPortRampRegions = portRampRegions.filter((portRampRegion) =>
    portRampRegion.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const favorites = useMemo(() => {
    return filteredPortRampRegions
      .filter((portRampRegion) => favoriteCityIds.includes(portRampRegion.id))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [filteredPortRampRegions, favoriteCityIds])

  const groupedPortRampRegions = useMemo(() => {
    // Group all port/ramp regions (including favorites) by first letter
    const portRampRegionGroups: Record<string, typeof filteredPortRampRegions> = {}
    filteredPortRampRegions.forEach((portRampRegion) => {
      const firstLetter = portRampRegion.name.charAt(0).toUpperCase()
      if (!portRampRegionGroups[firstLetter]) {
        portRampRegionGroups[firstLetter] = []
      }
      portRampRegionGroups[firstLetter].push(portRampRegion)
    })
    
    // Sort letters and return grouped port/ramp regions
    // Within each letter group, favorites appear first, then non-favorites
    return Object.keys(portRampRegionGroups)
      .sort()
      .map((letter) => ({
        letter,
        portRampRegions: portRampRegionGroups[letter].sort((a, b) => {
          const aIsFavorite = favoriteCityIds.includes(a.id)
          const bIsFavorite = favoriteCityIds.includes(b.id)
          // Favorites first
          if (aIsFavorite && !bIsFavorite) return -1
          if (!aIsFavorite && bIsFavorite) return 1
          // Then alphabetically
          return a.name.localeCompare(b.name)
        }),
      }))
  }, [filteredPortRampRegions, favoriteCityIds])

  const handleToggleFavorite = (e: React.MouseEvent, portRampRegionId: string) => {
    e.stopPropagation()
    if (!user?.vendorId) return
    toggleFavoriteMutation.mutate({ vendorId: user.vendorId, portRampRegionId })
  }

  return (
    <Layout showLogout fullWidth>
      <section className="mx-auto w-full max-w-6xl rounded-[32px] border border-white/70 bg-white/90 px-6 py-10 shadow-[0_40px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{t('vendor.portRampRegions.title')}</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">{t('vendor.portRampRegions.pageTitle')}</h1>
          <p className="mt-2 text-base text-slate-500">
            {t('vendor.portRampRegions.description')}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-3 rounded-full bg-blue-50 px-5 py-2 shadow-inner">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
              1
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">{t('vendor.portRampRegions.step1Title')}</p>
              <p className="text-xs text-slate-500">{t('vendor.portRampRegions.step1Description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-dashed border-slate-200 px-5 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-400">
              2
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-400">{t('vendor.portRampRegions.step2Title')}</p>
              <p className="text-xs text-slate-400">{t('vendor.portRampRegions.step2Description')}</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder={t('vendor.portRampRegions.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-2xl border-slate-200 pl-12 text-base"
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {favorites.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{t('vendor.portRampRegions.favorites')}</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {favorites.map((portRampRegion) => {
                  const badgeCounts = vendorCounts[portRampRegion.id] ?? { submitted: 0, pending: 0 }
                  const pendingCount = badgeCounts.pending > 0 ? badgeCounts.pending : systemCounts[portRampRegion.id] ?? 0
                  return (
                    <button
                      key={portRampRegion.id}
                      onClick={() => navigate(`/vendor/bid/${portRampRegion.id}`)}
                      className="group relative flex items-center justify-between rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <button
                          type="button"
                          aria-label={`Remove ${portRampRegion.name} from favorites`}
                          className="shrink-0 rounded p-0.5 hover:bg-yellow-50"
                          onClick={(e) => handleToggleFavorite(e, portRampRegion.id)}
                        >
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </button>
                        <span className="truncate">{portRampRegion.state ? `${portRampRegion.name}, ${portRampRegion.state}` : portRampRegion.name}</span>
                      </span>
                      <span className="ml-2 flex items-center gap-1">
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                          {pendingCount}
                        </span>
                        {badgeCounts.submitted > 0 && (
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500/90 px-1 text-xs font-semibold text-white">
                            {badgeCounts.submitted}
                          </span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {groupedPortRampRegions.map(({ letter, portRampRegions }) => {
            if (portRampRegions.length === 0) return null
            
            return (
              <div key={letter}>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{letter}</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {portRampRegions.map((portRampRegion) => {
                    const badgeCounts = vendorCounts[portRampRegion.id] ?? { submitted: 0, pending: 0 }
                    const pendingCount = badgeCounts.pending > 0 ? badgeCounts.pending : systemCounts[portRampRegion.id] ?? 0
                    const isFavorite = favoriteCityIds.includes(portRampRegion.id)
                    return (
                      <button
                        key={portRampRegion.id}
                        onClick={() => navigate(`/vendor/bid/${portRampRegion.id}`)}
                        className="group relative flex items-center justify-between rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <span className="flex items-center gap-2 truncate">
                          {isFavorite ? (
                            <button
                              type="button"
                              aria-label={`Remove ${portRampRegion.name} from favorites`}
                              className="shrink-0 rounded p-0.5 hover:bg-yellow-50"
                              onClick={(e) => handleToggleFavorite(e, portRampRegion.id)}
                            >
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Add ${portRampRegion.name} to favorites`}
                              className="shrink-0 rounded p-0.5 hover:bg-yellow-50"
                              onClick={(e) => handleToggleFavorite(e, portRampRegion.id)}
                            >
                              <Star className="h-4 w-4 text-slate-300 hover:text-yellow-400" />
                            </button>
                          )}
                          <span className="truncate">{portRampRegion.state ? `${portRampRegion.name}, ${portRampRegion.state}` : portRampRegion.name}</span>
                        </span>
                        <span className="ml-2 flex items-center gap-1">
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                            {pendingCount}
                          </span>
                          {badgeCounts.submitted > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500/90 px-1 text-xs font-semibold text-white">
                              {badgeCounts.submitted}
                            </span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </Layout>
  )
}

