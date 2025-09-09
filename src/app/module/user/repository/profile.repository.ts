import { User } from '@module/user/entity/user'

export interface ProfileRepository {
  findByUserId(userId: string): Promise<User | null>
}
