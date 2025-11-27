import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../context/AuthContext'

export const EmailConfirmationPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const { confirmEmail } = useAuth()
  const email = (location.state as { email?: string })?.email

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true })
      return
    }
    inputRefs.current[0]?.focus()
  }, [email, navigate])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
      setCode(newCode)
      const nextIndex = Math.min(pastedData.length, 5)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setError('')

    const codeString = code.join('')
    if (codeString.length !== 6) {
      setError('Please enter a 6-digit code.')
      return
    }

    setIsLoading(true)
    try {
      await confirmEmail(email, codeString)
      navigate('/login', {
        replace: true,
        state: { message: 'Email confirmed! You can now log in.' },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid confirmation code. Please try again.')
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
            <p className="text-lg font-semibold text-slate-900">Drayage Bid Portal</p>
            <p className="text-sm text-slate-500">One last step to activate your access</p>
          </div>
        </div>
        <Button variant="ghost" className="text-sm font-semibold text-slate-600" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </div>

      <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center px-4 pb-16">
        <div className="w-full max-w-lg rounded-3xl border border-white/70 bg-white/90 p-10 text-center shadow-[0_35px_65px_rgba(15,23,42,0.12)] backdrop-blur">
          <Card className="border-0 shadow-none">
            <CardHeader className="space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1f62f7] shadow-inner">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900">Enter Confirmation Code</CardTitle>
              <CardDescription className="text-base">
                {email ? `We've sent a 6-digit code to ${email}` : 'Awaiting email...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      inputMode="numeric"
                      aria-label={`Digit ${index + 1}`}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="h-14 w-14 rounded-2xl border-slate-200 text-center text-lg font-semibold"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full text-base font-semibold"
                  disabled={isLoading || code.join('').length !== 6}
                >
                  {isLoading ? 'Confirming...' : 'Confirm Email'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <p className="mt-8 text-center text-xs uppercase tracking-wider text-slate-400">
            © 2025 Drayage Services. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  )
}

