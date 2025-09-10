import { NewProfile, Profile } from '@module/user/entity/profile'

export interface ProfileRepository {
  save(data: NewProfile): Promise<void>
  findByUserId(userId: string): Promise<Profile | null>
}
