import { ProfileRepository } from '@module/user/repository/profile.repository'
import { db } from '@db/index'
import { eq } from 'drizzle-orm'
import { profiles } from '@db/schema'
import { ProfileWithEmail } from '@module/user/entity/profile'
import { injectable } from 'tsyringe'

@injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
  async findByUserId(userId: string): Promise<ProfileWithEmail | null> {
    const row = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
      with: {
        user: {
          columns: { email: true },
        },
      },
    })

    if (!row) return null
    return {
      ...row,
      email: row.user.email,
    }
  }
}
