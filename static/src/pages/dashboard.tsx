import { Card, CardContent } from '@/components/ui/card'
import { EvStationSelect } from '@/components/ev-station-select'
import { PumpSelect } from '@/components/pump-select'
import { CarSelect } from '@/components/car-select'
import { Button } from '@/components/ui/button'
import { useReservationStore } from '@/store/reservation'

function handleStart() {
  const { stationId, pumpNumber, vehicleId } = useReservationStore.getState()
  console.log('start', { stationId, pumpNumber, vehicleId })
}

export function Dashboard() {
  const vehicleId = useReservationStore((s) => s.vehicleId)
  const pumpNumber = useReservationStore((s) => s.pumpNumber)

  return (
    <div className="flex flex-1 flex-col space-y-4 justify-center items-center">
      <Card>
        <CardContent className="flex justify-center items-center flex-col space-y-4">
          <span className="text-gray-600 dark:text-white font-semibold">
            Choose EV Station you would like to reserve
          </span>
          <EvStationSelect />
          <PumpSelect />
          <CarSelect />
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              disabled={!vehicleId || !pumpNumber}
              onClick={handleStart}
            >
              Reserve
            </Button>
            <Button disabled={!vehicleId || !pumpNumber} onClick={handleStart}>
              Start
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
