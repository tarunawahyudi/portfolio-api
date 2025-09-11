import { User } from '@module/user/entity/user'
import { NewLoginAttempt } from '@module/auth/entity/login-attempt'
import { NewPasswordReset, PasswordReset } from '@module/auth/entity/password-reset'

export interface AuthRepository {
  findByEmailOrUsername(identifier: string): Promise<User | null>;
  updateFailedAttempt(userId: string, failedAttempts: number, lockUntil?: Date): Promise<void>;
  resetFailedAttempts(userId: string): Promise<void>;
  logAttempt(data: NewLoginAttempt): Promise<void>;
  findById(userId: string): Promise<User | null>;
  updateRefreshToken(userId: string, tokenHash: string | null): Promise<void>;
  createPasswordResetToken(data: NewPasswordReset): Promise<void>
  findPasswordReset(tokenHash: string): Promise<{ token: PasswordReset; user: User } | null>
  deletePasswordResetToken(id: string): Promise<void>
  markPasswordResetTokenAsUsed(id: string): Promise<void>
}
