import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import type { Note, NotePayload } from './types/index.js'

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

const app = new Hono()

app
  .get('/api/notes', (c) => {
    const search = c.req.query('search')
    const result =
      search === undefined
        ? notes
        : notes.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()))
    return c.json({
      data: {
        notes: result,
      },
    })
  })
  .post(async (c) => {
    const { title, content } = await c.req.json<NotePayload>()
    const newNote: Note = {
      id: notes.length + 1,
      title,
      content,
    }
    notes.push(newNote)
    return c.json(
      {
        data: {
          note: newNote,
        },
      },
      201,
    )
  })

app.get('/api/notes/:id', (c) => {
  const id = Number(c.req.param('id'))
  const result = notes.find((x) => x.id === id)
  return result
    ? c.json({
        data: {
          note: result,
        },
      })
    : c.json(
        {
          error: 'Note not found',
        },
        404,
      )
})

app.notFound((c) => {
  return c.json(
    {
      message: 'Nie znaleziono',
    },
    404,
  )
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
