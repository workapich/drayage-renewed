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
import { processMultipleEmails, isValidEmail } from '@/lib/utils'

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

  const processBulkInput = (value: string) => {
    // Process all comma-separated emails
    const result = processMultipleEmails(value, emails)

    if (result.valid.length === 0 && result.invalid.length === 0 && result.duplicates.length === 0) {
      return
    }

    // Add valid emails to state
    if (result.valid.length > 0) {
      setEmails((prev) => [...prev, ...result.valid])
    }

    const addedCount = result.valid.length
    const skippedCount = result.invalid.length + result.duplicates.length

    // Show feedback based on results
    if (addedCount > 0 && skippedCount === 0) {
      setFeedback(t('admin.addVendor.bulkAdded', { count: addedCount }))
    } else if (addedCount > 0 && skippedCount > 0) {
      setFeedback(
        t('admin.addVendor.bulkPartial', {
          added: addedCount,
          skipped: skippedCount,
        }),
      )
    } else if (skippedCount > 0) {
      setFeedback(t('admin.addVendor.bulkNoneAdded'))
    }

    setTimeout(() => setFeedback(null), 3000)
    setInputValue('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Check if value contains commas (bulk paste)
    if (value.includes(',')) {
      processBulkInput(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const emailValue = inputValue.trim()
      if (!emailValue) return

      // If input contains commas, process all values
      if (emailValue.includes(',')) {
        processBulkInput(emailValue)
      } else {
        // Process single email
        const trimmedEmail = emailValue.toLowerCase()
        if (trimmedEmail && !emails.includes(trimmedEmail)) {
          if (isValidEmail(trimmedEmail)) {
            setEmails((prev) => [...prev, trimmedEmail])
            setInputValue('')
          } else {
            setFeedback(t('admin.addVendor.invalidEmail'))
            setTimeout(() => setFeedback(null), 2000)
          }
        }
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

  const handleDialogChange = (value: boolean) => {
    if (!value) {
      // Reset state when closing
      setEmails([])
      setInputValue('')
      setFeedback(null)
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
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
              onChange={handleInputChange}
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

