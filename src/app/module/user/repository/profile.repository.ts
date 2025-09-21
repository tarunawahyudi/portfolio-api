import { NewProfile, ProfileWithEmail } from '@module/user/entity/profileWithEmail'

export interface ProfileRepository {
  save(data: NewProfile): Promise<void>
  findByUserId(userId: string): Promise<ProfileWithEmail | null>
  update(userId: string, data: Partial<NewProfile>): Promise<ProfileWithEmail | null>
  updateAvatar(userId: string, avatarKey: string): Promise<void>
}
