import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import {
  noteIdParamSchema,
  notePayloadSchema,
  notesQuerySchema,
  validationHook,
} from '@/schemas'
import type { Note } from '@/types'

const notes: Note[] = [
  {
    id: 1,
    content: 'this is content of my first note',
    title: 'first note',
  },
  {
    id: 2,
    content: 'this is content of my second note',
    title: 'second note',
  },
]

let nextId = 3

const noteNotFound = (c: any) => {
  return c.json(
    { message: 'Note not found' },
    404,
  )
}

const notesApp = new Hono()

notesApp
  .get(
    '/',
    zValidator(
      'query',
      notesQuerySchema,
      validationHook,
    ),
    (c) => {
      const { search, limit } =
        c.req.valid('query')
      let result = search
        ? notes.filter((x) =>
            x.title
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
        : notes

      result = result.slice(0, limit)

      return c.json({ data: { notes: result } })
    },
  )
  .post(
    zValidator(
      'json',
      notePayloadSchema,
      validationHook,
    ),
    async (c) => {
      const { title, content } =
        await c.req.valid('json')
      const newNote: Note = {
        id: nextId++,
        title,
        content,
      }
      notes.push(newNote)
      return c.json(
        { data: { note: newNote } },
        201,
      )
    },
  )

notesApp
  .get(
    '/:id',
    zValidator(
      'param',
      noteIdParamSchema,
      validationHook,
    ),
    (c) => {
      const id = Number(c.req.valid('param').id)
      const result = notes.find(
        (x) => x.id === id,
      )
      return result
        ? c.json({ data: { note: result } })
        : noteNotFound(c)
    },
  )
  .put(
    zValidator(
      'param',
      noteIdParamSchema,
      validationHook,
    ),
    zValidator(
      'json',
      notePayloadSchema,
      validationHook,
    ),
    async (c) => {
      const id = Number(c.req.valid('param').id)
      const { title, content } =
        c.req.valid('json')
      const index = notes.findIndex(
        (x) => x.id === id,
      )
      if (index === -1) {
        return noteNotFound(c)
      }
      notes[index] = { id, title, content }
      return c.json({
        data: { note: notes[index] },
      })
    },
  )
  .delete(
    zValidator(
      'param',
      noteIdParamSchema,
      validationHook,
    ),
    (c) => {
      const id = Number(c.req.valid('param').id)
      const index = notes.findIndex(
        (x) => x.id === id,
      )
      if (index === -1) return noteNotFound(c)
      notes.splice(index, 1)
      return c.json({ message: 'deleted' }, 200)
    },
  )

export default notesApp
