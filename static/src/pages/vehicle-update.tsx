import { useParams } from 'react-router'

export function VehicleUpdate() {
  const { id } = useParams()

  return <div>VehicleUpdate {id}</div>
}
