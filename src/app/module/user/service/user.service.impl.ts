import { inject, injectable } from 'tsyringe'
import type { UserService } from '@module/user/service/user.service'
import type { UserRepository } from '@module/user/repository/user.repository'
import { CreateUserRequest, UserSignupResponse } from '@module/user/dto/user.dto'

@injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  async create(data: CreateUserRequest): Promise<UserSignupResponse> {
    const passwordHash = await Bun.password.hash(data.password, {
      algorithm: 'bcrypt',
      cost: 10,
    })

    const row = await this.userRepository.save({
      name: data.name,
      email: data.email,
      username: data.username,
      passwordHash,
    })

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      username: row.username,
      status: row.status,
    }
  }
}
