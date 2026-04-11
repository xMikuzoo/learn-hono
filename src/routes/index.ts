import { Hono } from 'hono'
import { jwt, type JwtVariables } from 'hono/jwt'

import { env } from '@/env'

import notesApp from './notes'
import usersApp from './users'

const api = new Hono<{
  Variables: JwtVariables
}>()

api.use(
  jwt({
    secret: env.JWT_SECRET,
    alg: 'HS256',
  }),
)

api.route('/notes', notesApp)
api.route('/users', usersApp)

export default api
