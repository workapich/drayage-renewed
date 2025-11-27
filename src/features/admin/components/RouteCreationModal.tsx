import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getPortCities, cities } from '@/lib/mock-data'
import { useCreateRouteMutation } from '@/lib/query-hooks'

interface RouteCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPortId?: string
}

export const RouteCreationModal = ({ open, onOpenChange, defaultPortId }: RouteCreationModalProps) => {
  const [startingCity, setStartingCity] = useState<string>(defaultPortId ?? '')
  const [endingCity, setEndingCity] = useState<string>('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const portCities = getPortCities()
  const availableInlandCities = cities.filter((c) => c.isInland)
  const createRouteMutation = useCreateRouteMutation()

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
      setFeedback('Route created successfully.')
      setTimeout(() => {
        closeModal()
      }, 600)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Unable to create route.')
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
            Create New Route
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Starting City</p>
            <Select value={startingCity} onValueChange={setStartingCity}>
              <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                <SelectValue placeholder="Select port city" />
              </SelectTrigger>
              <SelectContent>
                {portCities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Ending City</p>
            <Select value={endingCity} onValueChange={setEndingCity} disabled={!startingCity}>
              <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                <SelectValue placeholder="Select inland city" />
              </SelectTrigger>
              <SelectContent>
                {availableInlandCities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {feedback && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {feedback}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal} disabled={createRouteMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!startingCity || !endingCity || createRouteMutation.isPending}
            className="rounded-2xl bg-[#1f62f7] px-6 text-white hover:bg-[#2352d6]"
          >
            {createRouteMutation.isPending ? 'Creating...' : 'Create Route'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

