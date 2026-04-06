import { zValidator } from '@hono/zod-validator'
import type {
  Context,
  ValidationTargets,
} from 'hono'
import type { ZodType } from 'zod'

const validationHook = (
  result: {
    success: boolean
    error?: {
      issues: Array<{
        path: PropertyKey[]
        message: string
      }>
    }
  },
  c: Context,
) => {
  if (!result.success && result.error) {
    return c.json(
      {
        success: false,
        errors: result.error.issues.map(
          (issue) => ({
            path: issue.path
              .map(String)
              .join('.'),
            message: issue.message,
          }),
        ),
      },
      400,
    )
  }
}

export const validator = <
  Target extends keyof ValidationTargets,
  Schema extends ZodType,
>(
  target: Target,
  schema: Schema,
) => zValidator(target, schema, validationHook)
