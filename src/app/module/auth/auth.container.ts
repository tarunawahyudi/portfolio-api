import { container } from 'tsyringe'
import { EmailVerificationRepository } from '@module/auth/repository/email-verification.repository'
import { EmailVerificationRepositoryImpl } from '@module/auth/repository/impl/email-verification.repository.impl'
import { AuthService } from '@module/auth/service/auth.service'
import { AuthServiceImpl } from '@module/auth/service/auth.service.impl'
import { AuthControllerImpl } from '@module/auth/controller/auth.controller.impl'
import { AuthController } from '@module/auth/controller/auth.controller'
import { AuthRepository } from '@module/auth/repository/auth.repository'
import { AuthRepositoryImpl } from '@module/auth/repository/impl/auth.repository.impl'

export async function registerAuthModule() {
  container.register<EmailVerificationRepository>("EmailVerificationRepository", { useClass: EmailVerificationRepositoryImpl })
  container.register<AuthService>("AuthService", { useClass: AuthServiceImpl })
  container.register<AuthController>("AuthController", { useClass: AuthControllerImpl })
  container.register<AuthRepository>("AuthRepository", { useClass: AuthRepositoryImpl })
}
