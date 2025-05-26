import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ChevronsUpDown, Fuel, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState, type ReactNode } from 'react'
import { useReservationStore } from '@/store/reservation'
import { api } from '@/lib/network'
import type { EvStations } from '@/types/ev-stations'

export function EvStationSelect() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [stations, setStations] = useState<
    { id: string; name: string; location: string; label: ReactNode }[]
  >([])
  const stationId = useReservationStore((s) => s.stationId)
  const setStationId = useReservationStore((s) => s.setStationId)

  const { data } = useQuery({
    queryKey: ['ev-stations'],
    queryFn: async () => {
      const response = await api.get<EvStations[]>('/stations')
      return response.data
    },
  })

  useEffect(() => {
    if (data) {
      const mappedStations = data.map((station) => ({
        id: station.id.toString(),
        name: station.name,
        location: station.location,
        label: (
          <div className="flex items-center space-x-2">
            <Fuel className="inline" />
            <span>
              <span className="font-semibold">{station.name}</span> -{' '}
              {station.location} ({station.numberOfPumps} pumps)
            </span>
          </div>
        ),
      }))
      setStations(mappedStations)
    }
  }, [data])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="lg"
          aria-expanded={open}
          className="w-full justify-between bg-sky-500 hover:bg-sky-800 dark:bg-sky-700 dark:hover:bg-sky-950 hover:text-white text-white font-semibold"
        >
          {stationId ? (
            stations.find((station) => station.id === stationId)?.label
          ) : (
            <>
              <Fuel />
              Select EV station...
            </>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Search station..."
            className="h-9"
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No station found.</CommandEmpty>
            <CommandGroup>
              {stations
                .filter((station) =>
                  (station.name + ' ' + station.location)
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((station) => (
                  <CommandItem
                    key={station.id}
                    value={station.name + ' ' + station.location}
                    onSelect={() => {
                      setStationId(station.id)
                      setOpen(false)
                    }}
                  >
                    {station.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        stationId === station.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
