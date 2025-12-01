import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Layout } from '@/components/Layout'
import { getBidCountsByCity, getPortCities } from '@/lib/mock-data'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useVendorBidCountsQuery, useFavoritesQuery, useToggleFavoriteMutation } from '@/lib/query-hooks'

export const CitySelectionPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  const portCities = useMemo(() => getPortCities(), [])
  const systemCounts = useMemo(() => getBidCountsByCity(), [])
  const { data: vendorCounts = {} } = useVendorBidCountsQuery(user?.vendorId)
  const { data: favoriteCityIds = [] } = useFavoritesQuery(user?.vendorId)
  const toggleFavoriteMutation = useToggleFavoriteMutation()

  const filteredCities = portCities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const favorites = useMemo(() => {
    return filteredCities
      .filter((city) => favoriteCityIds.includes(city.id))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [filteredCities, favoriteCityIds])

  const groupedCities = useMemo(() => {
    // Group all cities (including favorites) by first letter
    const cityGroups: Record<string, typeof filteredCities> = {}
    filteredCities.forEach((city) => {
      const firstLetter = city.name.charAt(0).toUpperCase()
      if (!cityGroups[firstLetter]) {
        cityGroups[firstLetter] = []
      }
      cityGroups[firstLetter].push(city)
    })
    
    // Sort letters and return grouped cities
    // Within each letter group, favorites appear first, then non-favorites
    return Object.keys(cityGroups)
      .sort()
      .map((letter) => ({
        letter,
        cities: cityGroups[letter].sort((a, b) => {
          const aIsFavorite = favoriteCityIds.includes(a.id)
          const bIsFavorite = favoriteCityIds.includes(b.id)
          // Favorites first
          if (aIsFavorite && !bIsFavorite) return -1
          if (!aIsFavorite && bIsFavorite) return 1
          // Then alphabetically
          return a.name.localeCompare(b.name)
        }),
      }))
  }, [filteredCities, favoriteCityIds])

  const handleToggleFavorite = (e: React.MouseEvent, cityId: string) => {
    e.stopPropagation()
    if (!user?.vendorId) return
    toggleFavoriteMutation.mutate({ vendorId: user.vendorId, cityId })
  }

  return (
    <Layout showLogout fullWidth>
      <section className="mx-auto w-full max-w-6xl rounded-[32px] border border-white/70 bg-white/90 px-6 py-10 shadow-[0_40px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{t('vendor.cities.title')}</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">{t('vendor.cities.pageTitle')}</h1>
          <p className="mt-2 text-base text-slate-500">
            {t('vendor.cities.description')}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-3 rounded-full bg-blue-50 px-5 py-2 shadow-inner">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f62f7] font-semibold text-white">
              1
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">{t('vendor.cities.step1Title')}</p>
              <p className="text-xs text-slate-500">{t('vendor.cities.step1Description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-dashed border-slate-200 px-5 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-400">
              2
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-400">{t('vendor.cities.step2Title')}</p>
              <p className="text-xs text-slate-400">{t('vendor.cities.step2Description')}</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder={t('vendor.cities.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-2xl border-slate-200 pl-12 text-base"
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {favorites.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{t('vendor.cities.favorites')}</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {favorites.map((city) => {
                  const badgeCounts = vendorCounts[city.id] ?? { submitted: 0, pending: 0 }
                  const pendingCount = badgeCounts.pending > 0 ? badgeCounts.pending : systemCounts[city.id] ?? 0
                  return (
                    <button
                      key={city.id}
                      onClick={() => navigate(`/vendor/bid/${city.id}`)}
                      className="group relative flex items-center justify-between rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <button
                          type="button"
                          aria-label={`Remove ${city.name} from favorites`}
                          className="shrink-0 rounded p-0.5 hover:bg-yellow-50"
                          onClick={(e) => handleToggleFavorite(e, city.id)}
                        >
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </button>
                        <span className="truncate">{city.state ? `${city.name}, ${city.state}` : city.name}</span>
                      </span>
                      <span className="ml-2 flex items-center gap-1">
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1f62f7] px-1 text-xs font-semibold text-white">
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
          {groupedCities.map(({ letter, cities }) => {
            if (cities.length === 0) return null
            
            return (
              <div key={letter}>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{letter}</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {cities.map((city) => {
                    const badgeCounts = vendorCounts[city.id] ?? { submitted: 0, pending: 0 }
                    const pendingCount = badgeCounts.pending > 0 ? badgeCounts.pending : systemCounts[city.id] ?? 0
                    const isFavorite = favoriteCityIds.includes(city.id)
                    return (
                      <button
                        key={city.id}
                        onClick={() => navigate(`/vendor/bid/${city.id}`)}
                        className="group relative flex items-center justify-between rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <span className="flex items-center gap-2 truncate">
                          {isFavorite ? (
                            <button
                              type="button"
                              aria-label={`Remove ${city.name} from favorites`}
                              className="shrink-0 rounded p-0.5 hover:bg-yellow-50"
                              onClick={(e) => handleToggleFavorite(e, city.id)}
                            >
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Add ${city.name} to favorites`}
                              className="shrink-0 rounded p-0.5 hover:bg-yellow-50"
                              onClick={(e) => handleToggleFavorite(e, city.id)}
                            >
                              <Star className="h-4 w-4 text-slate-300 hover:text-yellow-400" />
                            </button>
                          )}
                          <span className="truncate">{city.state ? `${city.name}, ${city.state}` : city.name}</span>
                        </span>
                        <span className="ml-2 flex items-center gap-1">
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1f62f7] px-1 text-xs font-semibold text-white">
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

