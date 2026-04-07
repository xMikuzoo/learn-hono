import z from 'zod'

export const userPayloadSchema = z.object({
  name: z.string(),
  email: z.email(),
})
