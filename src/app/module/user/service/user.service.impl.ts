import {inject, injectable} from "tsyringe"
import {User} from "@module/user/entity/user.entity"
import type {UserService} from "@module/user/service/user.service"
import type {UserRepository} from "@module/user/repository/user.repository"
import {AppException} from "@core/exception/app.exception"

@injectable()
export class UserServiceImpl implements UserService {
  constructor(@inject("UserRepository") private readonly userRepository: UserRepository) {}

  async createUser(data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email!)
    if (existingUser) throw new AppException("USER-001")

    const user = this.userRepository.create(data)
    return this.userRepository.save(user)
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new AppException("USER-002")
    return user
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}
