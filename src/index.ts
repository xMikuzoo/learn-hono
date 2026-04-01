import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Witaj w moim api!')
})

app.get('/about', (c) => {
  return c.html('<h1>O Api</h1><p>To moje pierwsze api w hono</p>')
})

app.get('/api/status', (c) => {
  return c.json({
    status: 'ok',
    timeStamp: new Date(),
  })
})

app.post('/api/echo', (c) => {
  return c.json({
    message: 'Echo endpoint gotowy',
  })
})

app.notFound((c) => {
  return c.json(
    {
      message: 'Nie znaleziono',
    },
    404,
  )
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
