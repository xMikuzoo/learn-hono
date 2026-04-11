import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { sign } from 'hono/jwt'

import { db } from '@/db'
import { users } from '@/db/schema'
import { env } from '@/env'
import {
  hashPassword,
  verifyPassword,
} from '@/lib/password'
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

authApp.post(
  '/login',
  validator('json', authSchema),
  async (c) => {
    const { email, password } =
      c.req.valid('json')

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: 401,
            message: 'Invalid credentials',
          },
        },
        401,
      )
    }

    const valid = await verifyPassword(
      password,
      user.passwordHash,
    )

    if (!valid) {
      return c.json(
        {
          success: false,
          error: {
            code: 401,
            message: 'Invalid credentials',
          },
        },
        401,
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const token = await sign(
      {
        sub: user.id,
        exp: now + 60 * 60 * 24,
      },
      env.JWT_SECRET,
      'HS256',
    )

    return c.json({
      data: { token },
    })
  },
)

export default authApp
