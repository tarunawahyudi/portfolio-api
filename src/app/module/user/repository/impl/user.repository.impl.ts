import { NewUser, User } from '@module/user/entity/user'
import {injectable} from "tsyringe"
import type {UserRepository} from "@module/user/repository/user.repository"
import { db } from '@db/index'
import { users } from '@db/schema'
import { eq } from 'drizzle-orm'
import { getDbOrTx } from '@shared/decorator/transactional.decorator'

@injectable()
export class UserRepositoryImpl implements UserRepository {

  async save(data: NewUser): Promise<User> {
    const [inserted] = await db
      .insert(users)
      .values(data)
      .returning()

    return inserted
  }

  async markVerified(userId: string): Promise<void> {
    const dbOrTx = getDbOrTx()
    await dbOrTx
      .update(users)
      .set({
        isVerified: true,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await db.query.users
      .findFirst({
        where: eq(users.username, username),
      })

    return row ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await db.query.users
      .findFirst({
        where: eq(users.email, email)
      })

    return row ?? null
  }
}
