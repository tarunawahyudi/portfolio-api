import { CreateUserRequest, ShowUserResponse, UserSignupResponse } from '@module/user/dto/user.dto'

export interface UserService {
  create(data: CreateUserRequest): Promise<UserSignupResponse>
  showByUsername(username: string): Promise<ShowUserResponse>
}
