import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useVendorsQuery, useAddVendorMutation } from '@/lib/query-hooks'

interface AddVendorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  createdByVendorId?: string
}


export const AddVendorModal = ({ open, onOpenChange, createdByVendorId }: AddVendorModalProps) => {
  const { t } = useTranslation()
  const [emails, setEmails] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const { data: vendors = [] } = useVendorsQuery()
  const addVendorMutation = useAddVendorMutation()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const email = inputValue.trim().toLowerCase()
      if (email && !emails.includes(email)) {
        setEmails((prev) => [...prev, email])
        setInputValue('')
      }
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails((prev) => prev.filter((email) => email !== emailToRemove))
  }

  const handleCSVImport = () => {
    setFeedback(t('admin.addVendor.csvNotAvailable'))
  }

  const handleAdd = async () => {
    const existing = new Set(vendors.map((vendor) => vendor.email.toLowerCase()))
    const newEmails = emails.filter((email) => !existing.has(email))

    if (newEmails.length === 0) {
      setFeedback(t('admin.addVendor.allEmailsRegistered'))
      return
    }

    try {
      await Promise.all(
        newEmails.map((email) => addVendorMutation.mutateAsync({ email, createdByVendorId })),
      )
      setFeedback(t('admin.addVendor.vendorsAdded', { count: newEmails.length }))
      setEmails([])
      setInputValue('')
      setTimeout(() => {
        setFeedback(null)
        onOpenChange(false)
      }, 800)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : t('admin.addVendor.error'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-slate-900">
            {t('admin.addVendor.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder={t('admin.addVendor.emailPlaceholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 rounded-2xl border-slate-200"
            />
            <p className="text-xs text-slate-500">{t('admin.addVendor.emailHint')}</p>
          </div>

          {emails.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600"
                >
                  <span>{email}</span>
                  <button onClick={() => handleRemoveEmail(email)} className="text-blue-500 hover:text-blue-700">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Button variant="outline" className="h-11 w-full rounded-2xl" onClick={handleCSVImport}>
              <Upload className="mr-2 h-4 w-4" />
              {t('admin.addVendor.importButton')}
            </Button>
            <p className="text-xs text-slate-500">{t('admin.addVendor.importHint')}</p>
          </div>

          {feedback && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              {feedback}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-2xl">
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={emails.length === 0}
            className="rounded-2xl bg-primary px-6 text-white hover:bg-primary-hover"
          >
            {t('admin.addVendor.addButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

