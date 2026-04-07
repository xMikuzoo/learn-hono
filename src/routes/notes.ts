import { Hono } from 'hono'

import { NoteNotFoundException } from '@/exceptions'
import { validator } from '@/middleware'
import {
  idParamSchema,
  notePayloadSchema,
  querySchema,
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

const notesApp = new Hono()

notesApp
  .get(
    '/',
    validator('query', querySchema),
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
    validator('json', notePayloadSchema),
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
    validator('param', idParamSchema),
    (c) => {
      const id = Number(c.req.valid('param').id)
      const result = notes.find(
        (x) => x.id === id,
      )
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
      const index = notes.findIndex(
        (x) => x.id === id,
      )
      if (index === -1) {
        throw new NoteNotFoundException()
      }
      notes[index] = { id, title, content }
      return c.json({
        data: { note: notes[index] },
      })
    },
  )
  .delete(
    validator('param', idParamSchema),
    (c) => {
      const id = Number(c.req.valid('param').id)
      const index = notes.findIndex(
        (x) => x.id === id,
      )
      if (index === -1) {
        throw new NoteNotFoundException()
      }
      notes.splice(index, 1)
      return c.json({ message: 'deleted' }, 200)
    },
  )

export default notesApp
