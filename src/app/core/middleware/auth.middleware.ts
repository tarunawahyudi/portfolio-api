import { AppException } from '@core/exception/app.exception'
import { extractUserFromHeader } from '@shared/util/jwt.util'
import { Context } from 'elysia'

export const authGuard = (ctx: Context): void => {
  extractUserFromHeader(ctx)
}

export const roleGuard = (allowedRoles: string[]) => {
  return (ctx: Context): void => {
    const payload = extractUserFromHeader(ctx)
    const userRole = payload.role
    if (!allowedRoles.includes(userRole)) {
      ctx.set.status = 403 // Forbidden
      throw new AppException(
        'AUTH-FORBIDDEN',
        `Forbidden: You do not have the required permission. Required roles: ${allowedRoles.join(' or ')}.`,
      )
    }
  }
}
