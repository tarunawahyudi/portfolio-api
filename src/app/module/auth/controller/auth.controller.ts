import { AppResponse } from '@shared/type/global'
import { Context } from 'elysia'

export interface AuthController {
  getEmailVerification(ctx: Context): Promise<AppResponse>
}
