import { AuthService } from '@module/auth/service/auth.service'
import { inject, injectable } from 'tsyringe'
import type { EmailVerificationRepository } from '@module/auth/repository/email-verification.repository'
import { AppException } from '@core/exception/app.exception'
import type { UserRepository } from '@module/user/repository/user.repository'
import { Transactional } from '@shared/decorator/transactional.decorator'

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @inject("EmailVerificationRepository") private readonly emailVerificationRepository: EmailVerificationRepository,
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  @Transactional()
  async verifyEmail(rawToken: string, userId: number): Promise<{message: string}> {
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

}
