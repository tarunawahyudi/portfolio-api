import { CreateUserRequest, ShowUserResponse, UserSignupResponse } from '@module/user/dto/user.dto'
import { ProfileResponse } from '@module/user/dto/profile.dto'

export interface UserService {
  create(data: CreateUserRequest): Promise<UserSignupResponse>
  showByUsername(username: string): Promise<ShowUserResponse>
  showUserProfileByUserId(userId: string): Promise<ProfileResponse>
}
