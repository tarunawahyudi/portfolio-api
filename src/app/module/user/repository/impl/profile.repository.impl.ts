import { injectable } from 'tsyringe'
import { ProfileRepository } from '@module/user/repository/profile.repository'
import { NewProfile, Profile } from '@module/user/entity/profile'
import { db } from '@db/index'
import { eq } from 'drizzle-orm'
import { profiles } from '@db/schema'
import { getDbOrTx } from '@shared/decorator/transactional.decorator'

@injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
  async findByUserId(userId: string): Promise<Profile | null> {
    const row = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
      with: {
        user: {
          columns: {
            email: true
          },
        },
      },
    })

    if (!row) return null
    return {
      ...row,
      email: row.user.email,
    }
  }

  async save(data: NewProfile): Promise<void> {
    const dbOrTx = getDbOrTx()
    await dbOrTx
      .insert(profiles)
      .values(data)
  }
}

