import { AuthRepository } from '@module/auth/repository/auth.repository'
import { db } from '@db/index'
import { eq, or } from 'drizzle-orm'
import { loginAttempts, users } from '@db/schema'
import { User } from '@module/user/entity/user'
import { LoginAttempt } from '@module/auth/entity/login-attempt'
import { injectable } from 'tsyringe'

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
        where: or(
          eq(users.email, identifier),
          eq(users.username, identifier)
        )
      })

    return row ?? null
  }

  async logAttempt(data: LoginAttempt): Promise<void> {
    await db.insert(loginAttempts).values(data)
  }

  async resetFailedAttempts(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ failedAttempts: 0, lockUntil: null })
      .where(eq(users.id, userId))
  }

  async updateFailedAttempt(userId: number, failedAttempts: number, lockUntil?: Date): Promise<void> {
    await db
      .update(users)
      .set({ failedAttempts, lockUntil })
      .where(eq(users.id, userId))
  }

  async findById(userId: number): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })
    return row ?? null
  }

  async updateRefreshToken(userId: number, tokenHash: string | null): Promise<void> {
    await db
      .update(users)
      .set({ currentHashedRefreshToken: tokenHash })
      .where(eq(users.id, userId))
  }
}
