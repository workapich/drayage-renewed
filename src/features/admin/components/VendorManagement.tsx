import { useState } from 'react'
import { Ban, Trash2 } from 'lucide-react'
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
import { AddVendorModal } from './AddVendorModal'
import { useDeleteVendorMutation, useVendorStatusMutation, useVendorsQuery } from '@/lib/query-hooks'
import type { VendorStatus } from '@/types'

const statusStyles: Record<VendorStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  inactive: 'bg-amber-50 text-amber-700 border border-amber-200',
  blocked: 'bg-rose-50 text-rose-700 border border-rose-200',
}

export const VendorManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { data: vendors = [] } = useVendorsQuery()
  const statusMutation = useVendorStatusMutation()
  const deleteMutation = useDeleteVendorMutation()

  const toggleBlockStatus = (vendorId: string, currentStatus: VendorStatus) => {
    const nextStatus = currentStatus === 'blocked' ? 'active' : 'blocked'
    statusMutation.mutate({ vendorId, status: nextStatus })
  }

  const handleDelete = (vendorId: string) => {
    deleteMutation.mutate(vendorId)
  }

  return (
    <Layout showBackButton backTo="/admin/dashboard" backLabel="Back to Dashboard" showLogout fullWidth>
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin Dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Vendor Management</h2>
            <p className="text-sm text-slate-500">Manage all vendors in the system and whitelist new emails.</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-12 rounded-2xl bg-[#1f62f7] px-5 text-sm font-semibold text-white hover:bg-[#1a4fd4]"
          >
            Whitelist Vendor Email
          </Button>
        </div>

        <Card className="rounded-[32px] border border-white/70 bg-white/95 p-0 shadow-[0_35px_75px_rgba(15,23,42,0.12)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <TableHead>MC-ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Bids</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        title={vendor.status === 'blocked' ? 'Unblock vendor' : 'Block vendor'}
                        onClick={() => toggleBlockStatus(vendor.id, vendor.status)}
                        disabled={statusMutation.isPending}
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                        title="Delete vendor"
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
                    No vendors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <AddVendorModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
      </section>
    </Layout>
  )
}

