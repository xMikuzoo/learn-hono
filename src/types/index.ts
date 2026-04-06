import type z from 'zod'

import { notePayloadSchema } from '@/schemas'

export interface Note {
  id: number
  title: string
  content: string
}

export type NotePayload = z.infer<
  typeof notePayloadSchema
>
