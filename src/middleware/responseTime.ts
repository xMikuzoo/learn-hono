import { createMiddleware } from 'hono/factory'

export const responseTime = createMiddleware(
  async (c, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    c.header('X-Response-Time', `${ms}ms`)
  },
)
