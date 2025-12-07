import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Ban, CheckCircle2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AddVendorModal } from '@/features/admin/components/AddVendorModal'
import {
  useDeleteVendorMutation,
  useVendorStatusMutation,
  useVendorsQuery,
} from '@/lib/query-hooks'
import type { VendorStatus } from '@/types'

const statusStyles: Record<VendorStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  inactive: 'bg-amber-50 text-amber-700 border border-amber-200',
  blocked: 'bg-rose-50 text-rose-700 border border-rose-200',
}

export const VendorWhitelistPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { data: vendors = [] } = useVendorsQuery()
  const statusMutation = useVendorStatusMutation()
  const deleteMutation = useDeleteVendorMutation()

  useEffect(() => {
    if (!user?.canWhitelistVendors) {
      navigate('/vendor/cities', { replace: true })

    }
  }, [navigate, user?.canWhitelistVendors])

  const createdVendors = useMemo(() => {
    if (!user?.vendorId) return []
    return vendors.filter((vendor) => vendor.createdByVendorId === user.vendorId)
  }, [user?.vendorId, vendors])

  const toggleBlockStatus = (vendorId: string, currentStatus: VendorStatus) => {
    const nextStatus = currentStatus === 'blocked' ? 'active' : 'blocked'
    statusMutation.mutate({ vendorId, status: nextStatus })
  }

  const handleDelete = (vendorId: string) => {
    deleteMutation.mutate(vendorId)
  }

  return (
    <Layout
      showBackButton
      backTo="/vendor/cities"
      backLabel={t('vendor.whitelist.backToCities')}
      showLogout
      fullWidth
    >
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('vendor.whitelist.title')}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {t('vendor.whitelist.heading')}
            </h2>
            <p className="text-sm text-slate-500">{t('vendor.whitelist.description')}</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-12 rounded-2xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {t('vendor.whitelist.whitelistButton')}
          </Button>
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
              {createdVendors.map((vendor) => (
                <TableRow key={vendor.id} className="border-b border-slate-50">
                  <TableCell className="text-sm font-semibold text-slate-900">{vendor.mcid}</TableCell>
                  <TableCell className="text-sm text-slate-600">{vendor.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[vendor.status]}`}
                    >
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
                        title={
                          vendor.status === 'blocked'
                            ? t('admin.vendors.actions.unblock')
                            : t('admin.vendors.actions.block')
                        }
                        aria-label={
                          vendor.status === 'blocked'
                            ? t('admin.vendors.actions.unblock')
                            : t('admin.vendors.actions.block')
                        }
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                        title={t('admin.vendors.actions.delete')}
                        aria-label={t('admin.vendors.actions.delete')}
                        onClick={() => handleDelete(vendor.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {createdVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                    {t('vendor.whitelist.noVendors')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <AddVendorModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          createdByVendorId={user?.vendorId}
        />
      </section>
    </Layout>
  )
}


