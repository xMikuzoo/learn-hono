import { Hono } from 'hono'

import notesApp from './notes'

const api = new Hono()

api.route('/notes', notesApp)

export default api
