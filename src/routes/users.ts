import { Hono } from 'hono'

import { UserNotFoundException } from '@/exceptions'
import { validator } from '@/middleware'
import {
  idParamSchema,
  querySchema,
  userPayloadSchema,
} from '@/schemas'
import type { User } from '@/types'

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  },
]

let nextId = 3

const usersApp = new Hono()

usersApp
  .get(
    '/',
    validator('query', querySchema),
    (c) => {
      const { search, limit } =
        c.req.valid('query')
      let result = search
        ? users.filter((x) => {
            const term = search.toLowerCase()
            return (
              x.name
                .toLowerCase()
                .includes(term) ||
              x.email.toLowerCase().includes(term)
            )
          })
        : users

      result = result.slice(0, limit)
      return c.json({ data: { users: result } })
    },
  )
  .post(
    validator('json', userPayloadSchema),
    async (c) => {
      const { name, email } =
        await c.req.valid('json')
      const newUser: User = {
        id: nextId++,
        name,
        email,
      }
      users.push(newUser)
      return c.json(
        { data: { user: newUser } },
        201,
      )
    },
  )

usersApp
  .get(
    '/:id',
    validator('param', idParamSchema),
    (c) => {
      const id = Number(c.req.valid('param').id)
      const result = users.find(
        (x) => x.id === id,
      )
      if (!result) {
        throw new UserNotFoundException()
      }
      return c.json({ data: { user: result } })
    },
  )
  .put(
    validator('param', idParamSchema),
    validator('json', userPayloadSchema),
    async (c) => {
      const id = Number(c.req.valid('param').id)
      const { name, email } = c.req.valid('json')
      const index = users.findIndex(
        (x) => x.id === id,
      )
      if (index === -1) {
        throw new UserNotFoundException()
      }
      users[index] = { id, name, email }
      return c.json({
        data: { user: users[index] },
      })
    },
  )
  .delete(
    validator('param', idParamSchema),
    (c) => {
      const id = Number(c.req.valid('param').id)
      const index = users.findIndex(
        (x) => x.id === id,
      )
      if (index === -1) {
        throw new UserNotFoundException()
      }
      users.splice(index, 1)
      return c.json({ message: 'deleted' }, 200)
    },
  )

export default usersApp
