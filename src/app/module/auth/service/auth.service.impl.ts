import { AuthService } from '@module/auth/service/auth.service'
import { inject, injectable } from 'tsyringe'
import type { EmailVerificationRepository } from '@module/auth/repository/email-verification.repository'
import { AppException } from '@core/exception/app.exception'
import type { UserRepository } from '@module/user/repository/user.repository'
import { Transactional } from '@shared/decorator/transactional.decorator'
import { ForgotPasswordRequest, LoginRequest, LoginResponse } from '@module/auth/dto/auth.dto'
import type { AuthRepository } from '@module/auth/repository/auth.repository'
import { generateTokens, verifyRefreshToken } from '@shared/util/jwt.util'
import {
  addMinutes,
  generateRandomToken,
  getReadableLockDuration,
  hashData,
} from '@shared/util/common.util'
import type { EmailService } from '@core/service/email.service'
import { verifyCaptcha } from '@lib/captcha'

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @inject("EmailService") private readonly emailService: EmailService,
    @inject("AuthRepository") private authRepository: AuthRepository,
    @inject("EmailVerificationRepository") private readonly emailVerificationRepository: EmailVerificationRepository,
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  @Transactional()
  async verifyEmail(rawToken: string, userId: string): Promise<{message: string}> {
    const verification = await this.emailVerificationRepository.findLatestValid(userId)
    if (!verification) {
      throw new AppException('EMAIL-VERIFY-001', 'Invalid or expired verification link')
    }
    const match = await Bun.password.verify(rawToken, verification.tokenHash)
    if (!match) {
      throw new AppException('EMAIL-VERIFY-002', 'Invalid token')
    }

    await this.userRepository.markVerified(userId)
    await this.emailVerificationRepository.markUsed(verification.id)

    return {
      message: 'Email verification link was successfully verified',
    }
  }

  async signIn(data: LoginRequest): Promise<LoginResponse> {
    await verifyCaptcha(data.captchaToken, data.ipAddress)
    const user = await this.authRepository.findByEmailOrUsername(data.usernameOrEmail)

    if (!user) {
      throw new AppException('AUTH-001')
    }

    if (!user.isVerified) {
      throw new AppException('AUTH-006')
    }

    if (user.status != 'active') {
      throw new AppException('AUTH-007')
    }

    if (user.lockUntil && user.lockUntil <= new Date()) {
      await this.authRepository.resetFailedAttempts(user.id)
      user.failedAttempts = 0
      user.lockUntil = null
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppException('AUTH-003',
        `Account is locked for 3 minutes. Try again in ${getReadableLockDuration(user.lockUntil)}`)
    }

    const isMatch = await Bun.password.verify(data.password, user.passwordHash)
    if (!isMatch) {
      const attempts = user.failedAttempts + 1
      let lockUntil: Date | undefined

      if (attempts >= 3) {
        lockUntil = new Date(Date.now() + 3 * 60 * 1000)
      }

      await this.authRepository.updateFailedAttempt(user.id, attempts, lockUntil)
      await this.authRepository.logAttempt({
        userId: user.id,
        success: false,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        browser: data.browser,
        cpu: data.cpu,
        device: data.device,
        os: data.os
      })

      throw new AppException("AUTH-001", "Invalid credentials")
    }

    await this.authRepository.resetFailedAttempts(user.id)
    await this.authRepository.logAttempt({
      userId: user.id,
      success: true,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      browser: data.browser,
      cpu: data.cpu,
      device: data.device,
      os: data.os
    })

    const payload = { sub: user.id }
    const { accessToken, refreshToken } = generateTokens(payload)

    const hashedRefreshToken = await Bun.password.hash(refreshToken)
    await this.authRepository.updateRefreshToken(user.id, hashedRefreshToken)

    return {
      accessToken, refreshToken
    }
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    const payload = verifyRefreshToken(token)
    const user = await this.authRepository.findById(payload.sub)

    if (!user || !user.currentHashedRefreshToken) {
      throw new AppException('AUTH-004', 'Access denied. Please login again.')
    }

    const isTokenMatch = await Bun.password.verify(token, user.currentHashedRefreshToken)
    if (!isTokenMatch) {
      throw new AppException('AUTH-005', 'Refresh token is revoked or invalid.')
    }
    const newPayload = { sub: user.id }
    const { accessToken } = generateTokens(newPayload)

    return { accessToken }
  }

  async signOut(userId: string): Promise<{ message: string }> {
    await this.authRepository.updateRefreshToken(userId, null)
    return { message: 'Successfully signed out' }
  }

  async requestPasswordReset(request:ForgotPasswordRequest, clientIp?: string): Promise<void> {
    await verifyCaptcha(request.captchaToken, clientIp)
    const user = await this.authRepository.findByEmailOrUsername(request.email)

    if (user) {
      const token = generateRandomToken(32)
      const tokenHash = hashData(token)
      const expiresAt = addMinutes(15)

      await this.authRepository.createPasswordResetToken({
        userId: user.id,
        tokenHash,
        expiresAt,
      })

      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`
      await this.emailService.sendPasswordResetEmail(user.email, user.name, resetUrl)
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = hashData(token)
    const result = await this.authRepository.findPasswordReset(tokenHash)
    if (!result) throw new AppException("AUTH-008")

    const { token: resetToken, user } = result

    if (resetToken.isUsed) throw new AppException('AUTH-010')

    if (new Date > resetToken.expiresAt) {
      await this.authRepository.deletePasswordResetToken(resetToken.id)
      throw new AppException("AUTH-009")
    }

    const newPasswordHash = await Bun.password.hash(newPassword)
    await this.authRepository.markPasswordResetTokenAsUsed(resetToken.id)
    await this.userRepository.updatePassword(user.id, newPasswordHash)
  }
}
