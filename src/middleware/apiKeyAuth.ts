import { createMiddleware } from 'hono/factory'

export const apiKeyAuth = createMiddleware(
  async (c, next) => {
    const apikey = c.req.header('X-API-Key')
    if (apikey === 'my-secret-key-123') {
      await next()
    } else {
      return c.json(
        {
          message: 'Unauthorized',
        },
        401,
      )
    }
  },
)
