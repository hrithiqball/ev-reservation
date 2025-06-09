import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCurrentUser } from '@/hooks/use-current-user'
import { api } from '@/lib/network'
import type { Vehicle } from '@/types/vehicle'
import { useQuery } from '@tanstack/react-query'
import { Car, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'

export function Vehicles() {
  const user = useCurrentUser()
  const navigate = useNavigate()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['vehicles', user?.id],
    queryFn: async () => {
      const response = await api.get<Vehicle[]>('/vehicles', {
        params: { ownerId: user?.isAdmin ? undefined : user?.id },
      })
      return response.data
    },
  })

  function navigateCreate() {
    navigate('/vehicles/create')
  }

  function navigateUpdate(id: number) {
    navigate(`/vehicles/update/${id}`)
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
        Error loading vehicles: {error.message}
      </div>
    )

  return (
    <div className="flex flex-col space-y-4">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg">Registered vehicles</h1>
          <Button onClick={navigateCreate} variant="outline">
            <Car />
            Register Vehicle
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Plate Number</TableHead>
              <TableHead>Battery Capacity</TableHead>
              {user?.isAdmin && <TableHead>Owner</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                onClick={() => navigateUpdate(vehicle.id)}
                className="cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-950"
              >
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.plateNumber}</TableCell>
                <TableCell>{vehicle.batteryCapacity}</TableCell>
                {user?.isAdmin && (
                  <TableCell>{vehicle?.owner?.name ?? '-'}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
