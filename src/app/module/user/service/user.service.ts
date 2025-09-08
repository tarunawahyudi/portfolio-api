import { CreateUserRequest, UserSignupResponse } from '@module/user/dto/user.dto'

export interface UserService {
  create(data: CreateUserRequest): Promise<UserSignupResponse>
}
