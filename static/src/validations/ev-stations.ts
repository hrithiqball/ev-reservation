import { z } from 'zod'

const createEvStationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  numberOfPumps: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number, received a string',
  }),
})

const updateEvStationSchema = createEvStationSchema.extend({
  id: z.number().int().positive('ID must be a positive integer'),
})

type CreateEvStationSchema = z.infer<typeof createEvStationSchema>
type UpdateEvStationSchema = z.infer<typeof updateEvStationSchema>

export {
  createEvStationSchema,
  updateEvStationSchema,
  type CreateEvStationSchema,
  type UpdateEvStationSchema,
}
