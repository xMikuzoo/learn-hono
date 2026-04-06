import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'

import {
  requestId,
  responseTime,
} from '@/middleware'
import notesApp from '@/routes/notes'

const app = new Hono()
  .use(logger())
  .use(cors())
  .use(requestId)
  .use(responseTime)
// .use('/api/*', apiKeyAuth)

app.route('/api/notes', notesApp)

app.get('/test', (c) => {
  return c.json({
    message: 'This is a test endpoint',
    requestId: c.get('requestId'),
  })
})
app.get('/api/test-auth', (c) => {
  return c.json({
    message:
      'You shoulnd get this message if u are not authorized',
    requestId: c.get('requestId'),
  })
})

app.get('/api/debug/error', () => {
  throw new Error('Simulated server crash')
})

app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: { code: 404, message: 'Not Found' },
    },
    404,
  )
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        error: {
          code: err.status,
          message: err.message,
        },
      },
      err.status,
    )
  }
  console.error(err)
  return c.json(
    {
      success: false,
      error: {
        code: 500,
        message: 'Internal Server Error',
      },
    },
    500,
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
