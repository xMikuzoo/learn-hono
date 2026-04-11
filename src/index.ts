import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'

import { env } from '@/env'
import {
  requestId,
  responseTime,
} from '@/middleware'
import api from '@/routes'

import authApp from './routes/auth'

const app = new Hono()
  .use(logger())
  .use(cors())
  .use(requestId)
  .use(responseTime)

app.route('/auth', authApp)
app.route('/api', api)

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
  { fetch: app.fetch, port: env.PORT },
  (info) => {
    console.log(
      `Server is running on http://localhost:${info.port}`,
    )
  },
)
