import { NewUser, User } from '@module/user/entity/user'

export interface UserRepository {
  save(data: NewUser): Promise<User>
  findByUsername(username: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  markVerified(userId: string): Promise<void>
}
