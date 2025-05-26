export interface Vehicle {
  id: number
  make: string
  model: string
  plateNumber: string
  batteryCapacity: number
  owner?: {
    id: number
    name?: string
  }
}
