import { AuthRepository } from '@module/auth/repository/auth.repository'
import { db } from '@db/index'
import { eq, or } from 'drizzle-orm'
import { loginAttempts, passwordResets, users } from '@db/schema'
import { User } from '@module/user/entity/user'
import { NewLoginAttempt } from '@module/auth/entity/login-attempt'
import { injectable } from 'tsyringe'
import { NewPasswordReset, PasswordReset } from '@module/auth/entity/password-reset'

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: or(eq(users.email, identifier), eq(users.username, identifier)),
    })

    return row ?? null
  }

  async logAttempt(data: NewLoginAttempt): Promise<void> {
    await db.insert(loginAttempts).values(data)
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await db.update(users).set({ failedAttempts: 0, lockUntil: null }).where(eq(users.id, userId))
  }

  async updateFailedAttempt(
    userId: string,
    failedAttempts: number,
    lockUntil?: Date,
  ): Promise<void> {
    await db.update(users).set({ failedAttempts, lockUntil }).where(eq(users.id, userId))
  }

  async findById(userId: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })
    return row ?? null
  }

  async updateRefreshToken(userId: string, tokenHash: string | null): Promise<void> {
    await db
      .update(users)
      .set({ currentHashedRefreshToken: tokenHash })
      .where(eq(users.id, userId))
  }

  async createPasswordResetToken(data: NewPasswordReset): Promise<void> {
    await db
      .delete(passwordResets)
      .where(eq(passwordResets.userId, data.userId))

    await db
      .insert(passwordResets)
      .values(data)
  }

  async findPasswordReset(
    tokenHash: string,
  ): Promise<{ token: PasswordReset; user: User } | null> {
    const row = await db.query.passwordResets.findFirst({
      where: eq(passwordResets.tokenHash, tokenHash),
      with: {
        user: true,
      },
    })
    return row ? { token: row, user: row.user } : null
  }

  async markPasswordResetTokenAsUsed(id: string): Promise<void> {
    await db
      .update(passwordResets)
      .set({ isUsed: true })
      .where(eq(passwordResets.id, id))
  }

  async deletePasswordResetToken(id: string): Promise<void> {
    await db
      .delete(passwordResets)
      .where(eq(passwordResets.id, id))
  }
}
