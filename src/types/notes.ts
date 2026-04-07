import type z from 'zod'

import type { notePayloadSchema } from '@/schemas'

import type { Entity } from '.'

export interface Note extends Entity {
  title: string
  content: string
}

export type NotePayload = z.infer<
  typeof notePayloadSchema
>
