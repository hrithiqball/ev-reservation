import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/network'
import type { EvStations } from '@/types/ev-stations'
import { useQuery } from '@tanstack/react-query'
import { HousePlug, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'

export function EvStations() {
  const navigate = useNavigate()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['ev-stations'],
    queryFn: async () => {
      const response = await api.get<EvStations[]>('/stations')
      return response.data
    },
  })

  function navigateCreate() {
    navigate('/ev-stations/create')
  }

  function navigateUpdate(id: number) {
    navigate(`/ev-stations/update/${id}`)
  }

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full space-x-2">
        <Loader2 className="animate-spin" />
      </div>
    )

  if (isError)
    return (
      <div className="text-red-500">
        Error loading EV stations: {error.message}
      </div>
    )

  return (
    <div className="flex flex-col space-y-4">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg">Registered stations</h1>
          <Button onClick={navigateCreate} variant="outline">
            <HousePlug />
            Register Station
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Number Of Pump</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((station) => (
              <TableRow
                key={station.id}
                onClick={() => navigateUpdate(station.id)}
                className="cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-950"
              >
                <TableCell>{station.name}</TableCell>
                <TableCell>{station.location}</TableCell>
                <TableCell>{station.numberOfPumps}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
