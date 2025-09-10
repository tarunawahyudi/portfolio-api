import { UserWithRole } from '@module/user/entity/user'
import { NewLoginAttempt } from '@module/auth/entity/login-attempt'

export interface AuthRepository {
  findByEmailOrUsername(identifier: string): Promise<UserWithRole | null>;
  updateFailedAttempt(userId: string, failedAttempts: number, lockUntil?: Date): Promise<void>;
  resetFailedAttempts(userId: string): Promise<void>;
  logAttempt(data: NewLoginAttempt): Promise<void>;
  findById(userId: string): Promise<UserWithRole | null>;
  updateRefreshToken(userId: string, tokenHash: string | null): Promise<void>;
}
