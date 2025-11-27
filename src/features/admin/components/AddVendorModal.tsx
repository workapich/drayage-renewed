import { useState } from 'react'
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
import { storage } from '@/lib/storage'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-hooks'

interface AddVendorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const generateId = () => (crypto.randomUUID?.() ?? `v-${Date.now()}`)
const generateMcid = () => `MC-${Math.floor(100000 + Math.random() * 900000)}`

export const AddVendorModal = ({ open, onOpenChange }: AddVendorModalProps) => {
  const [emails, setEmails] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const queryClient = useQueryClient()

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
    setFeedback('CSV import is not available in the mock environment.')
  }

  const handleAdd = () => {
    const existing = new Set(storage.getVendors().map((vendor) => vendor.email.toLowerCase()))
    const newEmails = emails.filter((email) => !existing.has(email))

    if (newEmails.length === 0) {
      setFeedback('All provided emails are already registered.')
      return
    }

    newEmails.forEach((email) => {
      storage.upsertVendor({
        id: generateId(),
        mcid: generateMcid(),
        email,
        status: 'active',
        totalBids: 0,
        joinedDate: new Date().toLocaleDateString('en-US'),
      })
    })

    queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
    setFeedback(`${newEmails.length} vendor${newEmails.length > 1 ? 's' : ''} added.`)
    setEmails([])
    setInputValue('')
    setTimeout(() => {
      setFeedback(null)
      onOpenChange(false)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-slate-900">
            Add New Vendor(s)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Email Address"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 rounded-2xl border-slate-200"
            />
            <p className="text-xs text-slate-500">Press Enter or comma to add multiple emails.</p>
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
              Import from CSV
            </Button>
            <p className="text-xs text-slate-500">Upload a CSV file with email addresses (one per line or comma-separated).</p>
          </div>

          {feedback && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              {feedback}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-2xl">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={emails.length === 0}
            className="rounded-2xl bg-[#1f62f7] px-6 text-white hover:bg-[#1a4fd4]"
          >
            Add Vendor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

