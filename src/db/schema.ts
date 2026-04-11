import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

const ENTITY_COLUMNS = {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
} as const

export const users = pgTable('users', {
  ...ENTITY_COLUMNS,
  email: varchar({ length: 255 })
    .notNull()
    .unique(),
  passwordHash: text('password_hash').notNull(),
})

export const notes = pgTable('notes', {
  ...ENTITY_COLUMNS,
  title: varchar({ length: 100 }).notNull(),
  content: text().notNull(),
})
