import { z } from 'zod'

export const createVehicleSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  plateNumber: z.string().min(1, { message: 'Plate number is required' }),
  batteryCapacity: z
    .string()
    .min(1, { message: 'Battery capacity is required' })
    .regex(/^\d+$/, { message: 'Battery capacity must be a number' }),
})

export const updateVehicleSchema = createVehicleSchema

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>
export type UpdateVehicleSchema = z.infer<typeof updateVehicleSchema>
