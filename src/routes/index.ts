import { Hono } from 'hono'

import notesApp from './notes'
import usersApp from './users'

const api = new Hono()

api.route('/notes', notesApp)
api.route('/users', usersApp)

export default api
