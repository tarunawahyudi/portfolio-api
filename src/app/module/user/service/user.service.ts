import {User} from "@module/user/entity/user.entity"

export interface UserService {
  createUser(data: Partial<User>): Promise<User>
  getAll(): Promise<User[]>
  getUserByEmail(email: string): Promise<User | null>
}
