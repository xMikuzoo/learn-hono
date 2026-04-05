import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { requestId } from '@/middleware/requestId.js'
import { responseTime } from '@/middleware/responseTime.js'
import notesApp from '@/routes/notes.js'

const app = new Hono()
  .use(logger())
  .use(cors())
  .use(requestId)
  .use(responseTime)

app.route('/api/notes', notesApp)

app.get('/test', (c) => {
  return c.json({
    message: 'This is a test endpoint',
    requestId: c.get('requestId'),
  })
})

app.notFound((c) => {
  return c.json(
    { message: 'Nie znaleziono' },
    404,
  )
})

serve(
  { fetch: app.fetch, port: 3000 },
  (info) => {
    console.log(
      `Server is running on http://localhost:${info.port}`,
    )
  },
)
