import { AuthController } from '@module/auth/controller/auth.controller'
import { AppResponse } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { AuthService } from '@module/auth/service/auth.service'
import { Context } from 'elysia'
import { successResponse } from '@shared/util/response.util'
import { LoginRequest } from '@module/auth/dto/auth.dto'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class AuthControllerImpl implements AuthController {
  constructor(@inject('AuthService') private authService: AuthService) {}

  async postSignIn(ctx: Context): Promise<AppResponse> {
    const { body, request, server } = ctx
    const data = body as LoginRequest

    const ipAddress = server?.requestIP(request)?.address

    data.ipAddress = ipAddress ?? '127.0.0.1'
    data.userAgent = request.headers.get('user-agent') ?? undefined

    const response = await this.authService.signIn(data)
    return successResponse(ctx, response)
  }

  async postRefreshToken(ctx: Context): Promise<AppResponse> {
    const token = ctx.cookie.refreshToken.value
    if (!token) {
      throw new AppException('AUTH-008', 'Refresh token not found')
    }
    const response = await this.authService.refreshToken(token)
    return successResponse(ctx, response)
  }

  async postSignOut(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) {
      throw new AppException('AUTH-001', 'User not authenticated')
    }
    const response = await this.authService.signOut(userId)
    ctx.cookie.refreshToken.remove()
    return successResponse(ctx, response)
  }

  async getEmailVerification(ctx: Context): Promise<AppResponse> {
    const { token, uid } = ctx.query
    const userId = Number(uid)
    const response = await this.authService.verifyEmail(token, userId)
    return successResponse(ctx, response)
  }
}
