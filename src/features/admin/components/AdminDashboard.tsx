import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, MapPin, Clock, TrendingUp, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Layout } from '@/components/Layout'
import { RouteCreationModal } from './RouteCreationModal'
import { getPortCities, getBidCountsByCity } from '@/lib/mock-data'
import { useStatisticsQuery } from '@/lib/query-hooks'

export const AdminDashboard = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false)
  const navigate = useNavigate()
  const cities = getPortCities()
  const bidCounts = getBidCountsByCity()
  const { data: stats } = useStatisticsQuery()

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCityDisplayName = (city: typeof cities[0]) => (city.state ? `${city.name}, ${city.state}` : city.name)

  return (
    <Layout showLogout subtitle={t('admin.dashboard.title')} fullWidth>
      <section className="mx-auto w-full max-w-6xl space-y-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-[#e4ecff] to-[#f5f7ff] p-8 shadow-[0_30px_70px_rgba(45,70,140,0.25)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-inner">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">{t('admin.dashboard.vendors.label')}</p>
                <h2 className="text-2xl font-semibold text-slate-900">{t('admin.dashboard.vendors.title')}</h2>
                <p className="text-sm text-slate-600">{t('admin.dashboard.vendors.description')}</p>
              </div>
            </div>
            <Button
              className="mt-6 h-12 w-full rounded-2xl bg-[#1f62f7] text-base font-semibold text-white hover:bg-[#1a4fd4]"
              onClick={() => navigate('/admin/vendors')}
            >
              {t('admin.dashboard.vendors.button')}
            </Button>
          </div>

          <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-[#def8eb] to-[#f5fff9] p-8 shadow-[0_30px_70px_rgba(22,163,74,0.2)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-inner">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">{t('admin.dashboard.route.label')}</p>
                <h2 className="text-2xl font-semibold text-slate-900">{t('admin.dashboard.route.title')}</h2>
                <p className="text-sm text-slate-600">{t('admin.dashboard.route.description')}</p>
              </div>
            </div>
            <Button
              className="mt-6 h-12 w-full rounded-2xl border border-emerald-300 bg-white text-base font-semibold text-emerald-700 hover:bg-emerald-50"
              variant="outline"
              onClick={() => setIsRouteModalOpen(true)}
            >
              {t('admin.dashboard.route.button')}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.1)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('admin.dashboard.totalBids.title')}</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">{stats?.totalBids ?? '—'}</p>
              </div>
              <Clock className="h-8 w-8 text-slate-300" />
            </div>
            <div className="mt-4 flex gap-8 text-sm text-slate-500">
              <span>{t('admin.dashboard.totalBids.last24h')} <strong className="text-slate-900">{stats?.bidsLast24h ?? '—'}</strong></span>
              <span>{t('admin.dashboard.totalBids.last7d')} <strong className="text-slate-900">{stats?.bidsLast7d ?? '—'}</strong></span>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.1)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('admin.dashboard.activeRoutes.title')}</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">{stats?.activeRoutes ?? '—'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-300" />
            </div>
            <p className="mt-4 text-sm text-slate-500">{t('admin.dashboard.activeRoutes.description')}</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_35px_75px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{t('admin.dashboard.viewRates.label')}</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{t('admin.dashboard.viewRates.title')}</h3>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder={t('admin.dashboard.viewRates.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-2xl border-slate-200 pl-12"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredCities.map((city) => {
              const bidCount = bidCounts[city.id] || 0
              const displayName = getCityDisplayName(city)
              return (
                <button
                  key={city.id}
                  onClick={() => navigate(`/admin/rates/${city.id}`)}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
                >
                  <span>{displayName}</span>
                  <span className="mt-1 text-xs font-medium text-slate-400">{t('admin.dashboard.viewRates.bidsCount', { count: bidCount })}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <RouteCreationModal open={isRouteModalOpen} onOpenChange={setIsRouteModalOpen} />
    </Layout>
  )
}

