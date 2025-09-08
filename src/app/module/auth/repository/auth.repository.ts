import { User } from '@module/user/entity/user'
import { NewLoginAttempt } from '@module/auth/entity/login-attempt'

export interface AuthRepository {
  findByEmailOrUsername(identifier: string): Promise<User | null>;
  updateFailedAttempt(userId: number, failedAttempts: number, lockUntil?: Date): Promise<void>;
  resetFailedAttempts(userId: number): Promise<void>;
  logAttempt(data: NewLoginAttempt): Promise<void>;
  findById(userId: number): Promise<User | null>;
  updateRefreshToken(userId: number, tokenHash: string | null): Promise<void>;
}
