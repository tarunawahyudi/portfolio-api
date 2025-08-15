import {User} from "@module/user/entity/user.entity"

export interface UserRepository {
  create(data: Partial<User>): User
  save(user: User): Promise<User>
  findAll(): Promise<User[]>
  findByEmail(email: string): Promise<User | null>
}
