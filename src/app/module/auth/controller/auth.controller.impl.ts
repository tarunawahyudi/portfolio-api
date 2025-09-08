import { AuthController } from '@module/auth/controller/auth.controller'
import { AppResponse } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { AuthService } from '@module/auth/service/auth.service'
import { Context } from 'elysia'
import { successResponse } from '@shared/util/response.util'

@injectable()
export class AuthControllerImpl implements AuthController {
  constructor(
    @inject("AuthService") private authService: AuthService,
  ) {}

  async getEmailVerification(ctx: Context): Promise<AppResponse> {
    const { token, uid } = ctx.query
    const userId = Number(uid)
    const response = await this.authService.verifyEmail(token, userId)
    return successResponse(ctx, response)
  }
}
