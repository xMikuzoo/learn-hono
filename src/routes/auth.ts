import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '@/db'
import { users } from '@/db/schema'
import { hashPassword } from '@/lib/password'
import { validator } from '@/middleware'
import { authSchema } from '@/schemas/auth'

const authApp = new Hono()

authApp.post(
  '/register',
  validator('json', authSchema),
  async (c) => {
    const { email, password } =
      c.req.valid('json')

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))

    if (existing) {
      return c.json(
        {
          success: false,
          error: {
            code: 409,
            message: 'Email already exists',
          },
        },
        409,
      )
    }

    const passwordHash =
      await hashPassword(password)

    const [user] = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
      })

    return c.json({ data: { user } }, 201)
  },
)

export default authApp
