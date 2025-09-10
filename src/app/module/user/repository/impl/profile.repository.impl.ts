import { injectable } from 'tsyringe'
import { ProfileRepository } from '@module/user/repository/profile.repository'
import { NewProfile, Profile, ProfileWithEmail } from '@module/user/entity/profileWithEmail'
import { db } from '@db/index'
import { eq } from 'drizzle-orm'
import { profiles } from '@db/schema'
import { getDbOrTx } from '@shared/decorator/transactional.decorator'

@injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
  async findByUserId(userId: string): Promise<ProfileWithEmail | null> {
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

  async update(userId: string, data: Partial<NewProfile>): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning()

    return updatedProfile
  }

  async updateAvatar(userId: string, avatarKey: string): Promise<void> {
    await db
      .update(profiles)
      .set({ avatar: avatarKey, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
  }
}

