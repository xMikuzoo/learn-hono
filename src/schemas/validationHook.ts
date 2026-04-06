import type { Context } from 'hono'

export const validationHook = (
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
