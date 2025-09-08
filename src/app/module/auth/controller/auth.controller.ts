import { AppResponse } from '@shared/type/global'
import { Context } from 'elysia'

export interface AuthController {
  getEmailVerification(ctx: Context): Promise<AppResponse>
  postRefreshToken(ctx: Context): Promise<AppResponse>
  postSignIn(ctx: Context): Promise<AppResponse>
}
