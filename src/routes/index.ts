import { Hono } from 'hono'
import { jwt, type JwtVariables } from 'hono/jwt'

import { env } from '@/env'

import notesApp from './notes'

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

api.get('/me', (c) =>
  c.json({
    data: { userId: c.get('jwtPayload').sub },
  }),
)

export default api
