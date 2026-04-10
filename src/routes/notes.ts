import { eq, ilike } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '@/db'
import { notes } from '@/db/schema'
import { NoteNotFoundException } from '@/exceptions'
import { validator } from '@/middleware'
import {
  idParamSchema,
  notePayloadSchema,
  querySchema,
} from '@/schemas'

const notesApp = new Hono()

notesApp
  .get(
    '/',
    validator('query', querySchema),
    async (c) => {
      const { search, limit } =
        c.req.valid('query')

      const result = await db
        .select()
        .from(notes)
        .where(
          search
            ? ilike(notes.title, `%${search}%`)
            : undefined,
        )
        .limit(limit)

      return c.json({ data: { notes: result } })
    },
  )
  .post(
    validator('json', notePayloadSchema),
    async (c) => {
      const { title, content } =
        await c.req.valid('json')

      const [newNote] = await db
        .insert(notes)
        .values({ title, content })
        .returning()

      return c.json(
        { data: { note: newNote } },
        201,
      )
    },
  )

notesApp
  .get(
    '/:id',
    validator('param', idParamSchema),
    async (c) => {
      const id = Number(c.req.valid('param').id)

      const [result] = await db
        .select()
        .from(notes)
        .where(eq(notes.id, id))

      if (!result) {
        throw new NoteNotFoundException()
      }
      return c.json({ data: { note: result } })
    },
  )
  .put(
    validator('param', idParamSchema),
    validator('json', notePayloadSchema),
    async (c) => {
      const id = Number(c.req.valid('param').id)
      const { title, content } =
        c.req.valid('json')

      const [updated] = await db
        .update(notes)
        .set({ title, content })
        .where(eq(notes.id, id))
        .returning()

      if (!updated) {
        throw new NoteNotFoundException()
      }
      return c.json({ data: { note: updated } })
    },
  )
  .delete(
    validator('param', idParamSchema),
    async (c) => {
      const id = Number(c.req.valid('param').id)

      const [deleted] = await db
        .delete(notes)
        .where(eq(notes.id, id))
        .returning()
      if (!deleted) {
        throw new NoteNotFoundException()
      }
      return c.json({ message: 'deleted' }, 200)
    },
  )

export default notesApp
