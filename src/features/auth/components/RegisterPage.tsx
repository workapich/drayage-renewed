import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Hash, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../hooks/useAuth'

export const RegisterPage = () => {
  const { t } = useTranslation()
  const [mcid, setMcid] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await register(mcid.trim(), email.trim().toLowerCase(), password)
      navigate('/confirm-email', { state: { email: email.trim().toLowerCase() } })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.register.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-blue-500/30">
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
            <p className="text-sm text-slate-500">{t('auth.register.tagline')}</p>
          </div>
        </div>
        <Button variant="ghost" className="text-sm font-semibold text-slate-600" onClick={() => navigate('/login')}>
          {t('auth.login.backToLogin')}
        </Button>
      </div>

      <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_35px_65px_rgba(15,23,42,0.12)] backdrop-blur">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/90 shadow-inner">
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3M5 7a4 4 0 108 0 4 4 0 00-8 0zM3 21a6 6 0 1112 0H3z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900">{t('auth.register.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('auth.register.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="mcid" className="text-sm font-medium text-slate-700">
                    {t('auth.register.mcid')}
                  </Label>
                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="mcid"
                      type="text"
                      placeholder={t('auth.register.mcidPlaceholder')}
                      value={mcid}
                      onChange={(e) => setMcid(e.target.value.toUpperCase())}
                      className="h-12 border-slate-200 pl-10 text-base uppercase tracking-wider"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    {t('auth.register.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.register.emailPlaceholder')}
                      value={email}
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-slate-200 pl-10 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    {t('auth.register.password')}
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('auth.register.passwordPlaceholder')}
                      value={password}
                      autoComplete="new-password"
                      minLength={6}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-slate-200 pl-10 text-base"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500">{t('auth.register.passwordHint')}</p>
                </div>

                <Button type="submit" className="mt-2 h-12 w-full text-base font-semibold" disabled={isLoading}>
                  {isLoading ? t('auth.register.buttonLoading') : t('auth.register.button')}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full border-slate-200 text-base font-semibold"
                  onClick={() => navigate('/login')}
                >
                  {t('auth.login.backToLogin')}
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

