import { NewUser, User } from '@module/user/entity/user'

export interface UserRepository {
  save(data: NewUser): Promise<User>
}
