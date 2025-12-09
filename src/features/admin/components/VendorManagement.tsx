import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Ban, Trash2, CheckCircle2, ShieldCheck, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Layout } from '@/components/Layout'
import { AddVendorModal } from './AddVendorModal'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useDeleteVendorMutation,
  useVendorStatusMutation,
  useVendorWhitelistPermissionMutation,
  useVendorsQuery,
} from '@/lib/query-hooks'
import { isValidEmail, processMultipleEmails } from '@/lib/utils'
import type { VendorStatus } from '@/types'

const statusStyles: Record<VendorStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  inactive: 'bg-amber-50 text-amber-700 border border-amber-200',
  blocked: 'bg-rose-50 text-rose-700 border border-rose-200',
}

export const VendorManagement = () => {
  const { t } = useTranslation()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const { data: vendors = [] } = useVendorsQuery()
  const statusMutation = useVendorStatusMutation()
  const deleteMutation = useDeleteVendorMutation()
  const whitelistMutation = useVendorWhitelistPermissionMutation()

  const grantableVendors = useMemo(
    () => vendors.filter((vendor) => !vendor.canWhitelistVendors),
    [vendors],
  )

  const selectedVendors = useMemo(
    () => vendors.filter((vendor) => selectedVendorIds.includes(vendor.id)),
    [vendors, selectedVendorIds],
  )

  const toggleBlockStatus = (vendorId: string, currentStatus: VendorStatus) => {
    const nextStatus = currentStatus === 'blocked' ? 'active' : 'blocked'
    statusMutation.mutate({ vendorId, status: nextStatus })
  }

  const handleDelete = (vendorId: string) => {
    deleteMutation.mutate(vendorId)
  }

  const toggleWhitelistPrivilege = (vendorId: string, canWhitelistVendors?: boolean) => {
    whitelistMutation.mutate({ vendorId, canWhitelistVendors: !canWhitelistVendors })
  }

  const processVendorValue = (searchValue: string): { success: boolean; message?: string } => {
    const trimmedValue = searchValue.trim()
    if (!trimmedValue) return { success: false }

    // Check if input is an email and validate it
    const isEmail = isValidEmail(trimmedValue)
    const searchLower = trimmedValue.toLowerCase()

    // Try to find vendor by email or MC-ID in all vendors
    const vendor = vendors.find((v) => {
      if (isEmail) {
        // For emails, do exact match (case-insensitive)
        return v.email.toLowerCase() === searchLower
      } else {
        // For MC-IDs, allow exact match or partial match
        return (
          v.mcid.toLowerCase() === searchLower ||
          v.mcid.toLowerCase().includes(searchLower) ||
          v.email.toLowerCase().includes(searchLower)
        )
      }
    })

    if (!vendor) {
      return { success: false, message: t('admin.vendors.bulkWhitelist.notFound') }
    }

    // Skip if vendor already has permission
    if (vendor.canWhitelistVendors) {
      return { success: false, message: t('admin.vendors.bulkWhitelist.alreadyHasPermission') }
    }

    // Add vendor if not already selected
    if (selectedVendorIds.includes(vendor.id)) {
      return { success: false, message: t('admin.vendors.bulkWhitelist.alreadySelected') }
    }

    setSelectedVendorIds((prev) => [...prev, vendor.id])
    return { success: true }
  }

  const processBulkInput = (value: string) => {
    // Use utility function to process emails
    const existingEmails = vendors
      .filter((v) => selectedVendorIds.includes(v.id))
      .map((v) => v.email.toLowerCase())
    const emailResult = processMultipleEmails(value, existingEmails)

    // Process valid emails
    let successCount = 0
    let skippedCount = 0
    const messages: string[] = []

    // Process valid emails
    emailResult.valid.forEach((email) => {
      const result = processVendorValue(email)
      if (result.success) {
        successCount++
      } else if (result.message) {
        skippedCount++
        if (!messages.includes(result.message)) {
          messages.push(result.message)
        }
      }
    })

    // Handle invalid emails
    if (emailResult.invalid.length > 0) {
      skippedCount += emailResult.invalid.length
      const invalidMessage = `${emailResult.invalid.length} invalid email(s) skipped`
      if (!messages.includes(invalidMessage)) {
        messages.push(invalidMessage)
      }
    }

    // Handle duplicate emails
    if (emailResult.duplicates.length > 0) {
      skippedCount += emailResult.duplicates.length
      const duplicateMessage = `${emailResult.duplicates.length} duplicate email(s) skipped`
      if (!messages.includes(duplicateMessage)) {
        messages.push(duplicateMessage)
      }
    }

    // Also process non-email values (MC-IDs) that might be in the input
    const allValues = value.split(',').map((v) => v.trim()).filter((v) => v.length > 0)
    const nonEmailValues = allValues.filter(
      (val) => !isValidEmail(val) && !emailResult.valid.includes(val.toLowerCase()),
    )

    nonEmailValues.forEach((val) => {
      const result = processVendorValue(val)
      if (result.success) {
        successCount++
      } else if (result.message) {
        skippedCount++
        if (!messages.includes(result.message)) {
          messages.push(result.message)
        }
      }
    })

    // Show feedback based on results
    if (successCount > 0 && skippedCount === 0) {
      setFeedback(t('admin.vendors.bulkWhitelist.bulkAdded', { count: successCount }))
    } else if (successCount > 0 && skippedCount > 0) {
      setFeedback(
        t('admin.vendors.bulkWhitelist.bulkPartial', {
          added: successCount,
          skipped: skippedCount,
        }),
      )
    } else if (skippedCount > 0) {
      setFeedback(messages[0] || t('admin.vendors.bulkWhitelist.bulkNoneAdded'))
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
      const searchValue = inputValue.trim()
      if (!searchValue) return

      // If input contains commas, process all values
      if (searchValue.includes(',')) {
        processBulkInput(searchValue)
      } else {
        // Process single value
        const result = processVendorValue(searchValue)
        if (result.message) {
          setFeedback(result.message)
          setTimeout(() => setFeedback(null), 2000)
        }
        if (result.success) {
          setInputValue('')
        }
      }
    }
  }

  const handleRemoveVendor = (vendorId: string) => {
    setSelectedVendorIds((prev) => prev.filter((id) => id !== vendorId))
  }

  const handleCSVImport = () => {
    setFeedback(t('admin.vendors.bulkWhitelist.csvNotAvailable'))
  }

  const handleBulkGrant = async () => {
    if (selectedVendorIds.length === 0) return

    try {
      // Filter out vendors that already have permission (safety check)
      const vendorsToGrant = selectedVendorIds.filter((vendorId) => {
        const vendor = vendors.find((v) => v.id === vendorId)
        return vendor && !vendor.canWhitelistVendors
      })

      if (vendorsToGrant.length === 0) {
        setFeedback(t('admin.vendors.bulkWhitelist.allAlreadyHavePermission'))
        setTimeout(() => setFeedback(null), 2000)
        return
      }

      await Promise.all(
        vendorsToGrant.map((vendorId) =>
          whitelistMutation.mutateAsync({ vendorId, canWhitelistVendors: true }),
        ),
      )
      setFeedback(t('admin.vendors.bulkWhitelist.permissionsGranted', { count: vendorsToGrant.length }))
      setSelectedVendorIds([])
      setInputValue('')
      setTimeout(() => {
        setFeedback(null)
        setIsBulkModalOpen(false)
      }, 800)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : t('admin.vendors.bulkWhitelist.error'))
    }
  }

  const handleBulkModalClose = (open: boolean) => {
    if (!open) {
      setSelectedVendorIds([])
      setInputValue('')
      setFeedback(null)
    }
    setIsBulkModalOpen(open)
  }

  return (
    <Layout showBackButton backTo="/admin/dashboard" backLabel={t('admin.vendors.backToDashboard')} showLogout fullWidth>
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{t('admin.dashboard.title')}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{t('admin.vendors.title')}</h2>
            <p className="text-sm text-slate-500">{t('admin.vendors.description')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsBulkModalOpen(true)}
              className="h-12 rounded-2xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              {t('admin.vendors.bulkWhitelistButton')}
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="h-12 rounded-2xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              {t('admin.vendors.whitelistButton')}
            </Button>
          </div>
        </div>

        <Card className="rounded-[32px] border border-white/70 bg-white/95 p-0 shadow-[0_35px_75px_rgba(15,23,42,0.12)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <TableHead>{t('admin.vendors.table.mcid')}</TableHead>
                <TableHead>{t('admin.vendors.table.email')}</TableHead>
                <TableHead>{t('admin.vendors.table.status')}</TableHead>
                <TableHead>{t('admin.vendors.table.totalBids')}</TableHead>
                <TableHead>{t('admin.vendors.table.joined')}</TableHead>
                <TableHead className="text-right">{t('admin.vendors.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id} className="border-b border-slate-50">
                  <TableCell className="text-sm font-semibold text-slate-900">{vendor.mcid}</TableCell>
                  <TableCell className="text-sm text-slate-600">{vendor.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[vendor.status]}`}>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{vendor.totalBids}</TableCell>
                  <TableCell className="text-sm text-slate-500">{vendor.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                          vendor.status === 'blocked'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                            : 'border-rose-100 bg-rose-50 text-rose-600'
                        }`}
                        title={vendor.status === 'blocked' ? t('admin.vendors.actions.unblock') : t('admin.vendors.actions.block')}
                        onClick={() => toggleBlockStatus(vendor.id, vendor.status)}
                        disabled={statusMutation.isPending}
                      >
                        {vendor.status === 'blocked' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                          vendor.canWhitelistVendors
                            ? 'border-blue-100 bg-blue-50 text-blue-600'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        title={
                          vendor.canWhitelistVendors
                            ? t('admin.vendors.actions.revokeWhitelist')
                            : t('admin.vendors.actions.grantWhitelist')
                        }
                        aria-label={
                          vendor.canWhitelistVendors
                            ? t('admin.vendors.actions.revokeWhitelist')
                            : t('admin.vendors.actions.grantWhitelist')
                        }
                        onClick={() => toggleWhitelistPrivilege(vendor.id, vendor.canWhitelistVendors)}
                        disabled={whitelistMutation.isPending}
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </button>
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                        title={t('admin.vendors.actions.delete')}
                        onClick={() => handleDelete(vendor.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {vendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                    {t('admin.vendors.noVendors')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <AddVendorModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        <Dialog open={isBulkModalOpen} onOpenChange={handleBulkModalClose}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-semibold text-slate-900">
                {t('admin.vendors.bulkWhitelistTitle')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder={t('admin.vendors.bulkWhitelist.placeholder')}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="h-12 rounded-2xl border-slate-200"
                />
                <p className="text-xs text-slate-500">{t('admin.vendors.bulkWhitelist.hint')}</p>
              </div>

              {selectedVendors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600"
                    >
                      <span>{vendor.email}</span>
                      <button
                        onClick={() => handleRemoveVendor(vendor.id)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label={t('admin.vendors.bulkWhitelist.removeVendor')}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Button variant="outline" className="h-11 w-full rounded-2xl" onClick={handleCSVImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t('admin.vendors.bulkWhitelist.importButton')}
                </Button>
                <p className="text-xs text-slate-500">{t('admin.vendors.bulkWhitelist.importHint')}</p>
              </div>

              {grantableVendors.length === 0 && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  {t('admin.vendors.bulkWhitelistEmpty')}
                </div>
              )}

              {feedback && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                  {feedback}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleBulkModalClose(false)} className="rounded-2xl">
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleBulkGrant}
                disabled={selectedVendorIds.length === 0 || whitelistMutation.isPending}
                className="rounded-2xl bg-primary px-6 text-white hover:bg-primary-hover"
              >
                {t('admin.vendors.bulkWhitelistConfirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </Layout>
  )
}

