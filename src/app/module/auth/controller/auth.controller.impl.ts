import { AuthController } from '@module/auth/controller/auth.controller'
import { AppResponse } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { AuthService } from '@module/auth/service/auth.service'
import { Context } from 'elysia'
import { noResponse, successResponse } from '@shared/util/response.util'
import { LoginRequest } from '@module/auth/dto/auth.dto'
import { AppException } from '@core/exception/app.exception'
import { UAParser } from 'ua-parser-js'
import { CreateUserRequest } from '@module/user/dto/user.dto'
import type { UserService } from '@module/user/service/user.service'

@injectable()
export class AuthControllerImpl implements AuthController {
  constructor(
    @inject('AuthService') private authService: AuthService,
    @inject('UserService') private userService: UserService,
  ) {}

  async postSignUp(ctx: Context): Promise<AppResponse> {
    const data = ctx.body as CreateUserRequest
    const user = await this.userService.create(data)
    return successResponse(ctx, user, 'User created successfully', 201)
  }

  async postSignIn(ctx: Context): Promise<AppResponse> {
    const { body, request, server } = ctx
    const data = body as LoginRequest

    const ipAddress = server?.requestIP(request)?.address

    data.ipAddress = ipAddress ?? '127.0.0.1'
    data.userAgent = request.headers.get('user-agent') ?? undefined

    const { browser, cpu, device, os } = UAParser(data.userAgent)

    data.browser = browser.name
    data.cpu = cpu.architecture
    data.device = device.type
    data.os = os.name

    const response = await this.authService.signIn(data)

    ctx.cookie['refreshToken'].set({
      value: response.refreshToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.APP_ENV == 'production',
      maxAge: 60 * 60 * 24 * 7,
    })

    return successResponse(ctx, { accessToken: response.accessToken })
  }

  async postRefreshToken(ctx: Context): Promise<AppResponse> {
    const token = ctx.cookie['refreshToken'].value
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

    ctx.cookie['refreshToken'].remove()
    return successResponse(ctx, response)
  }

  async getEmailVerification(ctx: Context): Promise<AppResponse> {
    const { token, uid: userId } = ctx.query
    const response = await this.authService.verifyEmail(token, userId)
    return successResponse(ctx, response)
  }

  async getProfileInfo(ctx: Context): Promise<AppResponse> {
    const user = (ctx as any).user
    const userId = user.sub

    const response = await this.userService.showUserProfileByUserId(userId)
    return successResponse(ctx, response)
  }

  async requestPasswordReset(ctx: Context): Promise<AppResponse> {
    const { email } = ctx.body as { email: string }
    await this.authService.requestPasswordReset(email)
    return noResponse(ctx, `A password reset link has been sent to ${email}`)
  }

  async resetPassword(ctx: Context): Promise<AppResponse> {
    const { token, password } = ctx.body as { token: string; password: string }
    await this.authService.resetPassword(token, password)
    return noResponse(ctx, "Password has been reset successfully")
  }
}
