import { inject, injectable } from 'tsyringe'
import { randomBytes } from 'crypto'
import type { UserService } from '@module/user/service/user.service'
import type { UserRepository } from '@module/user/repository/user.repository'
import { CreateUserRequest, ShowUserResponse, UserSignupResponse } from '@module/user/dto/user.dto'
import config from '@core/config'
import type { EmailService } from '@core/service/email.service'
import type { EmailVerificationRepository } from '@module/auth/repository/email-verification.repository'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: UserRepository,
    @inject('EmailService') private readonly emailService: EmailService,
    @inject('EmailVerificationRepository')
    private readonly emailVerificationRepository: EmailVerificationRepository,
  ) {}

  async showByUsername(username: string): Promise<ShowUserResponse> {
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new AppException('USER-002')
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    }
  }

  private async validate(username: string, email: string): Promise<void> {
    await this.validateUsername(username)
    await this.validateEmail(email)
  }

  private async validateUsername(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username)
    if (user) throw new AppException('USER-003')
  }

  private async validateEmail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email)
    if (user) throw new AppException('USER-001')
  }

  async create(data: CreateUserRequest): Promise<UserSignupResponse> {
    await this.validate(data.username, data.email)
    const passwordHash = await Bun.password.hash(data.password, {
      algorithm: 'bcrypt',
      cost: 10,
    })

    const row = await this.userRepository.save({
      name: data.name,
      email: data.email,
      username: data.username,
      passwordHash,
    })

    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = await Bun.password.hash(rawToken, {
      algorithm: 'bcrypt',
      cost: 10,
    })

    await this.emailVerificationRepository.save({
      userId: row.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    const verifyUrl = `${config.app.baseUrl}/auth/verify?token=${rawToken}&uid=${row.id}`
    await this.emailService.sendVerificationEmail(row.email, verifyUrl)

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      username: row.username,
      status: row.status,
    }
  }
}
