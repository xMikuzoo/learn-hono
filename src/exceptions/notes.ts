import { HTTPException } from 'hono/http-exception'

export class NoteNotFoundException extends HTTPException {
  constructor() {
    super(404, { message: 'Note not found' })
  }
}
