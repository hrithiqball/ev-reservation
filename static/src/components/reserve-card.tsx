import { Card, CardContent } from '@/components/ui/card'
import { EvStationSelect } from '@/components/ev-station-select'
import { PumpSelect } from '@/components/pump-select'
import { CarSelect } from '@/components/car-select'
import { Button } from '@/components/ui/button'
import { useReservationStore } from '@/store/reservation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/network'
import { useCurrentUser } from '@/hooks/use-current-user'
import { toast } from 'sonner'

export function ReserveCard() {
  const [openPopover, setOpenPopover] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  const user = useCurrentUser()
  const vehicleId = useReservationStore((s) => s.vehicleId)
  const stationId = useReservationStore((s) => s.stationId)
  const pumpNumber = useReservationStore((s) => s.pumpNumber)
  const setIsReserving = useReservationStore((s) => s.setIsReserving)
  const resetValues = useReservationStore((s) => s.resetValues)

  const reserveChargingMutation = useMutation({
    mutationFn: async (isReserved: boolean) => {
      await api.post('/charging-sessions', {
        userId: user?.id,
        vehicleId,
        stationId,
        pumpNumber,
        isReserved,
        startTime: date ? date.toISOString() : new Date().toISOString(),
      })

      return isReserved
    },
    onSuccess: (isReserved) => {
      toast.success(
        `Charging session ${isReserved ? 'reserved' : 'started'} successfully!`
      )

      if (!isReserved) {
        setIsReserving(true)
      }

      resetValues()
    },
    onError: (error) => {
      toast.error(`Failed to reserve charging session: ${error.message}`)
    },
  })

  function handleStart() {
    reserveChargingMutation.mutate(false)
  }

  function handleReserve() {
    reserveChargingMutation.mutate(true)
    setOpenPopover(false)
  }
  return (
    <Card>
      <CardContent className="flex justify-center items-center flex-col space-y-4">
        <span className="text-gray-600 dark:text-white font-semibold">
          Choose EV Station you would like to reserve
        </span>
        <EvStationSelect />
        <PumpSelect />
        <CarSelect />
        <div className="flex items-center space-x-2">
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" disabled={!vehicleId || !pumpNumber}>
                Reserve
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date" className="px-1">
                      Date
                    </Label>
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-32 justify-between font-normal"
                        >
                          {date ? format(date, 'dd/MM/yyyy') : 'Select date'}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate(date)
                            setOpenCalendar(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="time" className="px-1">
                      Time
                    </Label>
                    <Input
                      type="time"
                      id="time"
                      step="1"
                      defaultValue="10:30:00"
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                </div>
                <Button onClick={handleReserve}>Confirm Reserve</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button disabled={!vehicleId || !pumpNumber} onClick={handleStart}>
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
