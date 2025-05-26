import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useReservationStore } from '@/store/reservation'
import { useQuery } from '@tanstack/react-query'
import type { EvStations } from '@/types/ev-stations'
import { useEffect, useState } from 'react'
import { api } from '@/lib/network'

export function PumpSelect() {
  const stationId = useReservationStore((s) => s.stationId)
  const pumpNumber = useReservationStore((s) => s.pumpNumber)
  const setPumpNumber = useReservationStore((s) => s.setPumpNumber)
  const { data } = useQuery({
    queryKey: ['ev-stations'],
    queryFn: async () => {
      const response = await api.get<EvStations[]>('/stations')
      return response.data
    },
  })
  const [numPumps, setNumPumps] = useState(0)

  useEffect(() => {
    if (data && stationId) {
      const station = data.find((d) => d.id.toString() === stationId)
      setNumPumps(station?.numberOfPumps || 0)
    }
  }, [data, stationId])

  if (!stationId) return null

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-sky-700 dark:text-sky-400 font-semibold">
        {pumpNumber ? `Selected Pump: ${pumpNumber}` : 'Select pump'}
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        {Array.from({ length: numPumps }, (_, i) => i + 1).map((pumpNum) => (
          <Button
            key={pumpNum}
            type="button"
            onClick={() => setPumpNumber(pumpNum)}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-colors',
              pumpNumber === pumpNum
                ? 'bg-sky-500 text-white border-sky-500 shadow-lg dark:shadow-sky-800 dark:bg-sky-400'
                : 'bg-white dark:bg-gray-800 text-sky-500 border-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900'
            )}
          >
            {pumpNum}
          </Button>
        ))}
      </div>
    </div>
  )
}
