import z from 'zod'

export { notePayloadSchema } from './notes'
export { userPayloadSchema } from './users'

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID musi być liczbą'),
})

export const querySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(10),
})
