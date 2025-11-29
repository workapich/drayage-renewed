import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../hooks/useAuth'

export const LoginPage = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const initialMessage = useMemo(
    () => (location.state as { message?: string })?.message ?? '',
    [location.state],
  )

  useEffect(() => {
    if (initialMessage) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [initialMessage, location.pathname, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/vendor/cities', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.login.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f62f7] shadow-lg shadow-blue-500/30">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h13l5 5-5 5H3V7z"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{t('common.appName')}</p>
            <p className="text-sm text-slate-500">{t('common.tagline')}</p>
          </div>
        </div>
        <Button variant="ghost" className="text-sm font-semibold text-slate-600" onClick={() => navigate('/register')}>
          {t('auth.login.registerButton')}
        </Button>
      </div>

      <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_35px_65px_rgba(15,23,42,0.12)] backdrop-blur">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1f62f7] shadow-inner">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900">{t('auth.login.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('auth.login.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {initialMessage && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {initialMessage}
                  </div>
                )}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    {t('auth.login.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t('auth.login.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-slate-200 pl-10 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    {t('auth.login.password')}
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder={t('auth.login.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-slate-200 pl-10 text-base"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="mt-2 h-12 w-full text-base font-semibold" disabled={isLoading}>
                  {isLoading ? t('auth.login.buttonLoading') : t('auth.login.button')}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase text-slate-400">
                    <span className="bg-white px-2">{t('common.or')}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full border-slate-200 text-base font-semibold"
                  onClick={() => navigate('/register')}
                >
                  {t('auth.login.registerButton')}
                </Button>
              </form>
            </CardContent>
          </Card>
          <p className="mt-8 text-center text-xs uppercase tracking-wider text-slate-400">
            {t('common.copyright')}
          </p>
        </div>
      </main>
    </div>
  )
}

