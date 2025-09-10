import { AppResponse } from '@shared/type/global'
import { Context } from 'elysia'

export interface AuthController {
  postSignUp(ctx: Context): Promise<AppResponse>
  postSignIn(ctx: Context): Promise<AppResponse>
  getEmailVerification(ctx: Context): Promise<AppResponse>
  postRefreshToken(ctx: Context): Promise<AppResponse>
  getProfileInfo(ctx: Context): Promise<AppResponse>
}
