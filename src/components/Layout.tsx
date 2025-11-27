import { ReactNode } from 'react'
import { Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/context/AuthContext'
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
  backLabel = 'Back',
  showLogout = false,
  title,
  subtitle,
  fullWidth = false,
}: LayoutProps) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1f62f7] shadow-lg shadow-blue-500/30">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Drayage Bid Portal</p>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => navigate(backTo || -1)}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600"
              >
                ← {backLabel}
              </Button>
            )}
            {showLogout && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-sm font-semibold uppercase tracking-wide text-slate-600 hover:text-blue-600"
              >
                Logout →
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

