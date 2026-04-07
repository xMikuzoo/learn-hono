import { HTTPException } from 'hono/http-exception'

export class UserNotFoundException extends HTTPException {
  constructor() {
    super(404, { message: 'User not found' })
  }
}
