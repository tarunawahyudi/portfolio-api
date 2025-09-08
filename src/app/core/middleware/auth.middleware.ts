import { Context } from 'elysia'
import { verifyAccessToken } from '@shared/util/jwt.util'
import { AppException } from '@core/exception/app.exception'

export const authGuard = (ctx: Context) => {
  const authHeader = ctx.request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppException('AUTH-010', 'Authorization header is missing or invalid')
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyAccessToken(token);
  (ctx as any).user = payload
}
