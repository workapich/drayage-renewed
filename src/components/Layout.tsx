import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

interface LayoutProps {
  children: ReactNode
  showBackButton?: boolean
  backTo?: string
  backLabel?: string
  showLogout?: boolean
  title?: string
  subtitle?: string
  fullWidth?: boolean
}

export const Layout = ({
  children,
  showBackButton = false,
  backTo,
  backLabel,
  showLogout = false,
  title,
  subtitle,
  fullWidth = false,
}: LayoutProps) => {
  const { t } = useTranslation()
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const defaultBackLabel = backLabel ?? t('common.back')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary shadow-lg shadow-blue-500/30">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{t('common.appName')}</p>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (backTo) {
                    navigate(backTo)
                  } else {
                    navigate(-1)
                  }
                }}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600"
              >
                ← {defaultBackLabel}
              </Button>
            )}
            {user?.role === 'vendor' && user.canWhitelistVendors && (
              <Button
                variant="ghost"
                onClick={() => navigate('/vendor/vendors')}
                className="text-sm font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700"
              >
                {t('vendor.whitelist.linkLabel')}
              </Button>
            )}
            {showLogout && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-sm font-semibold uppercase tracking-wide text-slate-600 hover:text-blue-600"
              >
                {t('common.logout')}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl flex-col px-4 py-10 sm:px-6">
        {title && (
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        )}

        <div
          className={clsx(
            'w-full',
            !fullWidth &&
              'rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)] backdrop-blur',
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

