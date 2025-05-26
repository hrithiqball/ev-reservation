import { Car, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReservationStore } from '@/store/reservation'
import type { Vehicle } from '@/types/vehicle'
import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '@/hooks/use-current-user'
import { api } from '@/lib/network'

export function CarSelect() {
  const user = useCurrentUser()
  const vehicleId = useReservationStore((s) => s.vehicleId)
  const setVehicleId = useReservationStore((s) => s.setVehicleId)
  const pumpNumber = useReservationStore((s) => s.pumpNumber)

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['vehicles', user?.id],
    queryFn: async () => {
      const response = await api.get<Vehicle[]>('/vehicles', {
        params: { ownerId: user?.isAdmin ? undefined : user?.id },
      })
      return response.data
    },
  })

  if (!pumpNumber) return null

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full space-x-2">
        <Loader2 className="animate-spin" />
      </div>
    )

  if (isError)
    return (
      <div className="text-red-500">
        Error loading vehicles:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-4">
      <div className="w-full flex flex-wrap gap-4 justify-center">
        {data.map((vehicle) => (
          <div
            key={vehicle.id}
            className={cn(
              'flex flex-col items-center justify-center p-4 rounded-lg border-2 shadow transition-colors cursor-pointer min-w-[140px] min-h-[120px] bg-white dark:bg-gray-800',
              vehicleId === vehicle.id
                ? 'border-sky-500 ring-1 ring-sky-300 dark:ring-sky-600 bg-sky-50 dark:bg-sky-900 '
                : 'border-gray-200 dark:border-gray-700 hover:border-sky-400'
            )}
            onClick={() => setVehicleId(vehicle.id)}
          >
            <Car className="w-8 h-8 mb-2 text-sky-500" />
            <div className="font-semibold text-gray-800 dark:text-white text-center">
              {vehicle.make} - {vehicle.model}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-300 text-center">
              {vehicle.plateNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
