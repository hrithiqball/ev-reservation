import type { User } from "./user"

export interface Vehicle {
  id: number
  make: string
  model: string
  plateNumber: string
  batteryCapacity: number
  owner?: User
}
