import { drizzle } from 'drizzle-orm/singlestore'
import postgres from 'postgres'

import { env } from '@/env'

const client = postgres(env.DATABASE_URL)

export const db = drizzle(client)
