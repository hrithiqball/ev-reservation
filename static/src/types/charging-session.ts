import type { EvStations } from './ev-stations'
import type { User } from './user'
import type { Vehicle } from './vehicle'

export interface ChargingSession {
  id: number
  user: User
  vehicle: Vehicle
  station: EvStations
  pumpNumber: number
  isCompleted: boolean
  isReserved: boolean
  isCharging: boolean
  startTime: string
}

export interface ChargingSessionPage {
  content: ChargingSession[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
}
