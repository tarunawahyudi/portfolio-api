import { NewProfile, Profile, ProfileWithEmail } from '@module/user/entity/profileWithEmail'

export interface ProfileRepository {
  save(data: NewProfile): Promise<void>
  findByUserId(userId: string): Promise<ProfileWithEmail | null>
  update(userId: string, data: Partial<NewProfile>): Promise<Profile>
  updateAvatar(userId: string, avatarKey: string): Promise<void>
}
