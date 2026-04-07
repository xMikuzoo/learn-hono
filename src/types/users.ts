import type z from 'zod'

import type { userPayloadSchema } from '@/schemas'

import type { Entity } from '.'

export interface User extends Entity {
  name: string
  email: string
}

export type UserPayload = z.infer<
  typeof userPayloadSchema
>
