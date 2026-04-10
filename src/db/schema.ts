import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const notes = pgTable('notes', {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  title: varchar({ length: 100 }).notNull(),
  content: text().notNull(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
})
