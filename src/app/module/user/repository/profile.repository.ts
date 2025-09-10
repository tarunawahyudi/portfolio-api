import { ProfileWithEmail } from '@module/user/entity/profile'

export interface ProfileRepository {
  findByUserId(userId: string): Promise<ProfileWithEmail | null>
}
