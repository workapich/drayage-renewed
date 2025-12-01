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
import { getPortCities, cities } from '@/lib/mock-data'
import { useCreateRouteMutation } from '@/lib/query-hooks'

interface RouteCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPortId?: string
}

export const RouteCreationModal = ({ open, onOpenChange, defaultPortId }: RouteCreationModalProps) => {
  const { t } = useTranslation()
  const [startingCity, setStartingCity] = useState<string>(defaultPortId ?? '')
  const [endingCity, setEndingCity] = useState<string>('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const portCities = getPortCities()
  const availableInlandCities = cities.filter((c) => c.isInland)
  const createRouteMutation = useCreateRouteMutation()

  const portCityOptions = portCities.map((city) => ({
    value: city.id,
    label: `${city.name}, ${city.state ?? ''}`.trim(),
  }))

  const inlandCityOptions = availableInlandCities.map((city) => ({
    value: city.id,
    label: `${city.name}, ${city.state ?? ''}`.trim(),
  }))

  useEffect(() => {
    if (defaultPortId) {
      setStartingCity(defaultPortId)
    }
  }, [defaultPortId, open])

  const closeModal = () => {
    onOpenChange(false)
    setFeedback(null)
    setEndingCity('')
    if (!defaultPortId) {
      setStartingCity('')
    }
  }

  const handleCreate = async () => {
    if (!startingCity || !endingCity) return
    try {
      await createRouteMutation.mutateAsync({ portCityId: startingCity, inlandCityId: endingCity })
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
                {t('admin.routeCreation.startingCity')}
              </label>
              <Combobox
                options={portCityOptions}
                value={startingCity}
                onChange={setStartingCity}
                placeholder={t('admin.routeCreation.startingCityPlaceholder')}
                className="h-12 rounded-2xl border-slate-200"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="ending-city" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('admin.routeCreation.endingCity')}
            </label>
            <Combobox
              options={inlandCityOptions}
              value={endingCity}
              onChange={setEndingCity}
              placeholder={t('admin.routeCreation.endingCityPlaceholder')}
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
            disabled={!startingCity || !endingCity || createRouteMutation.isPending}
            className="rounded-2xl bg-[#1f62f7] px-6 text-white hover:bg-[#2352d6]"
          >
            {createRouteMutation.isPending ? t('admin.routeCreation.createButtonLoading') : t('admin.routeCreation.createButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

