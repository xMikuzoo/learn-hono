import z from 'zod'

export const notePayloadSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(1),
})
