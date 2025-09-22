import { inject, injectable } from 'tsyringe'
import { randomBytes } from 'crypto'
import type { UserService } from '@module/user/service/user.service'
import type { UserRepository } from '@module/user/repository/user.repository'
import { CreateUserRequest, ShowUserResponse, UserSignupResponse } from '@module/user/dto/user.dto'
import config from '@core/config'
import type { EmailService } from '@core/service/email.service'
import type { EmailVerificationRepository } from '@module/auth/repository/email-verification.repository'
import { AppException } from '@core/exception/app.exception'
import { ProfileResponse, UpdateProfileRequest } from '@module/user/dto/profile.dto'
import type { ProfileRepository } from '@module/user/repository/profile.repository'
import { Transactional } from '@shared/decorator/transactional.decorator'
import { StorageService } from '@core/service/storage.service'
import { cdnUrl } from '@shared/util/common.util'
import { logger } from '@sentry/bun'
import { toProfileResponse } from '@module/user/mapper/profile.mapper'
import { verifyCaptcha } from '@lib/captcha'

@injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @inject('StorageService') private readonly storageService: StorageService,
    @inject('EmailService') private readonly emailService: EmailService,
    @inject('UserRepository') private readonly userRepository: UserRepository,
    @inject('EmailVerificationRepository') private readonly emailVerificationRepository: EmailVerificationRepository,
    @inject('ProfileRepository') private readonly profileRepository: ProfileRepository
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

  @Transactional()
  async create(request: any, clientIp: string | undefined): Promise<UserSignupResponse> {
    await verifyCaptcha(request.captchaToken, clientIp)
    const data = request as CreateUserRequest
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

    await this.profileRepository.save({
      userId: row.id,
      fullName: row.name,
      displayName: row.name,
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

  async showUserProfileByUserId(userId: string): Promise<ProfileResponse> {
    const row = await this.profileRepository.findByUserId(userId)
    if (!row) throw new AppException('USER-002')
    return {
      userId: row.userId,
      email: row.email,
      address: row.address ?? '',
      bio: row.bio ?? '',
      displayName: row.displayName ?? '',
      avatarUrl: cdnUrl(row.avatar) ?? '',
      fullName: row.fullName ?? '',
      phoneNumber: row.phoneNumber ?? '',
      socials: row.socials ?? {},
      hobbies: row.hobbies ?? [],
      website: row.website ?? '',
      jobTitle: row.jobTitle ?? '',
    }
  }

  async updateProfile(userId: string, request: UpdateProfileRequest): Promise<ProfileResponse> {
    const row = await this.profileRepository.update(userId, request)
    if (!row) throw new AppException('DB-002')
    return toProfileResponse(row)
  }

  async uploadAvatar(userId: string, avatarFile: File): Promise<{ avatarUrl: string }> {
    const profile = await this.profileRepository.findByUserId(userId)
    if (!profile) throw new AppException('USER-002')
    const oldAvatar = profile.avatar

    const { key: newImageKey } = await this.storageService.upload({
      file: avatarFile,
      module: 'user',
      collection: 'avatar',
    })

    try {
      await this.profileRepository.updateAvatar(userId, newImageKey)
      if (oldAvatar) {
        logger.info(`Deleting old avatar image: ${oldAvatar}`)
        this.storageService
          .delete(oldAvatar)
          .catch((err) => logger.error(`Failed to delete old image ${oldAvatar}`, err))
      }

      return { avatarUrl: cdnUrl(newImageKey) ?? '' }
    } catch (dbError) {
      logger.error(`Database update failed. Rolling back storage upload for key: ${newImageKey}`)
      console.error(dbError)
      await this.storageService
        .delete(newImageKey)
        .catch((err) => logger.error(`Failed to rollback (delete) new image ${newImageKey}`, err))

      throw dbError
    }
  }

  async changePassword(userId: string, oldPass: string, newPass: string): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user || !user.passwordHash) throw new AppException('AUTH-002')

    const isMatch = await Bun.password.verify(oldPass, user.passwordHash)
    if (!isMatch) throw new AppException('AUTH-011')

    const newPasswordHash = await Bun.password.hash(newPass)
    await this.userRepository.updatePassword(userId, newPasswordHash)
  }
}
