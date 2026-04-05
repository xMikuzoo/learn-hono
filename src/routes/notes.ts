import { Hono } from 'hono'

import type { Note, NotePayload } from '@/types/index.js'

const notes: Note[] = [
  { id: 1, content: 'this is content of my first note', title: 'first note' },
  { id: 2, content: 'this is content of my second note', title: 'second note' },
]

let nextId = 3

const noteNotFound = (c: any) => {
  return c.json({ message: 'Note not found' }, 404)
}

const notesApp = new Hono()

notesApp
  .get('/', (c) => {
    const search = c.req.query('search')
    const result =
      search === undefined
        ? notes
        : notes.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()))
    return c.json({ data: { notes: result } })
  })
  .post(async (c) => {
    const { title, content } = await c.req.json<NotePayload>()
    const newNote: Note = { id: nextId++, title, content }
    notes.push(newNote)
    return c.json({ data: { note: newNote } }, 201)
  })

notesApp
  .get('/:id', (c) => {
    const id = Number(c.req.param('id'))
    const result = notes.find((x) => x.id === id)
    return result ? c.json({ data: { note: result } }) : noteNotFound(c)
  })
  .put(async (c) => {
    const { content: newContent, title: newTitle } = await c.req.json<NotePayload>()
    const id = Number(c.req.param('id'))
    const index = notes.findIndex((x) => x.id === id)
    if (index === -1) return noteNotFound(c)
    notes[index] = { id, title: newTitle, content: newContent }
    return c.json({ data: { note: notes[index] } }, 200)
  })
  .delete((c) => {
    const id = Number(c.req.param('id'))
    const index = notes.findIndex((x) => x.id === id)
    if (index === -1) return noteNotFound(c)
    notes.splice(index, 1)
    return c.json({ message: 'deleted' }, 200)
  })

export default notesApp
