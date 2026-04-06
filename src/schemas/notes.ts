import z from 'zod'

export const notePayloadSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(1),
})

export const noteIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID musi być liczbą'),
})

export const notesQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(10),
})
