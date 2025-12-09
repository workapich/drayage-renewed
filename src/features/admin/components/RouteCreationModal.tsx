import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { getPortRampRegions, cities } from '@/lib/mock-data'
import { useCreateRouteMutation } from '@/lib/query-hooks'

interface RouteCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPortId?: string
}

export const RouteCreationModal = ({ open, onOpenChange, defaultPortId }: RouteCreationModalProps) => {
  const { t } = useTranslation()
  const [startingPortRampRegion, setStartingPortRampRegion] = useState<string>(defaultPortId ?? '')
  const [endingInlandLocation, setEndingInlandLocation] = useState<string>('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const portRampRegions = getPortRampRegions()
  const availableInlandLocations = cities.filter((c) => c.isInland)
  const createRouteMutation = useCreateRouteMutation()

  const portRampRegionOptions = portRampRegions.map((portRampRegion) => ({
    value: portRampRegion.id,
    label: `${portRampRegion.name}, ${portRampRegion.state ?? ''}`.trim(),
  }))

  const inlandLocationOptions = availableInlandLocations.map((inlandLocation) => ({
    value: inlandLocation.id,
    label: `${inlandLocation.name}, ${inlandLocation.state ?? ''}`.trim(),
  }))

  useEffect(() => {
    if (defaultPortId) {
      setStartingPortRampRegion(defaultPortId)
    }
  }, [defaultPortId, open])

  const closeModal = () => {
    onOpenChange(false)
    setFeedback(null)
    setEndingInlandLocation('')
    if (!defaultPortId) {
      setStartingPortRampRegion('')
    }
  }

  const handleCreate = async () => {
    if (!startingPortRampRegion || !endingInlandLocation) return
    try {
      await createRouteMutation.mutateAsync({ portRampRegionId: startingPortRampRegion, inlandLocationId: endingInlandLocation })
      setFeedback(t('admin.routeCreation.success'))
      setTimeout(() => {
        closeModal()
      }, 600)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : t('admin.routeCreation.error'))
    }
  }

  const handleDialogChange = (value: boolean) => {
    if (!value) {
      closeModal()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-slate-900">
            {t('admin.routeCreation.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!defaultPortId && (
            <div className="space-y-2">
              <label htmlFor="starting-city" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('admin.routeCreation.portRampRegion')}
              </label>
              <Combobox
                options={portRampRegionOptions}
                value={startingPortRampRegion}
                onChange={setStartingPortRampRegion}
                placeholder={t('admin.routeCreation.portRampRegionPlaceholder')}
                className="h-12 rounded-2xl border-slate-200"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="ending-inland-location" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('admin.routeCreation.inlandLocation')}
            </label>
            <Combobox
              options={inlandLocationOptions}
              value={endingInlandLocation}
              onChange={setEndingInlandLocation}
              placeholder={t('admin.routeCreation.inlandLocationPlaceholder')}
              className="h-12 rounded-2xl border-slate-200"
            />
          </div>

          {feedback && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {feedback}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal} disabled={createRouteMutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!startingPortRampRegion || !endingInlandLocation || createRouteMutation.isPending}
            className="rounded-2xl bg-primary px-6 text-white hover:bg-primary-hover"
          >
            {createRouteMutation.isPending ? t('admin.routeCreation.createButtonLoading') : t('admin.routeCreation.createButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

