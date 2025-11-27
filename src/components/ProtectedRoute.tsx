import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'vendor' | 'admin'
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-gradient">
        <div className="rounded-2xl border border-white/60 bg-white/90 px-6 py-4 text-sm font-medium text-slate-600 shadow-[0_30px_60px_rgba(15,23,42,0.12)]">
          Loading portal…
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

