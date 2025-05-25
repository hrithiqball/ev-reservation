import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useNavigate } from 'react-router'

const dummyVehicles = [
  { id: 1, name: 'Toyota Corolla', year: 2020 },
  { id: 2, name: 'Honda Civic', year: 2019 },
  { id: 3, name: 'Ford Focus', year: 2021 },
]

export function Vehicle() {
  const navigate = useNavigate()

  function navigateCreate() {
    navigate('/vehicles/create')
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg">Registered vehicles</h1>
        <Button onClick={navigateCreate}>Register New Vehicle</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Year</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.name}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
