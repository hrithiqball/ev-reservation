import { create } from 'zustand'

interface ReservationState {
  stationId: string | null
  setStationId: (id: string | null) => void
  pumpNumber: number | null
  setPumpNumber: (num: number | null) => void
  vehicleId: number | null
  setVehicleId: (id: number | null) => void
  isReserving: boolean
  setIsReserving: (isReserving: boolean) => void
  resetValues: () => void
}

export const useReservationStore = create<ReservationState>((set) => ({
  stationId: null,
  setStationId: (id) =>
    set({ stationId: id, pumpNumber: null, vehicleId: null }),
  pumpNumber: null,
  setPumpNumber: (num) => set({ pumpNumber: num, vehicleId: null }),
  vehicleId: null,
  setVehicleId: (id) => set({ vehicleId: id }),
  isReserving: false,
  setIsReserving: (isReserving) => set({ isReserving }),
  resetValues: () =>
    set({ stationId: null, pumpNumber: null, vehicleId: null })
}))
