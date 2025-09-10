import jwt from 'jsonwebtoken'
import { AppException } from '@core/exception/app.exception'
import { Context } from 'elysia'

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('JWT secrets are not defined in environment variables!')
}

export interface JwtPayload {
  sub: string
  role: string
}

export function generateTokens(payload: JwtPayload): { accessToken: string; refreshToken: string } {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as unknown as JwtPayload
  } catch (error) {
    console.error(error)
    throw new AppException('AUTH-004', 'Invalid or expired access token')
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as unknown as JwtPayload
  } catch (error) {
    console.error(error)
    throw new AppException('AUTH-005', 'Invalid or expired refresh token')
  }
}

export function extractUserFromHeader(ctx: Context) {
  const authHeader = ctx.request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppException('AUTH-000', 'Unauthorized: Access token is missing or invalid.')
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyAccessToken(token)
  ;(ctx as any).user = payload
  return payload
}
